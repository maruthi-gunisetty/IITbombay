import sqlite3
import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "propwise.db")

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = dict_factory
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    conn = get_connection()
    c = conn.cursor()

    # Users table
    c.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone_number TEXT,
        hashed_password TEXT NOT NULL,
        account_type TEXT NOT NULL DEFAULT 'Customer',
        is_active INTEGER NOT NULL DEFAULT 1,
        is_verified INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
    """)

    # Properties table
    c.execute("""
    CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER,
        name TEXT NOT NULL,
        property_type TEXT NOT NULL,
        state TEXT NOT NULL,
        district TEXT,
        city TEXT NOT NULL,
        locality TEXT NOT NULL,
        postal_code TEXT,
        full_address TEXT NOT NULL,
        land_area_sqft REAL NOT NULL,
        built_up_area_sqft REAL NOT NULL,
        bedrooms INTEGER DEFAULT 2,
        bathrooms INTEGER DEFAULT 2,
        floors INTEGER DEFAULT 1,
        property_age_years INTEGER DEFAULT 2,
        construction_quality TEXT DEFAULT 'A Grade',
        property_condition TEXT DEFAULT 'Excellent',
        parking_spaces INTEGER DEFAULT 1,
        amenities TEXT DEFAULT '[]',
        latitude REAL,
        longitude REAL,
        status TEXT DEFAULT 'Active',
        estimated_value REAL,
        image_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
    )
    """)

    # Property Valuations table
    c.execute("""
    CREATE TABLE IF NOT EXISTS property_valuations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id INTEGER,
        user_id INTEGER,
        estimated_value REAL NOT NULL,
        price_per_sqft REAL NOT NULL,
        lower_bound REAL NOT NULL,
        upper_bound REAL NOT NULL,
        confidence_score REAL DEFAULT 0.93,
        model_version TEXT DEFAULT 'PropWise-ML-v2.4',
        model_mode TEXT DEFAULT 'Verified ML Engine',
        feature_contributions TEXT DEFAULT '{}',
        comparable_sales TEXT DEFAULT '[]',
        location_insights TEXT DEFAULT '{}',
        notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
    """)

    # Loan Applications table
    c.execute("""
    CREATE TABLE IF NOT EXISTS loan_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_number TEXT UNIQUE NOT NULL,
        applicant_id INTEGER NOT NULL,
        property_id INTEGER,
        applicant_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        employment_type TEXT DEFAULT 'Salaried',
        employer TEXT,
        employment_duration_years REAL DEFAULT 3.0,
        monthly_income REAL NOT NULL,
        other_income REAL DEFAULT 0.0,
        existing_monthly_emi REAL DEFAULT 0.0,
        existing_debt REAL DEFAULT 0.0,
        credit_score INTEGER,
        requested_loan_amount REAL NOT NULL,
        loan_tenure_years INTEGER DEFAULT 20,
        interest_rate_percent REAL DEFAULT 8.5,
        down_payment REAL DEFAULT 0.0,
        property_market_value REAL,
        estimated_monthly_emi REAL,
        debt_to_income_ratio REAL,
        loan_to_value_ratio REAL,
        total_interest_payable REAL,
        total_repayment_amount REAL,
        repayment_capacity_rating TEXT DEFAULT 'Strong Repayment Capacity',
        status TEXT DEFAULT 'Submitted',
        officer_notes TEXT,
        reviewer_decision TEXT,
        reviewed_by TEXT,
        reviewed_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
    )
    """)

    # Risk Assessments table
    c.execute("""
    CREATE TABLE IF NOT EXISTS risk_assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        loan_application_id INTEGER NOT NULL,
        property_risk_score REAL NOT NULL,
        borrower_risk_score REAL NOT NULL,
        overall_risk_score REAL NOT NULL,
        risk_category TEXT NOT NULL,
        risk_contribution_breakdown TEXT DEFAULT '{}',
        key_risk_factors TEXT DEFAULT '[]',
        missing_data_flags TEXT DEFAULT '[]',
        model_version TEXT DEFAULT 'PropWise-RiskPolicy-v3.1',
        recommendation TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE CASCADE
    )
    """)

    # Uploaded Documents table
    c.execute("""
    CREATE TABLE IF NOT EXISTS uploaded_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        loan_application_id INTEGER,
        document_type TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size_kb REAL DEFAULT 0.0,
        mime_type TEXT DEFAULT 'application/pdf',
        ocr_status TEXT DEFAULT 'Processed',
        verification_status TEXT DEFAULT 'Verified',
        extracted_text TEXT,
        extracted_fields TEXT DEFAULT '{}',
        validation_flags TEXT DEFAULT '[]',
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE SET NULL
    )
    """)

    # Fraud Flags table
    c.execute("""
    CREATE TABLE IF NOT EXISTS fraud_flags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        alert_code TEXT UNIQUE NOT NULL,
        property_id INTEGER,
        loan_application_id INTEGER,
        alert_type TEXT NOT NULL,
        severity TEXT DEFAULT 'Medium',
        detection_method TEXT NOT NULL,
        reason TEXT NOT NULL,
        status TEXT DEFAULT 'Open',
        investigation_notes TEXT,
        resolved_by TEXT,
        resolved_at TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
        FOREIGN KEY (loan_application_id) REFERENCES loan_applications(id) ON DELETE SET NULL
    )
    """)

    # Market Data Points table
    c.execute("""
    CREATE TABLE IF NOT EXISTS market_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city TEXT NOT NULL,
        locality TEXT NOT NULL,
        property_type TEXT NOT NULL,
        average_price_sqft REAL NOT NULL,
        median_price REAL NOT NULL,
        volume_units_sold INTEGER DEFAULT 50,
        price_change_yoy_percent REAL DEFAULT 6.5,
        quarter TEXT NOT NULL,
        recorded_date TEXT NOT NULL
    )
    """)

    # Reports table
    c.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        report_number TEXT UNIQUE NOT NULL,
        report_type TEXT NOT NULL,
        title TEXT NOT NULL,
        reference_id TEXT,
        generated_by TEXT NOT NULL,
        summary TEXT NOT NULL,
        details TEXT DEFAULT '{}',
        pdf_filename TEXT,
        created_at TEXT NOT NULL
    )
    """)

    # AI Conversations table
    c.execute("""
    CREATE TABLE IF NOT EXISTS ai_conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # AI Messages table
    c.execute("""
    CREATE TABLE IF NOT EXISTS ai_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        context_type TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
    )
    """)

    # User AI Credentials table (BYOK)
    c.execute("""
    CREATE TABLE IF NOT EXISTS user_ai_credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        encrypted_key TEXT,
        key_masked TEXT,
        is_personal_key_enabled INTEGER DEFAULT 0,
        is_automatic_fallback_enabled INTEGER DEFAULT 1,
        preferred_source TEXT DEFAULT 'Platform',
        last_validated_at TEXT,
        validation_status TEXT DEFAULT 'Not Configured',
        preferred_model TEXT DEFAULT 'google/gemini-2.0-flash-001',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # AI Usage Logs table
    c.execute("""
    CREATE TABLE IF NOT EXISTS ai_usage_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        provider_used TEXT NOT NULL,
        model TEXT NOT NULL,
        prompt_tokens INTEGER DEFAULT 0,
        completion_tokens INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Success',
        error_type TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # Notifications table
    c.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        link TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    # Audit Logs table
    c.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        user_email TEXT,
        action TEXT NOT NULL,
        resource_type TEXT NOT NULL,
        resource_id TEXT,
        details TEXT,
        ip_address TEXT DEFAULT '127.0.0.1',
        timestamp TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
    """)

    # Consent Records table
    c.execute("""
    CREATE TABLE IF NOT EXISTS consent_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        consent_type TEXT NOT NULL,
        is_consented INTEGER DEFAULT 1,
        consent_version TEXT DEFAULT 'v2026.1',
        granted_at TEXT NOT NULL,
        ip_address TEXT DEFAULT '127.0.0.1',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    conn.commit()
    conn.close()

init_db()
