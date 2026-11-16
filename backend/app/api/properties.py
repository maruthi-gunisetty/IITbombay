from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from backend.app.schemas.schemas import PropertyCreate
from backend.app.api.deps import get_current_user, get_current_user_optional, record_audit
from backend.app.services.valuation_service import valuation_service
from backend.app.services.fraud_service import fraud_service
from backend.app.database.repo import repo

router = APIRouter(prefix="/properties", tags=["Properties"])

class PropertyInquiry(BaseModel):
    property_id: Optional[int] = None
    property_name: Optional[str] = None
    full_name: str
    email: str
    phone: Optional[str] = None
    preferred_date: Optional[str] = None
    message: Optional[str] = None
    inquiry_type: Optional[str] = "Tour Booking"

@router.get("")
def list_properties(
    city: Optional[str] = None,
    state: Optional[str] = None,
    property_type: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
):
    owner_id = None
    if current_user and current_user.get("account_type") == "Customer" and status == "my_properties":
        owner_id = current_user["id"]
    props = repo.list_properties(
        owner_id=owner_id, city=city, state=state,
        property_type=property_type, status=status if status != "my_properties" else None,
        search=search, min_price=min_price, max_price=max_price
    )
    return props

@router.post("/inquire")
def submit_property_inquiry(
    inquiry: PropertyInquiry,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
):
    # Notify admin and bank officers
    admin_users = repo.list_users(role="Admin")
    target_id = admin_users[0]["id"] if admin_users else 1
    
    repo.create_notification(
        user_id=target_id,
        category="Inquiry",
        title=f"New {inquiry.inquiry_type}: {inquiry.property_name or 'General Estate'}",
        message=f"{inquiry.full_name} ({inquiry.email}, {inquiry.phone or 'No phone'}) requested {inquiry.inquiry_type}. Date: {inquiry.preferred_date or 'Immediate'}. Notes: {inquiry.message or 'None'}",
        link="/dashboard/notifications"
    )

    return {
        "status": "success",
        "message": f"Thank you, {inquiry.full_name}. Your inquiry for {inquiry.property_name or 'Haven & Key Estates'} has been submitted to our private client advisory desk. An advisor will contact you within 2 hours.",
        "confirmation_code": f"HK-{inquiry.property_id or 'GEN'}-2026"
    }

@router.get("/{property_id}")
def get_property(
    property_id: int,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
):
    prop = repo.get_property(property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop

@router.post("")
def create_property(
    prop_in: PropertyCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    val_result = valuation_service.predict_valuation(prop_in.dict())
    est_value = val_result.get("estimated_value")

    data = prop_in.dict()
    data["estimated_value"] = est_value
    created = repo.create_property(data, owner_id=current_user["id"])

    # Anomaly checks
    anomalies = fraud_service.scan_for_anomalies(property_data={
        **data,
        "estimated_value": est_value
    })
    for a in anomalies:
        repo.create_fraud_flag({
            "alert_code": a["alert_code"],
            "property_id": created["id"],
            "alert_type": a["alert_type"],
            "severity": a["severity"],
            "detection_method": a["detection_method"],
            "reason": a["reason"],
            "status": "Open"
        })

    repo.create_notification(
        user_id=current_user["id"],
        category="Valuation",
        title="Property Registered & Valued",
        message=f"Property '{created['name']}' valued at INR {est_value:,.2f}",
        link=f"/dashboard/properties/{created['id']}"
    )

    record_audit(current_user, "PROPERTY_REGISTERED", "Property", str(created["id"]), f"Created {created['name']}")
    return created

@router.get("/{id}")
def get_property(
    id: int,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
):
    prop = repo.get_property(id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    
    return prop

@router.delete("/{id}")
def delete_property(
    id: int,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    prop = repo.get_property(id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")

    if current_user.get("account_type") == "Customer" and prop.get("owner_id") != current_user["id"]:
        raise HTTPException(status_code=403, detail="Unauthorized")

    repo.delete_property(id)
    record_audit(current_user, "PROPERTY_DELETED", "Property", str(id), f"Deleted {prop.get('name')}")
    return {"message": "Property record removed successfully"}
