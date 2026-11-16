from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from backend.app.schemas.schemas import FraudFlagUpdate
from backend.app.api.deps import get_current_user, require_bank_officer_or_admin, record_audit
from backend.app.database.repo import repo

router = APIRouter(prefix="/fraud", tags=["Fraud & Anomaly Detection"])

@router.get("/alerts")
def list_fraud_alerts(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    return repo.list_fraud_flags(status=status, severity=severity)

@router.get("/stats")
def get_fraud_stats(
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    flags = repo.list_fraud_flags()
    total = len(flags)
    high_priority = sum(1 for f in flags if f.get("severity") in ("High", "Critical"))
    under_inv = sum(1 for f in flags if f.get("status") == "Under Investigation")
    resolved = sum(1 for f in flags if f.get("status") == "Resolved")
    open_cnt = sum(1 for f in flags if f.get("status") == "Open")

    return {
        "total_alerts": total,
        "high_priority_alerts": high_priority,
        "under_investigation": under_inv,
        "resolved_alerts": resolved,
        "open_alerts": open_cnt
    }

@router.get("/alerts/{id}")
def get_fraud_alert(
    id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    alert = repo.get_fraud_flag(id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.patch("/alerts/{id}")
def update_fraud_alert(
    id: int,
    payload: FraudFlagUpdate,
    officer: Dict[str, Any] = Depends(require_bank_officer_or_admin)
):
    alert = repo.get_fraud_flag(id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    updated = repo.update_fraud_flag(
        flag_id=id,
        status=payload.status,
        notes=payload.investigation_notes,
        resolved_by=officer.get("full_name") if payload.status == "Resolved" else None
    )

    record_audit(officer, "FRAUD_ALERT_UPDATED", "FraudFlag", str(id), f"Alert status set to {payload.status}")
    return updated
