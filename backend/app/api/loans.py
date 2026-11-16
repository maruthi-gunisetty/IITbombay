import uuid
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from backend.app.schemas.schemas import LoanApplicationCreate, LoanReviewUpdate
from backend.app.api.deps import get_current_user, require_bank_officer_or_admin, record_audit
from backend.app.services.underwriting_service import underwriting_service
from backend.app.services.risk_service import risk_service
from backend.app.services.fraud_service import fraud_service
from backend.app.database.repo import repo

router = APIRouter(prefix="/loans", tags=["Mortgage Underwriting"])

@router.get("")
def list_loans(
    status: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    applicant_id = current_user["id"] if current_user.get("account_type") == "Customer" else None
    return repo.list_loans(applicant_id=applicant_id, status=status)

@router.post("")
def apply_for_loan(
    loan_in: LoanApplicationCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    calc = underwriting_service.assess_application(loan_in.dict())
    app_no = f"LN-2026-{uuid.uuid4().hex[:6].upper()}"

    data = loan_in.dict()
    data.update({
        "application_number": app_no,
        "estimated_monthly_emi": calc["estimated_monthly_emi"],
        "debt_to_income_ratio": calc["debt_to_income_ratio"],
        "loan_to_value_ratio": calc["loan_to_value_ratio"],
        "total_interest_payable": calc["total_interest_payable"],
        "total_repayment_amount": calc["total_repayment_amount"],
        "repayment_capacity_rating": calc["repayment_capacity_rating"],
        "status": "Under Review"
    })

    new_app = repo.create_loan(data, applicant_id=current_user["id"])

    # Automated Risk Assessment
    risk_res = risk_service.analyze_risk(
        property_data={"property_age_years": 4, "property_condition": "Good", "construction_quality": "Standard"},
        borrower_data={
            "debt_to_income_ratio": calc["debt_to_income_ratio"],
            "loan_to_value_ratio": calc["loan_to_value_ratio"],
            "credit_score": loan_in.credit_score
        }
    )
    repo.create_risk_assessment({
        "loan_application_id": new_app["id"],
        "property_risk_score": risk_res["property_risk_score"],
        "borrower_risk_score": risk_res["borrower_risk_score"],
        "overall_risk_score": risk_res["overall_risk_score"],
        "risk_category": risk_res["risk_category"],
        "risk_contribution_breakdown": risk_res["risk_contribution_breakdown"],
        "key_risk_factors": risk_res["key_risk_factors"],
        "missing_data_flags": risk_res["missing_data_flags"],
        "model_version": risk_res["model_version"],
        "recommendation": risk_res["recommendation"]
    })

    # Fraud checks
    anomalies = fraud_service.scan_for_anomalies(loan_data={
        **loan_in.dict(),
        "loan_to_value_ratio": calc["loan_to_value_ratio"]
    })
    for a in anomalies:
        repo.create_fraud_flag({
            "alert_code": a["alert_code"],
            "loan_application_id": new_app["id"],
            "alert_type": a["alert_type"],
            "severity": a["severity"],
            "detection_method": a["detection_method"],
            "reason": a["reason"],
            "status": "Open"
        })

    repo.create_notification(
        user_id=current_user["id"],
        category="Mortgage",
        title="Mortgage Application Submitted",
        message=f"Application {app_no} queued for bank officer underwriting review.",
        link=f"/dashboard/mortgage/{new_app['id']}"
    )

    record_audit(current_user, "LOAN_APPLICATION_SUBMITTED", "LoanApplication", str(new_app["id"]), f"Submitted {app_no}")
    return new_app

@router.get("/{id}")
def get_loan(
    id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    loan = repo.get_loan(id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan application not found")
    if current_user.get("account_type") == "Customer" and loan.get("applicant_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Unauthorized")
    return loan

@router.patch("/{id}/review")
def review_loan(
    id: int,
    review_in: LoanReviewUpdate,
    officer: Dict[str, Any] = Depends(require_bank_officer_or_admin)
):
    loan = repo.get_loan(id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan application not found")

    updated = repo.update_loan_review(
        loan_id=id,
        status=review_in.status,
        decision=review_in.reviewer_decision,
        notes=review_in.officer_notes,
        reviewer=officer.get("full_name", "Officer")
    )

    repo.create_notification(
        user_id=loan["applicant_id"],
        category="Mortgage",
        title=f"Mortgage Decision: {review_in.status}",
        message=f"Lending Officer {officer.get('full_name')} reviewed application {loan['application_number']}: {review_in.reviewer_decision}",
        link=f"/dashboard/mortgage/{loan['id']}"
    )

    record_audit(officer, "LOAN_DECISION_RECORDED", "LoanApplication", str(id), f"Status updated to {review_in.status}")
    return updated
