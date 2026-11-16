from fastapi import APIRouter, Depends
from typing import Optional, Dict, Any
from backend.app.schemas.schemas import ValuationInput
from backend.app.api.deps import get_current_user, get_current_user_optional, record_audit
from backend.app.services.valuation_service import valuation_service
from backend.app.database.repo import repo

router = APIRouter(prefix="/valuation", tags=["Property Valuation"])

@router.post("/predict")
def predict_property_valuation(
    input_data: ValuationInput,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
):
    result = valuation_service.predict_valuation(input_data.dict())
    user_id = current_user["id"] if current_user else 1
    
    val_record = repo.create_valuation({
        "property_id": input_data.property_id,
        "estimated_value": result["estimated_value"],
        "price_per_sqft": result["price_per_sqft"],
        "lower_bound": result["lower_bound"],
        "upper_bound": result["upper_bound"],
        "confidence_score": result["confidence_score"],
        "model_version": result["model_version"],
        "model_mode": result["model_mode"],
        "feature_contributions": result["feature_contributions"],
        "comparable_sales": result["comparable_sales"],
        "location_insights": result["location_insights"],
        "notes": f"Automated ML valuation executed for {input_data.locality}, {input_data.city}"
    }, user_id=user_id)

    if input_data.property_id:
        repo.update_property_valuation(input_data.property_id, result["estimated_value"])

    if current_user:
        record_audit(current_user, "VALUATION_EXECUTED", "PropertyValuation", str(val_record["id"]), f"Valuation computed: INR {result['estimated_value']}")

    return {
        "id": val_record["id"],
        "estimated_value": result["estimated_value"],
        "price_per_sqft": result["price_per_sqft"],
        "lower_bound": result["lower_bound"],
        "upper_bound": result["upper_bound"],
        "confidence_score": result["confidence_score"],
        "model_version": result["model_version"],
        "model_mode": result["model_mode"],
        "feature_contributions": result["feature_contributions"],
        "comparable_sales": result["comparable_sales"],
        "location_insights": result["location_insights"],
        "valuation_timestamp": val_record["created_at"]
    }

@router.get("/history")
def get_valuation_history(
    property_id: Optional[int] = None,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    user_id = current_user["id"] if current_user.get("account_type") == "Customer" else None
    return repo.list_valuations(user_id=user_id, property_id=property_id)
