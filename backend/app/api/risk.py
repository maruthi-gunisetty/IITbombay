from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from backend.app.api.deps import get_current_user, record_audit
from backend.app.services.risk_service import risk_service
from backend.app.database.repo import repo

router = APIRouter(prefix="/risk", tags=["Unified Risk Intelligence"])

@router.get("")
def list_risk_assessments(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    applicant_id = current_user["id"] if current_user.get("account_type") == "Customer" else None
    return repo.list_risk_assessments(applicant_id=applicant_id)

@router.get("/{id}")
def get_risk_assessment(
    id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    risk = repo.get_risk_assessment(id)
    if not risk:
        raise HTTPException(status_code=404, detail="Risk assessment not found")
    
    if current_user.get("account_type") == "Customer":
        loan = repo.get_loan(risk.get("loan_application_id"))
        if loan and loan.get("applicant_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
    
    return risk

@router.post("/analyze")
def run_risk_analysis(
    payload: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    property_data = payload.get("property_data", {})
    borrower_data = payload.get("borrower_data", {})
    
    result = risk_service.analyze_risk(property_data, borrower_data)
    record_audit(current_user, "RISK_ANALYSIS_SIMULATION", "RiskAssessment", None, f"Score: {result['overall_risk_score']}")
    return result
