from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from backend.app.api.deps import require_admin, record_audit
from backend.app.database.repo import repo
from backend.app.core.config import settings

router = APIRouter(prefix="/admin", tags=["Administration & Governance"])

@router.get("/overview")
def get_admin_overview(admin: Dict[str, Any] = Depends(require_admin)):
    stats = repo.get_dashboard_overview(is_customer=False)
    users = repo.list_users()
    active_users = sum(1 for u in users if u.get("is_active"))
    
    return {
        "total_users": len(users),
        "active_users": active_users,
        "total_properties": stats["total_properties"],
        "total_loan_applications": stats["active_loan_applications"],
        "total_valuations_completed": stats["valuations_completed"],
        "documents_processed": stats["documents_processed"],
        "fraud_alerts_recorded": stats["fraud_alerts"],
        "ai_gateway_requests": 84,
        "system_status": "Healthy / Operational",
        "platform_ai_configured": bool(settings.OPENROUTER_API_KEY)
    }

@router.get("/users")
def list_users(
    role: Optional[str] = None,
    admin: Dict[str, Any] = Depends(require_admin)
):
    return repo.list_users(role=role)

@router.patch("/users/{id}/role")
def update_user_role(
    id: int,
    payload: dict,
    admin: Dict[str, Any] = Depends(require_admin)
):
    target = repo.get_user_by_id(id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    new_role = payload.get("account_type")
    if new_role not in ["Customer", "Bank Officer", "Property Analyst", "Admin"]:
        raise HTTPException(status_code=400, detail="Invalid account role")

    updated = repo.update_user_role(id, new_role)
    record_audit(admin, "ROLE_UPDATED", "User", str(id), f"Changed role of {target['email']} to {new_role}")
    return updated

@router.patch("/users/{id}/status")
def toggle_user_active_status(
    id: int,
    payload: dict,
    admin: Dict[str, Any] = Depends(require_admin)
):
    target = repo.get_user_by_id(id)
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    is_active = payload.get("is_active", True)
    updated = repo.update_user_status(id, is_active)
    record_audit(admin, "USER_STATUS_TOGGLED", "User", str(id), f"Active status set to {is_active}")
    return updated

@router.get("/audit-logs")
def list_audit_logs(
    limit: int = 100,
    admin: Dict[str, Any] = Depends(require_admin)
):
    return repo.list_audit_logs(limit=limit)
