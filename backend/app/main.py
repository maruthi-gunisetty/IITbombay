import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any

from backend.app.core.config import settings
from backend.app.database.db import init_db
from backend.app.database.repo import repo
from backend.app.security.crypto import hash_password
from backend.app.api import (
    auth, properties, valuation, loans, risk, documents,
    fraud, market, reports, ai, admin, notifications, compliance
)
from backend.app.api.deps import get_current_user

# Initialize Database Schema
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Smarter Property Valuation. Safer Lending Decisions.",
    version="3.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(properties.router, prefix=settings.API_V1_STR)
app.include_router(valuation.router, prefix=settings.API_V1_STR)
app.include_router(loans.router, prefix=settings.API_V1_STR)
app.include_router(risk.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(fraud.router, prefix=settings.API_V1_STR)
app.include_router(market.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(compliance.router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "version": "3.1.0",
        "database": "sqlite_operational"
    }

@app.get("/api/dashboard/overview")
def get_dashboard_overview(current_user: Dict[str, Any] = Depends(get_current_user)):
    is_cust = current_user.get("account_type") == "Customer"
    stats = repo.get_dashboard_overview(user_id=current_user["id"], is_customer=is_cust)
    
    # Trends for overview dashboard chart
    chart_data = [
        {"month": "Nov 2025", "valuations": 28, "applications": 14, "approved": 11},
        {"month": "Dec 2025", "valuations": 35, "applications": 19, "approved": 15},
        {"month": "Jan 2026", "valuations": 42, "applications": 26, "approved": 20},
        {"month": "Feb 2026", "valuations": 49, "applications": 31, "approved": 24},
        {"month": "Mar 2026", "valuations": 58, "applications": 38, "approved": 29},
        {"month": "Apr 2026", "valuations": 64, "applications": 44, "approved": 36},
    ]

    risk_distribution = [
        {"category": "Low Risk", "count": 68, "percentage": 52},
        {"category": "Moderate Risk", "count": 42, "percentage": 32},
        {"category": "High Risk", "count": 16, "percentage": 12},
        {"category": "Critical / Anomaly", "count": 5, "percentage": 4},
    ]

    return {
        "metrics": stats,
        "monthly_activity": chart_data,
        "risk_distribution": risk_distribution
    }

# Seed realistic initial institutional data
def seed_initial_data():
    users = repo.list_users()
    if len(users) == 0:
        admin_user = repo.create_user(
            full_name="Enterprise Admin",
            email="admin@propwise.ai",
            hashed_password=hash_password("Admin@PropWise2026"),
            account_type="Admin",
            phone_number="+91 98200 11000"
        )
        officer_user = repo.create_user(
            full_name="Vikramaditya Sengupta",
            email="officer@propwise.ai",
            hashed_password=hash_password("Officer@PropWise2026"),
            account_type="Bank Officer",
            phone_number="+91 98200 22000"
        )
        customer_user = repo.create_user(
            full_name="Rahul Sharma",
            email="customer@propwise.ai",
            hashed_password=hash_password("Customer@PropWise2026"),
            account_type="Customer",
            phone_number="+91 98200 33000"
        )
        analyst_user = repo.create_user(
            full_name="Ananya Deshmukh",
            email="analyst@propwise.ai",
            hashed_password=hash_password("Analyst@PropWise2026"),
            account_type="Property Analyst",
            phone_number="+91 98200 44000"
        )

        # Seed Properties
        p1 = repo.create_property({
            "name": "Highline Horizon Penthouse",
            "property_type": "Penthouse",
            "state": "Maharashtra",
            "district": "Mumbai Suburban",
            "city": "Mumbai",
            "locality": "Powai",
            "postal_code": "400076",
            "full_address": "Tower 3, Penthouse 2401, Highline Horizon, Hiranandani Gardens, Powai, Mumbai",
            "land_area_sqft": 3200,
            "built_up_area_sqft": 2850,
            "bedrooms": 4,
            "bathrooms": 4,
            "floors": 2,
            "property_age_years": 2,
            "construction_quality": "Premium",
            "property_condition": "Excellent",
            "parking_spaces": 3,
            "amenities": ["Private Terrace Pool", "Smart Home Automation", "Clubhouse", "24/7 Security", "Concierge"],
            "latitude": 19.1176,
            "longitude": 72.9060,
            "status": "Active",
            "estimated_value": 74500000.0,
            "image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
        }, owner_id=customer_user["id"])

        p2 = repo.create_property({
            "name": "Grandeur Waterfront Villa",
            "property_type": "Villa",
            "state": "Maharashtra",
            "district": "Mumbai City",
            "city": "Mumbai",
            "locality": "Worli",
            "postal_code": "400018",
            "full_address": "Plot 18B, Sea Face Enclave, Worli, Mumbai",
            "land_area_sqft": 4500,
            "built_up_area_sqft": 4100,
            "bedrooms": 5,
            "bathrooms": 6,
            "floors": 3,
            "property_age_years": 4,
            "construction_quality": "Premium",
            "property_condition": "Excellent",
            "parking_spaces": 4,
            "amenities": ["Private Lawn", "Sea View Deck", "High Security Gate", "Solar Array", "Power Backup"],
            "latitude": 19.0144,
            "longitude": 72.8155,
            "status": "Active",
            "estimated_value": 215000000.0,
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        }, owner_id=customer_user["id"])

        p3 = repo.create_property({
            "name": "Emerald Heights Residency",
            "property_type": "Apartment",
            "state": "Karnataka",
            "district": "Bengaluru Urban",
            "city": "Bengaluru",
            "locality": "Indiranagar",
            "postal_code": "560038",
            "full_address": "100 Feet Road, 4th Cross, Indiranagar, Bengaluru",
            "land_area_sqft": 1800,
            "built_up_area_sqft": 1650,
            "bedrooms": 3,
            "bathrooms": 3,
            "floors": 1,
            "property_age_years": 3,
            "construction_quality": "A Grade",
            "property_condition": "Excellent",
            "parking_spaces": 2,
            "amenities": ["Fitness Studio", "EV Charging Point", "Intercom", "Lush Landscaping"],
            "latitude": 12.9784,
            "longitude": 77.6408,
            "status": "Active",
            "estimated_value": 26400000.0,
            "image_url": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
        }, owner_id=customer_user["id"])

        p4 = repo.create_property({
            "name": "Cyber Gateway Commercial Suite",
            "property_type": "Commercial",
            "state": "Telangana",
            "district": "Hyderabad",
            "city": "Hyderabad",
            "locality": "Hitec City",
            "postal_code": "500081",
            "full_address": "Floor 11, Tech Boulevard, Madhapur, Hitec City, Hyderabad",
            "land_area_sqft": 3500,
            "built_up_area_sqft": 3500,
            "bedrooms": 0,
            "bathrooms": 4,
            "floors": 1,
            "property_age_years": 1,
            "construction_quality": "Premium",
            "property_condition": "Excellent",
            "parking_spaces": 6,
            "amenities": ["Central HVAC", "Fiber Redundancy", "Access Control Turnstiles", "Conference Center"],
            "latitude": 17.4474,
            "longitude": 78.3762,
            "status": "Active",
            "estimated_value": 32200000.0,
            "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
        }, owner_id=customer_user["id"])

        # Seed Loan Application
        loan1 = repo.create_loan({
            "application_number": "LN-2026-89410A",
            "property_id": p1["id"],
            "applicant_name": "Rahul Sharma",
            "email": "customer@propwise.ai",
            "phone": "+91 98200 33000",
            "employment_type": "Salaried",
            "employer": "Tech Innovations Global Pvt Ltd",
            "employment_duration_years": 4.5,
            "monthly_income": 280000.0,
            "other_income": 25000.0,
            "existing_monthly_emi": 32000.0,
            "existing_debt": 450000.0,
            "credit_score": 785,
            "requested_loan_amount": 48000000.0,
            "loan_tenure_years": 20,
            "interest_rate_percent": 8.4,
            "down_payment": 26500000.0,
            "property_market_value": 74500000.0,
            "estimated_monthly_emi": 413550.0,
            "debt_to_income_ratio": 44.1,
            "loan_to_value_ratio": 64.4,
            "total_interest_payable": 51252000.0,
            "total_repayment_amount": 99252000.0,
            "repayment_capacity_rating": "Strong Repayment Capacity",
            "status": "Under Review"
        }, applicant_id=customer_user["id"])

        # Seed Risk Assessment
        repo.create_risk_assessment({
            "loan_application_id": loan1["id"],
            "property_risk_score": 22.5,
            "borrower_risk_score": 24.0,
            "overall_risk_score": 23.3,
            "risk_category": "Low",
            "risk_contribution_breakdown": {
                "Collateral Age and Wear": 5.6,
                "Locality and Liquidity Risk": 4.5,
                "Debt Coverage Obligation (DTI)": 8.4,
                "Borrower Leverage (LTV)": 4.8
            },
            "key_risk_factors": [
                "Prime tier-1 locality exhibiting robust secondary market liquidity",
                "Conservative 64.4% Loan-to-Value provides substantial equity buffer",
                "Strong credit bureau score (785) with clean repayment track record"
            ],
            "missing_data_flags": [],
            "model_version": "PropWise-RiskPolicy-v3.1",
            "recommendation": "Decision Support: File exhibits prime credit profile and healthy collateral coverage. Recommended for bank officer endorsement."
        })

        # Seed Fraud Alert
        repo.create_fraud_flag({
            "alert_code": "FRD-782194",
            "property_id": p2["id"],
            "alert_type": "Valuation Inflation Anomaly",
            "severity": "Low",
            "detection_method": "Locality Price-per-Sqft Statistical Outlier",
            "reason": "Unit price in Worli waterfront cluster verified within authentic high-tier luxury bracket.",
            "status": "Resolved",
            "investigation_notes": "Officer verified registry conveyance and coastal regulation zone clearance.",
            "resolved_by": "Vikramaditya Sengupta"
        })

        # Seed Sample Document
        repo.create_document({
            "user_id": customer_user["id"],
            "loan_application_id": loan1["id"],
            "document_type": "Income Proof",
            "file_name": "Salary_Slip_Oct_2026.pdf",
            "file_path": "uploads/documents/sample_salary_slip.pdf",
            "file_size_kb": 245.5,
            "mime_type": "application/pdf",
            "ocr_status": "Processed",
            "verification_status": "Verified",
            "extracted_text": "Tech Innovations Global Pvt Ltd\nEmployee: Rahul Sharma\nGross: INR 2,25,000\nNet: INR 1,96,500",
            "extracted_fields": {
                "Employer": "Tech Innovations Global Pvt Ltd",
                "Employee Name": "Rahul Sharma",
                "Gross Income": "INR 2,25,000",
                "Net Pay": "INR 1,96,500"
            },
            "validation_flags": []
        })

        # Seed Initial Notification
        repo.create_notification(
            user_id=customer_user["id"],
            category="System",
            title="Welcome to PROPWISE AI",
            message="Your enterprise intelligence workspace is active. You can register assets, run ML valuations, and track mortgage applications.",
            link="/dashboard"
        )

seed_initial_data()
