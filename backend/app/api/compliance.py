from typing import Dict, Any
from fastapi import APIRouter, Depends
from backend.app.api.deps import get_current_user
from backend.app.database.repo import repo

router = APIRouter(prefix="/compliance", tags=["Compliance & Governance"])

@router.get("/consents")
def list_user_consents(current_user: Dict[str, Any] = Depends(get_current_user)):
    return repo.list_consents(current_user["id"])

@router.get("/governance")
def get_governance_framework():
    return {
        "framework_version": "PropWise Responsible AI Charter v2.4 (2026)",
        "human_in_the_loop_mandate": "Active: All credit and underwriting approvals enforce non-delegable human lending officer sign-off.",
        "protected_characteristics_policy": "Strict exclusion of sensitive personal attributes from all ML valuation and risk ranking models.",
        "audit_traceability": "Immutable cryptographically linked audit trails for every inference, key switch, and human adjudication.",
        "data_retention_days": 1825,
        "grievance_officer_contact": "compliance@propwise.ai"
    }
