import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from backend.app.database.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(String(30), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    account_type = Column(String(50), default="Customer", nullable=False) # Customer, Bank Officer, Property Analyst, Admin
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    properties = relationship("Property", back_populates="owner")
    loan_applications = relationship("LoanApplication", back_populates="applicant")
    documents = relationship("UploadedDocument", back_populates="uploader")
    ai_credentials = relationship("UserAICredential", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")
    audit_logs = relationship("AuditLog", back_populates="user")

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(200), nullable=False)
    property_type = Column(String(50), nullable=False) # Apartment, Villa, Commercial, Penthouse, Residential Plot
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=True)
    city = Column(String(100), nullable=False, index=True)
    locality = Column(String(150), nullable=False, index=True)
    postal_code = Column(String(20), nullable=True)
    full_address = Column(Text, nullable=False)
    land_area_sqft = Column(Float, nullable=False)
    built_up_area_sqft = Column(Float, nullable=False)
    bedrooms = Column(Integer, default=2)
    bathrooms = Column(Integer, default=2)
    floors = Column(Integer, default=1)
    property_age_years = Column(Integer, default=2)
    construction_quality = Column(String(50), default="A Grade") # A Grade, Premium, Standard, Economy
    property_condition = Column(String(50), default="Excellent") # Excellent, Good, Fair, Needs Renovation
    parking_spaces = Column(Integer, default=1)
    amenities = Column(JSON, default=list) # e.g. ["Clubhouse", "Gym", "Power Backup", "Security"]
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String(50), default="Active") # Active, Draft, Under Evaluation, Loan Collateral
    estimated_value = Column(Float, nullable=True)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="properties")
    valuations = relationship("PropertyValuation", back_populates="property")
    loan_applications = relationship("LoanApplication", back_populates="property")
    fraud_flags = relationship("FraudFlag", back_populates="property")

class PropertyValuation(Base):
    __tablename__ = "property_valuations"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    estimated_value = Column(Float, nullable=False)
    price_per_sqft = Column(Float, nullable=False)
    lower_bound = Column(Float, nullable=False)
    upper_bound = Column(Float, nullable=False)
    confidence_score = Column(Float, default=0.92) # e.g. 0.92
    model_version = Column(String(50), default="PropWise-RF-v2.4")
    model_mode = Column(String(30), default="Verified ML Engine") # Verified ML Engine or Demo Mode
    feature_contributions = Column(JSON, default=dict) # SHAP style feature impacts
    comparable_sales = Column(JSON, default=list)
    location_insights = Column(JSON, default=dict)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    property = relationship("Property", back_populates="valuations")

class LoanApplication(Base):
    __tablename__ = "loan_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String(50), unique=True, index=True, nullable=False)
    applicant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    
    applicant_name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(30), nullable=False)
    employment_type = Column(String(50), default="Salaried") # Salaried, Self-Employed Professional, Business Owner
    employer = Column(String(150), nullable=True)
    employment_duration_years = Column(Float, default=3.0)
    monthly_income = Column(Float, nullable=False)
    other_income = Column(Float, default=0.0)
    existing_monthly_emi = Column(Float, default=0.0)
    existing_debt = Column(Float, default=0.0)
    credit_score = Column(Integer, nullable=True) # CIBIL/Experian consented
    
    requested_loan_amount = Column(Float, nullable=False)
    loan_tenure_years = Column(Integer, default=20)
    interest_rate_percent = Column(Float, default=8.5)
    down_payment = Column(Float, default=0.0)
    property_market_value = Column(Float, nullable=True)
    
    # Financial metrics calculated
    estimated_monthly_emi = Column(Float, nullable=True)
    debt_to_income_ratio = Column(Float, nullable=True) # DTI %
    loan_to_value_ratio = Column(Float, nullable=True) # LTV %
    total_interest_payable = Column(Float, nullable=True)
    total_repayment_amount = Column(Float, nullable=True)
    repayment_capacity_rating = Column(String(50), default="Strong")
    
    status = Column(String(50), default="Submitted") 
    # Draft, Submitted, Under Review, Additional Information Required, Escalated, Reviewed, Approved, Rejected, Closed
    officer_notes = Column(Text, nullable=True)
    reviewer_decision = Column(String(50), nullable=True)
    reviewed_by = Column(String(120), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    applicant = relationship("User", back_populates="loan_applications")
    property = relationship("Property", back_populates="loan_applications")
    risk_assessment = relationship("RiskAssessment", back_populates="loan_application", uselist=False)
    documents = relationship("UploadedDocument", back_populates="loan_application")
    fraud_flags = relationship("FraudFlag", back_populates="loan_application")

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    loan_application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=False)
    property_risk_score = Column(Float, nullable=False) # 0 - 100
    borrower_risk_score = Column(Float, nullable=False) # 0 - 100
    overall_risk_score = Column(Float, nullable=False) # 0 - 100
    risk_category = Column(String(50), nullable=False) # Low, Moderate, High, Critical, Insufficient Data
    risk_contribution_breakdown = Column(JSON, default=dict)
    key_risk_factors = Column(JSON, default=list)
    missing_data_flags = Column(JSON, default=list)
    model_version = Column(String(50), default="PropWise-RiskPolicy-v3.1")
    recommendation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    loan_application = relationship("LoanApplication", back_populates="risk_assessment")

class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    loan_application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=True)
    document_type = Column(String(80), nullable=False) # Identity Proof, Income Proof, Bank Statement, Property Document, Tax Document
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size_kb = Column(Float, default=0.0)
    mime_type = Column(String(100), default="application/pdf")
    ocr_status = Column(String(50), default="Processed") # Pending, Processing, Processed, Failed
    verification_status = Column(String(50), default="Verified") # Verified, Needs Review, Discrepancy Found
    extracted_text = Column(Text, nullable=True)
    extracted_fields = Column(JSON, default=dict)
    validation_flags = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    uploader = relationship("User", back_populates="documents")
    loan_application = relationship("LoanApplication", back_populates="documents")

class FraudFlag(Base):
    __tablename__ = "fraud_flags"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_code = Column(String(50), unique=True, index=True, nullable=False)
    property_id = Column(Integer, ForeignKey("properties.id"), nullable=True)
    loan_application_id = Column(Integer, ForeignKey("loan_applications.id"), nullable=True)
    alert_type = Column(String(100), nullable=False) # Valuation Inflation Spike, Duplicate Asset Registration, Income-to-Debt Inconsistency, High Risk LTV Anomaly
    severity = Column(String(30), default="Medium") # Low, Medium, High, Critical
    detection_method = Column(String(100), default="Multi-Param Heuristic & Isolation Forest")
    reason = Column(Text, nullable=False)
    status = Column(String(50), default="Open") # Open, Under Investigation, Escalated, Resolved
    investigation_notes = Column(Text, nullable=True)
    resolved_by = Column(String(120), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    property = relationship("Property", back_populates="fraud_flags")
    loan_application = relationship("LoanApplication", back_populates="fraud_flags")

class MarketDataPoint(Base):
    __tablename__ = "market_data"
    
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), nullable=False, index=True)
    locality = Column(String(150), nullable=False, index=True)
    property_type = Column(String(50), nullable=False)
    average_price_sqft = Column(Float, nullable=False)
    median_price = Column(Float, nullable=False)
    volume_units_sold = Column(Integer, default=50)
    price_change_yoy_percent = Column(Float, default=6.5)
    quarter = Column(String(20), nullable=False) # e.g. "Q1 2026"
    recorded_date = Column(DateTime, default=datetime.datetime.utcnow)

class ReportRecord(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    report_number = Column(String(50), unique=True, index=True, nullable=False)
    report_type = Column(String(100), nullable=False) # Property Valuation Report, Mortgage Underwriting Dossier, Unified Risk Intelligence Report, Fraud Audit Report, Market Analytics Dossier
    title = Column(String(255), nullable=False)
    reference_id = Column(String(100), nullable=True)
    generated_by = Column(String(120), nullable=False)
    summary = Column(Text, nullable=False)
    details = Column(JSON, default=dict)
    pdf_filename = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), default="Property Intelligence Session")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    messages = relationship("AIMessage", back_populates="conversation")

class AIMessage(Base):
    __tablename__ = "ai_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id"), nullable=False)
    sender = Column(String(30), nullable=False) # user or assistant
    content = Column(Text, nullable=False)
    context_type = Column(String(50), nullable=True) # valuation, underwriting, risk, fraud, general
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("AIConversation", back_populates="messages")

class UserAICredential(Base):
    """Secure BYOK (Bring Your Own Key) OpenRouter configuration per user."""
    __tablename__ = "user_ai_credentials"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    encrypted_key = Column(Text, nullable=True) # AES-256-GCM encrypted hex
    key_masked = Column(String(50), nullable=True) # e.g. "sk-or-••••••••1234"
    is_personal_key_enabled = Column(Boolean, default=False)
    is_automatic_fallback_enabled = Column(Boolean, default=True) # If platform key hits quota, fallback to personal key
    preferred_source = Column(String(30), default="Platform") # Platform or Personal
    last_validated_at = Column(DateTime, nullable=True)
    validation_status = Column(String(30), default="Not Configured") # Valid, Invalid, Not Configured
    preferred_model = Column(String(100), default="google/gemini-2.0-flash-001")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="ai_credentials")

class AIUsageLog(Base):
    __tablename__ = "ai_usage_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider_used = Column(String(30), nullable=False) # Platform or Personal
    model = Column(String(100), nullable=False)
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    status = Column(String(30), default="Success") # Success, Fallback Triggered, Failed
    error_type = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(80), nullable=False) # Valuation, Mortgage, Document, Fraud, Risk, System
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    link = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False) # USER_LOGIN, VALUATION_CALCULATED, LOAN_DECISION_RECORDED, BYOK_KEY_UPDATED, etc.
    resource_type = Column(String(50), nullable=False)
    resource_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")

class ConsentRecord(Base):
    __tablename__ = "consent_records"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    consent_type = Column(String(100), nullable=False) # Credit Bureau Ingestion, AI Valuation Processing, Underwriting Assessment
    is_consented = Column(Boolean, default=True)
    consent_version = Column(String(30), default="v1.0")
    granted_at = Column(DateTime, default=datetime.datetime.utcnow)
    ip_address = Column(String(50), default="127.0.0.1")
