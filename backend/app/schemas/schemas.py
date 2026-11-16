from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# User & Auth
class UserCreate(BaseModel):
    full_name: str
    email: str
    phone_number: Optional[str] = None
    password: str
    account_type: str = "Customer" # Customer, Bank Officer, Property Analyst, Admin

class UserLogin(BaseModel):
    email: str
    password: str
    remember_me: bool = False

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone_number: Optional[str] = None
    account_type: str
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# Property
class PropertyCreate(BaseModel):
    name: str
    property_type: str
    state: str
    district: Optional[str] = None
    city: str
    locality: str
    postal_code: Optional[str] = None
    full_address: str
    land_area_sqft: float
    built_up_area_sqft: float
    bedrooms: int = 2
    bathrooms: int = 2
    floors: int = 1
    property_age_years: int = 2
    construction_quality: str = "A Grade"
    property_condition: str = "Excellent"
    parking_spaces: int = 1
    amenities: List[str] = []
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None

class PropertyOut(PropertyCreate):
    id: int
    owner_id: Optional[int]
    status: str
    estimated_value: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Valuation
class ValuationInput(BaseModel):
    property_id: Optional[int] = None
    city: str
    locality: str
    property_type: str
    land_area_sqft: float
    built_up_area_sqft: float
    bedrooms: int = 2
    bathrooms: int = 2
    property_age_years: int = 2
    construction_quality: str = "A Grade"
    property_condition: str = "Excellent"
    parking_spaces: int = 1
    amenities: List[str] = []

class ValuationResultOut(BaseModel):
    id: Optional[int] = None
    estimated_value: float
    price_per_sqft: float
    lower_bound: float
    upper_bound: float
    confidence_score: float
    model_version: str
    model_mode: str
    feature_contributions: Dict[str, float]
    comparable_sales: List[Dict[str, Any]]
    location_insights: Dict[str, Any]
    valuation_timestamp: datetime

# Mortgage Underwriting
class LoanApplicationCreate(BaseModel):
    applicant_name: str
    email: str
    phone: str
    employment_type: str = "Salaried"
    employer: Optional[str] = None
    employment_duration_years: float = 3.0
    monthly_income: float
    other_income: float = 0.0
    existing_monthly_emi: float = 0.0
    existing_debt: float = 0.0
    credit_score: Optional[int] = 750
    requested_loan_amount: float
    loan_tenure_years: int = 20
    interest_rate_percent: float = 8.5
    down_payment: float = 0.0
    property_id: Optional[int] = None
    property_market_value: Optional[float] = None

class LoanReviewUpdate(BaseModel):
    status: str # Approved, Rejected, Escalated, Additional Information Required, Under Review
    reviewer_decision: str
    officer_notes: str

class LoanApplicationOut(BaseModel):
    id: int
    application_number: str
    applicant_id: int
    property_id: Optional[int] = None
    applicant_name: str
    email: str
    phone: str
    employment_type: str
    employer: Optional[str] = None
    employment_duration_years: float
    monthly_income: float
    other_income: float
    existing_monthly_emi: float
    existing_debt: float
    credit_score: Optional[int] = None
    requested_loan_amount: float
    loan_tenure_years: int
    interest_rate_percent: float
    down_payment: float
    property_market_value: Optional[float] = None
    estimated_monthly_emi: Optional[float] = None
    debt_to_income_ratio: Optional[float] = None
    loan_to_value_ratio: Optional[float] = None
    total_interest_payable: Optional[float] = None
    total_repayment_amount: Optional[float] = None
    repayment_capacity_rating: Optional[str] = None
    status: str
    officer_notes: Optional[str] = None
    reviewer_decision: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Risk
class RiskAssessmentOut(BaseModel):
    id: int
    loan_application_id: int
    property_risk_score: float
    borrower_risk_score: float
    overall_risk_score: float
    risk_category: str
    risk_contribution_breakdown: Dict[str, float]
    key_risk_factors: List[str]
    missing_data_flags: List[str]
    model_version: str
    recommendation: str
    created_at: datetime

    class Config:
        from_attributes = True

# Documents
class DocumentOut(BaseModel):
    id: int
    user_id: int
    loan_application_id: Optional[int] = None
    document_type: str
    file_name: str
    file_size_kb: float
    mime_type: str
    ocr_status: str
    verification_status: str
    extracted_text: Optional[str] = None
    extracted_fields: Dict[str, Any] = {}
    validation_flags: List[str] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Fraud Flags
class FraudFlagOut(BaseModel):
    id: int
    alert_code: str
    property_id: Optional[int] = None
    loan_application_id: Optional[int] = None
    alert_type: str
    severity: str
    detection_method: str
    reason: str
    status: str
    investigation_notes: Optional[str] = None
    resolved_by: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FraudFlagUpdate(BaseModel):
    status: str # Under Investigation, Escalated, Resolved, Open
    investigation_notes: str

# Market
class MarketDataPointOut(BaseModel):
    id: int
    city: str
    locality: str
    property_type: str
    average_price_sqft: float
    median_price: float
    volume_units_sold: int
    price_change_yoy_percent: float
    quarter: str
    recorded_date: datetime

    class Config:
        from_attributes = True

# Reports
class ReportOut(BaseModel):
    id: int
    report_number: str
    report_type: str
    title: str
    reference_id: Optional[str] = None
    generated_by: str
    summary: str
    details: Dict[str, Any] = {}
    pdf_filename: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# AI & BYOK
class AIChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None
    context_type: Optional[str] = "general" # valuation, underwriting, risk, fraud, general
    reference_id: Optional[str] = None

class AIChatResponse(BaseModel):
    conversation_id: int
    message: str
    provider_used: str
    model: str
    created_at: datetime

class BYOKKeyInput(BaseModel):
    api_key: str

class BYOKStatusOut(BaseModel):
    platform_api_status: str
    personal_api_key_status: str
    active_provider: str
    masked_key: Optional[str] = None
    is_personal_key_enabled: bool
    is_automatic_fallback_enabled: bool
    preferred_source: str
    last_validated_at: Optional[datetime] = None
    validation_status: str
    preferred_model: str

class BYOKPreferenceUpdate(BaseModel):
    is_personal_key_enabled: Optional[bool] = None
    is_automatic_fallback_enabled: Optional[bool] = None
    preferred_source: Optional[str] = None
    preferred_model: Optional[str] = None

class AIUsageOut(BaseModel):
    active_provider: str
    total_requests: int
    successful_requests: int
    failed_requests: int
    platform_requests: int
    personal_requests: int
    recent_switches: List[Dict[str, Any]]
    last_request_time: Optional[datetime] = None

# Notification
class NotificationOut(BaseModel):
    id: int
    category: str
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Audit & Admin
class AuditLogOut(BaseModel):
    id: int
    user_email: Optional[str] = None
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[str] = None
    ip_address: str
    timestamp: datetime

    class Config:
        from_attributes = True
