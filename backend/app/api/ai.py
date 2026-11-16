from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from backend.app.schemas.schemas import (
    AIChatRequest, BYOKKeyInput, BYOKPreferenceUpdate
)
from backend.app.api.deps import get_current_user, record_audit
from backend.app.services.ai_service import ai_service
from backend.app.security.crypto import encrypt_api_key, mask_api_key
from backend.app.database.repo import repo
from backend.app.core.config import settings

router = APIRouter(prefix="/ai", tags=["PropWise Intelligence & BYOK"])

@router.post("/chat")
async def chat_with_assistant(
    req: AIChatRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    conv_id = req.conversation_id
    if not conv_id:
        conv = repo.create_ai_conversation(current_user["id"], f"Session: {req.message[:30]}")
        conv_id = conv["id"]

    context_data = {}
    if req.context_type == "valuation" and req.reference_id:
        try:
            prop = repo.get_property(int(req.reference_id))
            if prop:
                context_data = {
                    "Property Name": prop.get("name"),
                    "City & Locality": f"{prop.get('locality')}, {prop.get('city')}",
                    "Estimated Valuation": f"INR {prop.get('estimated_value', 0):,.2f}",
                    "Built-up Area": f"{prop.get('built_up_area_sqft')} sqft",
                    "Bedrooms / Bathrooms": f"{prop.get('bedrooms')} BHK, {prop.get('bathrooms')} Baths",
                    "Quality & Condition": f"{prop.get('construction_quality')}, {prop.get('property_condition')}"
                }
        except Exception:
            pass
    elif req.context_type == "underwriting" and req.reference_id:
        try:
            loan = repo.get_loan(int(req.reference_id))
            if loan:
                context_data = {
                    "Application Number": loan.get("application_number"),
                    "Applicant Name": loan.get("applicant_name"),
                    "Requested Loan": f"INR {loan.get('requested_loan_amount', 0):,.2f}",
                    "Calculated EMI": f"INR {loan.get('estimated_monthly_emi', 0):,.2f}",
                    "DTI Ratio": f"{loan.get('debt_to_income_ratio')}%",
                    "LTV Ratio": f"{loan.get('loan_to_value_ratio')}%",
                    "Repayment Capacity": loan.get("repayment_capacity_rating"),
                    "Status": loan.get("status")
                }
        except Exception:
            pass

    history = repo.get_conversation_messages(conv_id)
    repo.add_ai_message(conv_id, "user", req.message, req.context_type)

    result = await ai_service.chat_completion(
        user_id=current_user["id"],
        prompt=req.message,
        context_data=context_data,
        conversation_history=history
    )

    repo.add_ai_message(conv_id, "assistant", result["message"], req.context_type)

    return {
        "conversation_id": conv_id,
        "message": result["message"],
        "provider_used": result["provider_used"],
        "model": result["model"],
        "created_at": datetime.utcnow().isoformat()
    }

@router.get("/conversations")
def list_conversations(current_user: Dict[str, Any] = Depends(get_current_user)):
    return repo.list_ai_conversations(current_user["id"])

@router.get("/conversations/{id}/messages")
def get_conversation_messages(
    id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    return repo.get_conversation_messages(id)

# BYOK endpoints

@router.get("/keys/status")
def get_byok_status(current_user: Dict[str, Any] = Depends(get_current_user)):
    cred = repo.get_user_ai_credentials(current_user["id"])
    platform_status = "Available / Active" if settings.OPENROUTER_API_KEY else "Awaiting Platform Configuration"

    if not cred or not cred.get("encrypted_key"):
        return {
            "platform_api_status": platform_status,
            "personal_api_key_status": "Not Configured",
            "active_provider": "Platform",
            "masked_key": None,
            "is_personal_key_enabled": False,
            "is_automatic_fallback_enabled": True,
            "preferred_source": "Platform",
            "last_validated_at": None,
            "validation_status": "Not Configured",
            "preferred_model": settings.OPENROUTER_MODEL
        }

    active = "Personal" if cred.get("is_personal_key_enabled") and cred.get("preferred_source") == "Personal" else "Platform"

    return {
        "platform_api_status": platform_status,
        "personal_api_key_status": cred.get("validation_status", "Valid"),
        "active_provider": active,
        "masked_key": cred.get("key_masked"),
        "is_personal_key_enabled": bool(cred.get("is_personal_key_enabled")),
        "is_automatic_fallback_enabled": bool(cred.get("is_automatic_fallback_enabled")),
        "preferred_source": cred.get("preferred_source", "Platform"),
        "last_validated_at": cred.get("last_validated_at"),
        "validation_status": cred.get("validation_status", "Valid"),
        "preferred_model": cred.get("preferred_model", settings.OPENROUTER_MODEL)
    }

@router.post("/keys/validate")
async def validate_key_test(payload: BYOKKeyInput):
    is_valid, msg = await ai_service.validate_openrouter_key(payload.api_key)
    return {"valid": is_valid, "message": msg}

@router.post("/keys")
async def set_personal_api_key(
    payload: BYOKKeyInput,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    key = (payload.api_key or "").strip()
    if not key:
        raise HTTPException(status_code=400, detail="API key cannot be empty")

    is_valid, validation_msg = await ai_service.validate_openrouter_key(key)

    encrypted = encrypt_api_key(key)
    masked = mask_api_key(key)

    repo.upsert_user_ai_credentials(current_user["id"], encrypted, masked)
    repo.update_user_ai_preferences(
        user_id=current_user["id"],
        is_personal_enabled=True,
        is_fallback_enabled=True,
        preferred_source="Personal"
    )
    record_audit(current_user, "BYOK_KEY_CONFIGURED", "UserAICredential", None, f"Personal API key encrypted and saved: {validation_msg}")
    return get_byok_status(current_user=current_user)

@router.delete("/keys")
def remove_personal_api_key(current_user: Dict[str, Any] = Depends(get_current_user)):
    repo.delete_user_ai_credentials(current_user["id"])
    record_audit(current_user, "BYOK_KEY_PURGED", "UserAICredential", None, "Personal key securely erased")
    return {"message": "Personal API key securely removed from your account"}

@router.patch("/keys/preferences")
def update_byok_preferences(
    payload: BYOKPreferenceUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    repo.update_user_ai_preferences(
        user_id=current_user["id"],
        is_personal_enabled=payload.is_personal_key_enabled,
        is_fallback_enabled=payload.is_automatic_fallback_enabled,
        preferred_source=payload.preferred_source,
        preferred_model=payload.preferred_model
    )
    record_audit(current_user, "BYOK_PREFERENCES_UPDATED", "UserAICredential", None, "AI preferences updated")
    return get_byok_status(current_user=current_user)

@router.get("/usage")
def get_ai_usage(current_user: Dict[str, Any] = Depends(get_current_user)):
    cred = repo.get_user_ai_credentials(current_user["id"])
    active_prov = "Personal" if cred and cred.get("is_personal_key_enabled") and cred.get("preferred_source") == "Personal" else "Platform"
    stats = repo.get_ai_usage_stats(current_user["id"])
    stats["active_provider"] = active_prov
    return stats
