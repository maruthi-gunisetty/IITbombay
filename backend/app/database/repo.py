import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.app.database.db import get_connection

class Repository:
    # Users
    @staticmethod
    def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE email = ?", (email,))
        row = c.fetchone()
        conn.close()
        return row

    @staticmethod
    def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        row = c.fetchone()
        conn.close()
        return row

    @staticmethod
    def create_user(full_name: str, email: str, hashed_password: str, account_type: str = "Customer", phone_number: str = None) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO users (full_name, email, phone_number, hashed_password, account_type, is_active, is_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, 1, ?, ?)
        """, (full_name, email, phone_number, hashed_password, account_type, now, now))
        user_id = c.lastrowid
        conn.commit()
        conn.close()
        return Repository.get_user_by_id(user_id)

    @staticmethod
    def list_users(role: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        if role:
            c.execute("SELECT id, full_name, email, phone_number, account_type, is_active, is_verified, created_at FROM users WHERE account_type = ? ORDER BY id ASC", (role,))
        else:
            c.execute("SELECT id, full_name, email, phone_number, account_type, is_active, is_verified, created_at FROM users ORDER BY id ASC")
        rows = c.fetchall()
        conn.close()
        return rows

    @staticmethod
    def update_user_role(user_id: int, account_type: str) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("UPDATE users SET account_type = ?, updated_at = ? WHERE id = ?", (account_type, now, user_id))
        conn.commit()
        conn.close()
        return Repository.get_user_by_id(user_id)

    @staticmethod
    def update_user_status(user_id: int, is_active: bool) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("UPDATE users SET is_active = ?, updated_at = ? WHERE id = ?", (1 if is_active else 0, now, user_id))
        conn.commit()
        conn.close()
        return Repository.get_user_by_id(user_id)

    # Properties
    @staticmethod
    def list_properties(owner_id: Optional[int] = None, city: Optional[str] = None, state: Optional[str] = None,
                        property_type: Optional[str] = None, status: Optional[str] = None,
                        search: Optional[str] = None, min_price: Optional[float] = None,
                        max_price: Optional[float] = None) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        query = "SELECT * FROM properties WHERE 1=1"
        params = []
        if owner_id is not None:
            query += " AND owner_id = ?"
            params.append(owner_id)
        if city:
            query += " AND city LIKE ?"
            params.append(f"%{city}%")
        if state:
            query += " AND state LIKE ?"
            params.append(f"%{state}%")
        if property_type:
            query += " AND property_type = ?"
            params.append(property_type)
        if status:
            query += " AND status = ?"
            params.append(status)
        if search:
            query += " AND (name LIKE ? OR locality LIKE ? OR full_address LIKE ?)"
            params.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
        if min_price is not None:
            query += " AND estimated_value >= ?"
            params.append(min_price)
        if max_price is not None:
            query += " AND estimated_value <= ?"
            params.append(max_price)

        query += " ORDER BY id DESC"
        c.execute(query, tuple(params))
        rows = c.fetchall()
        conn.close()
        for r in rows:
            if isinstance(r.get("amenities"), str):
                try:
                    r["amenities"] = json.loads(r["amenities"])
                except Exception:
                    r["amenities"] = []
        return rows

    @staticmethod
    def get_property(prop_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM properties WHERE id = ?", (prop_id,))
        row = c.fetchone()
        conn.close()
        if row and isinstance(row.get("amenities"), str):
            try:
                row["amenities"] = json.loads(row["amenities"])
            except Exception:
                row["amenities"] = []
        return row

    @staticmethod
    def create_property(data: Dict[str, Any], owner_id: int) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        amenities_str = json.dumps(data.get("amenities", []))
        c.execute("""
            INSERT INTO properties (
                owner_id, name, property_type, state, district, city, locality, postal_code,
                full_address, land_area_sqft, built_up_area_sqft, bedrooms, bathrooms, floors,
                property_age_years, construction_quality, property_condition, parking_spaces,
                amenities, latitude, longitude, status, estimated_value, image_url, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            owner_id, data["name"], data["property_type"], data["state"], data.get("district"),
            data["city"], data["locality"], data.get("postal_code"), data["full_address"],
            float(data["land_area_sqft"]), float(data["built_up_area_sqft"]), int(data.get("bedrooms", 2)),
            int(data.get("bathrooms", 2)), int(data.get("floors", 1)), int(data.get("property_age_years", 2)),
            data.get("construction_quality", "A Grade"), data.get("property_condition", "Excellent"),
            int(data.get("parking_spaces", 1)), amenities_str, data.get("latitude") or 19.0760,
            data.get("longitude") or 72.8777, data.get("status", "Active"), data.get("estimated_value"),
            data.get("image_url") or "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
            now, now
        ))
        prop_id = c.lastrowid
        conn.commit()
        conn.close()
        return Repository.get_property(prop_id)

    @staticmethod
    def update_property_valuation(prop_id: int, estimated_value: float):
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("UPDATE properties SET estimated_value = ?, updated_at = ? WHERE id = ?", (estimated_value, now, prop_id))
        conn.commit()
        conn.close()

    @staticmethod
    def delete_property(prop_id: int):
        conn = get_connection()
        c = conn.cursor()
        c.execute("DELETE FROM properties WHERE id = ?", (prop_id,))
        conn.commit()
        conn.close()

    # Valuations
    @staticmethod
    def create_valuation(data: Dict[str, Any], user_id: int) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO property_valuations (
                property_id, user_id, estimated_value, price_per_sqft, lower_bound, upper_bound,
                confidence_score, model_version, model_mode, feature_contributions, comparable_sales,
                location_insights, notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("property_id"), user_id, data["estimated_value"], data["price_per_sqft"],
            data["lower_bound"], data["upper_bound"], data.get("confidence_score", 0.94),
            data.get("model_version", "PropWise-ML-v2.4"), data.get("model_mode", "Verified ML Engine"),
            json.dumps(data.get("feature_contributions", {})), json.dumps(data.get("comparable_sales", [])),
            json.dumps(data.get("location_insights", {})), data.get("notes"), now
        ))
        val_id = c.lastrowid
        conn.commit()
        conn.close()
        return Repository.get_valuation(val_id)

    @staticmethod
    def get_valuation(val_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM property_valuations WHERE id = ?", (val_id,))
        row = c.fetchone()
        conn.close()
        if row:
            for k in ["feature_contributions", "comparable_sales", "location_insights"]:
                if isinstance(row.get(k), str):
                    try:
                        row[k] = json.loads(row[k])
                    except Exception:
                        row[k] = {} if "sales" not in k else []
        return row

    @staticmethod
    def list_valuations(user_id: Optional[int] = None, property_id: Optional[int] = None) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        query = "SELECT * FROM property_valuations WHERE 1=1"
        params = []
        if user_id is not None:
            query += " AND user_id = ?"
            params.append(user_id)
        if property_id is not None:
            query += " AND property_id = ?"
            params.append(property_id)
        query += " ORDER BY id DESC LIMIT 50"
        c.execute(query, tuple(params))
        rows = c.fetchall()
        conn.close()
        for r in rows:
            for k in ["feature_contributions", "comparable_sales", "location_insights"]:
                if isinstance(r.get(k), str):
                    try:
                        r[k] = json.loads(r[k])
                    except Exception:
                        r[k] = {} if "sales" not in k else []
        return rows

    # Loans & Underwriting
    @staticmethod
    def create_loan(data: Dict[str, Any], applicant_id: int) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO loan_applications (
                application_number, applicant_id, property_id, applicant_name, email, phone,
                employment_type, employer, employment_duration_years, monthly_income, other_income,
                existing_monthly_emi, existing_debt, credit_score, requested_loan_amount,
                loan_tenure_years, interest_rate_percent, down_payment, property_market_value,
                estimated_monthly_emi, debt_to_income_ratio, loan_to_value_ratio, total_interest_payable,
                total_repayment_amount, repayment_capacity_rating, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["application_number"], applicant_id, data.get("property_id"), data["applicant_name"],
            data["email"], data["phone"], data.get("employment_type", "Salaried"), data.get("employer"),
            data.get("employment_duration_years", 3.0), data["monthly_income"], data.get("other_income", 0.0),
            data.get("existing_monthly_emi", 0.0), data.get("existing_debt", 0.0), data.get("credit_score"),
            data["requested_loan_amount"], data.get("loan_tenure_years", 20), data.get("interest_rate_percent", 8.5),
            data.get("down_payment", 0.0), data.get("property_market_value"), data.get("estimated_monthly_emi"),
            data.get("debt_to_income_ratio"), data.get("loan_to_value_ratio"), data.get("total_interest_payable"),
            data.get("total_repayment_amount"), data.get("repayment_capacity_rating"), data.get("status", "Under Review"),
            now, now
        ))
        loan_id = c.lastrowid
        conn.commit()
        conn.close()
        return Repository.get_loan(loan_id)

    @staticmethod
    def get_loan(loan_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM loan_applications WHERE id = ?", (loan_id,))
        row = c.fetchone()
        conn.close()
        return row

    @staticmethod
    def list_loans(applicant_id: Optional[int] = None, status: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        query = "SELECT * FROM loan_applications WHERE 1=1"
        params = []
        if applicant_id is not None:
            query += " AND applicant_id = ?"
            params.append(applicant_id)
        if status:
            query += " AND status = ?"
            params.append(status)
        query += " ORDER BY id DESC"
        c.execute(query, tuple(params))
        rows = c.fetchall()
        conn.close()
        return rows

    @staticmethod
    def update_loan_review(loan_id: int, status: str, decision: str, notes: str, reviewer: str) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            UPDATE loan_applications
            SET status = ?, reviewer_decision = ?, officer_notes = ?, reviewed_by = ?, reviewed_at = ?, updated_at = ?
            WHERE id = ?
        """, (status, decision, notes, reviewer, now, now, loan_id))
        conn.commit()
        conn.close()
        return Repository.get_loan(loan_id)

    # Risk Assessments
    @staticmethod
    def create_risk_assessment(data: Dict[str, Any]) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO risk_assessments (
                loan_application_id, property_risk_score, borrower_risk_score, overall_risk_score,
                risk_category, risk_contribution_breakdown, key_risk_factors, missing_data_flags,
                model_version, recommendation, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["loan_application_id"], data["property_risk_score"], data["borrower_risk_score"],
            data["overall_risk_score"], data["risk_category"], json.dumps(data.get("risk_contribution_breakdown", {})),
            json.dumps(data.get("key_risk_factors", [])), json.dumps(data.get("missing_data_flags", [])),
            data.get("model_version", "PropWise-RiskPolicy-v3.1"), data["recommendation"], now
        ))
        risk_id = c.lastrowid
        conn.commit()
        conn.close()
        return Repository.get_risk_assessment(risk_id)

    @staticmethod
    def get_risk_assessment(risk_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM risk_assessments WHERE id = ?", (risk_id,))
        row = c.fetchone()
        conn.close()
        if row:
            for k in ["risk_contribution_breakdown", "key_risk_factors", "missing_data_flags"]:
                if isinstance(row.get(k), str):
                    try:
                        row[k] = json.loads(row[k])
                    except Exception:
                        row[k] = {} if "breakdown" in k else []
        return row

    @staticmethod
    def list_risk_assessments(applicant_id: Optional[int] = None) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        if applicant_id is not None:
            c.execute("""
                SELECT r.* FROM risk_assessments r
                JOIN loan_applications l ON r.loan_application_id = l.id
                WHERE l.applicant_id = ?
                ORDER BY r.id DESC
            """, (applicant_id,))
        else:
            c.execute("SELECT * FROM risk_assessments ORDER BY id DESC")
        rows = c.fetchall()
        conn.close()
        for r in rows:
            for k in ["risk_contribution_breakdown", "key_risk_factors", "missing_data_flags"]:
                if isinstance(r.get(k), str):
                    try:
                        r[k] = json.loads(r[k])
                    except Exception:
                        r[k] = {} if "breakdown" in k else []
        return rows

    # Documents
    @staticmethod
    def create_document(data: Dict[str, Any]) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO uploaded_documents (
                user_id, loan_application_id, document_type, file_name, file_path, file_size_kb,
                mime_type, ocr_status, verification_status, extracted_text, extracted_fields,
                validation_flags, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["user_id"], data.get("loan_application_id"), data["document_type"], data["file_name"],
            data["file_path"], data.get("file_size_kb", 0.0), data.get("mime_type", "application/pdf"),
            data.get("ocr_status", "Processed"), data.get("verification_status", "Verified"),
            data.get("extracted_text"), json.dumps(data.get("extracted_fields", {})),
            json.dumps(data.get("validation_flags", [])), now
        ))
        doc_id = c.lastrowid
        conn.commit()
        conn.close()
        return Repository.get_document(doc_id)

    @staticmethod
    def get_document(doc_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM uploaded_documents WHERE id = ?", (doc_id,))
        row = c.fetchone()
        conn.close()
        if row:
            for k in ["extracted_fields", "validation_flags"]:
                if isinstance(row.get(k), str):
                    try:
                        row[k] = json.loads(row[k])
                    except Exception:
                        row[k] = {} if "fields" in k else []
        return row

    @staticmethod
    def list_documents(user_id: Optional[int] = None, loan_id: Optional[int] = None) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        query = "SELECT * FROM uploaded_documents WHERE 1=1"
        params = []
        if user_id is not None:
            query += " AND user_id = ?"
            params.append(user_id)
        if loan_id is not None:
            query += " AND loan_application_id = ?"
            params.append(loan_id)
        query += " ORDER BY id DESC"
        c.execute(query, tuple(params))
        rows = c.fetchall()
        conn.close()
        for r in rows:
            for k in ["extracted_fields", "validation_flags"]:
                if isinstance(r.get(k), str):
                    try:
                        r[k] = json.loads(r[k])
                    except Exception:
                        r[k] = {} if "fields" in k else []
        return rows

    @staticmethod
    def delete_document(doc_id: int):
        conn = get_connection()
        c = conn.cursor()
        c.execute("DELETE FROM uploaded_documents WHERE id = ?", (doc_id,))
        conn.commit()
        conn.close()

    # Fraud Alerts
    @staticmethod
    def create_fraud_flag(data: Dict[str, Any]) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO fraud_flags (
                alert_code, property_id, loan_application_id, alert_type, severity,
                detection_method, reason, status, investigation_notes, resolved_by, resolved_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["alert_code"], data.get("property_id"), data.get("loan_application_id"),
            data["alert_type"], data.get("severity", "Medium"), data["detection_method"],
            data["reason"], data.get("status", "Open"), data.get("investigation_notes"),
            data.get("resolved_by"), data.get("resolved_at"), now
        ))
        flag_id = c.lastrowid
        conn.commit()
        conn.close()
        return Repository.get_fraud_flag(flag_id)

    @staticmethod
    def get_fraud_flag(flag_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM fraud_flags WHERE id = ?", (flag_id,))
        row = c.fetchone()
        conn.close()
        return row

    @staticmethod
    def list_fraud_flags(status: Optional[str] = None, severity: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        query = "SELECT * FROM fraud_flags WHERE 1=1"
        params = []
        if status:
            query += " AND status = ?"
            params.append(status)
        if severity:
            query += " AND severity = ?"
            params.append(severity)
        query += " ORDER BY id DESC"
        c.execute(query, tuple(params))
        rows = c.fetchall()
        conn.close()
        return rows

    @staticmethod
    def update_fraud_flag(flag_id: int, status: str, notes: str, resolved_by: Optional[str] = None) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        resolved_at = datetime.utcnow().isoformat() if status == "Resolved" else None
        c.execute("""
            UPDATE fraud_flags
            SET status = ?, investigation_notes = ?, resolved_by = ?, resolved_at = ?
            WHERE id = ?
        """, (status, notes, resolved_by, resolved_at, flag_id))
        conn.commit()
        conn.close()
        return Repository.get_fraud_flag(flag_id)

    # Reports
    @staticmethod
    def create_report(data: Dict[str, Any]) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO reports (
                report_number, report_type, title, reference_id, generated_by,
                summary, details, pdf_filename, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["report_number"], data["report_type"], data["title"], data.get("reference_id"),
            data["generated_by"], data["summary"], json.dumps(data.get("details", {})),
            data.get("pdf_filename"), now
        ))
        rep_id = c.lastrowid
        conn.commit()
        conn.close()
        return Repository.get_report(rep_id)

    @staticmethod
    def get_report(rep_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM reports WHERE id = ?", (rep_id,))
        row = c.fetchone()
        conn.close()
        if row and isinstance(row.get("details"), str):
            try:
                row["details"] = json.loads(row["details"])
            except Exception:
                row["details"] = {}
        return row

    @staticmethod
    def list_reports(report_type: Optional[str] = None) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        if report_type:
            c.execute("SELECT * FROM reports WHERE report_type = ? ORDER BY id DESC", (report_type,))
        else:
            c.execute("SELECT * FROM reports ORDER BY id DESC")
        rows = c.fetchall()
        conn.close()
        for r in rows:
            if isinstance(r.get("details"), str):
                try:
                    r["details"] = json.loads(r["details"])
                except Exception:
                    r["details"] = {}
        return rows

    # AI & BYOK
    @staticmethod
    def get_user_ai_credentials(user_id: int) -> Optional[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM user_ai_credentials WHERE user_id = ?", (user_id,))
        row = c.fetchone()
        conn.close()
        return row

    @staticmethod
    def upsert_user_ai_credentials(user_id: int, encrypted_key: str, key_masked: str) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("SELECT id FROM user_ai_credentials WHERE user_id = ?", (user_id,))
        existing = c.fetchone()
        if existing:
            c.execute("""
                UPDATE user_ai_credentials
                SET encrypted_key = ?, key_masked = ?, is_personal_key_enabled = 1,
                    validation_status = 'Valid', last_validated_at = ?, updated_at = ?
                WHERE user_id = ?
            """, (encrypted_key, key_masked, now, now, user_id))
        else:
            c.execute("""
                INSERT INTO user_ai_credentials (
                    user_id, encrypted_key, key_masked, is_personal_key_enabled,
                    is_automatic_fallback_enabled, preferred_source, last_validated_at,
                    validation_status, preferred_model, created_at, updated_at
                ) VALUES (?, ?, ?, 1, 1, 'Platform', ?, 'Valid', 'google/gemini-2.0-flash-001', ?, ?)
            """, (user_id, encrypted_key, key_masked, now, now, now))
        conn.commit()
        conn.close()
        return Repository.get_user_ai_credentials(user_id)

    @staticmethod
    def delete_user_ai_credentials(user_id: int):
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            UPDATE user_ai_credentials
            SET encrypted_key = NULL, key_masked = NULL, is_personal_key_enabled = 0,
                validation_status = 'Not Configured', preferred_source = 'Platform', updated_at = ?
            WHERE user_id = ?
        """, (now, user_id))
        conn.commit()
        conn.close()

    @staticmethod
    def update_user_ai_preferences(user_id: int, is_personal_enabled: Optional[bool] = None,
                                  is_fallback_enabled: Optional[bool] = None,
                                  preferred_source: Optional[str] = None,
                                  preferred_model: Optional[str] = None) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("SELECT id FROM user_ai_credentials WHERE user_id = ?", (user_id,))
        if not c.fetchone():
            c.execute("""
                INSERT INTO user_ai_credentials (user_id, is_personal_key_enabled, is_automatic_fallback_enabled,
                                                preferred_source, preferred_model, created_at, updated_at)
                VALUES (?, 0, 1, 'Platform', 'google/gemini-2.0-flash-001', ?, ?)
            """, (user_id, now, now))
            conn.commit()

        if is_personal_enabled is not None:
            c.execute("UPDATE user_ai_credentials SET is_personal_key_enabled = ?, updated_at = ? WHERE user_id = ?", (1 if is_personal_enabled else 0, now, user_id))
        if is_fallback_enabled is not None:
            c.execute("UPDATE user_ai_credentials SET is_automatic_fallback_enabled = ?, updated_at = ? WHERE user_id = ?", (1 if is_fallback_enabled else 0, now, user_id))
        if preferred_source is not None:
            c.execute("UPDATE user_ai_credentials SET preferred_source = ?, updated_at = ? WHERE user_id = ?", (preferred_source, now, user_id))
        if preferred_model is not None:
            c.execute("UPDATE user_ai_credentials SET preferred_model = ?, updated_at = ? WHERE user_id = ?", (preferred_model, now, user_id))

        conn.commit()
        conn.close()
        return Repository.get_user_ai_credentials(user_id)

    @staticmethod
    def log_ai_usage(user_id: int, provider: str, model: str, status: str, error_type: Optional[str] = None):
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO ai_usage_logs (user_id, provider_used, model, prompt_tokens, completion_tokens, status, error_type, created_at)
            VALUES (?, ?, ?, 120, 180, ?, ?, ?)
        """, (user_id, provider, model, status, error_type, now))
        conn.commit()
        conn.close()

    @staticmethod
    def get_ai_usage_stats(user_id: int) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM ai_usage_logs WHERE user_id = ? ORDER BY id DESC LIMIT 50", (user_id,))
        rows = c.fetchall()
        conn.close()

        total = len(rows)
        success = sum(1 for r in rows if r["status"] == "Success")
        failed = sum(1 for r in rows if r["status"] == "Failed")
        platform = sum(1 for r in rows if "Platform" in r["provider_used"])
        personal = sum(1 for r in rows if "Personal" in r["provider_used"])
        last_req = rows[0]["created_at"] if rows else None
        switches = [
            {"timestamp": r["created_at"], "from": "Platform", "to": "Personal", "trigger": r["status"]}
            for r in rows if "Fallback" in r["provider_used"]
        ][:5]

        return {
            "total_requests": total,
            "successful_requests": success,
            "failed_requests": failed,
            "platform_requests": platform,
            "personal_requests": personal,
            "recent_switches": switches,
            "last_request_time": last_req
        }

    # Conversations & Messages
    @staticmethod
    def create_ai_conversation(user_id: int, title: str) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("INSERT INTO ai_conversations (user_id, title, created_at) VALUES (?, ?, ?)", (user_id, title, now))
        conv_id = c.lastrowid
        conn.commit()
        conn.close()
        return {"id": conv_id, "user_id": user_id, "title": title, "created_at": now}

    @staticmethod
    def list_ai_conversations(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY id DESC", (user_id,))
        rows = c.fetchall()
        conn.close()
        return rows

    @staticmethod
    def add_ai_message(conversation_id: int, sender: str, content: str, context_type: Optional[str] = None):
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO ai_messages (conversation_id, sender, content, context_type, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (conversation_id, sender, content, context_type, now))
        conn.commit()
        conn.close()

    @staticmethod
    def get_conversation_messages(conversation_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY id ASC", (conversation_id,))
        rows = c.fetchall()
        conn.close()
        return rows

    # Notifications
    @staticmethod
    def create_notification(user_id: int, category: str, title: str, message: str, link: Optional[str] = None):
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO notifications (user_id, category, title, message, link, is_read, created_at)
            VALUES (?, ?, ?, ?, ?, 0, ?)
        """, (user_id, category, title, message, link, now))
        conn.commit()
        conn.close()

    @staticmethod
    def list_notifications(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 50", (user_id,))
        rows = c.fetchall()
        conn.close()
        return rows

    @staticmethod
    def mark_notification_read(notif_id: int, user_id: int):
        conn = get_connection()
        c = conn.cursor()
        c.execute("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?", (notif_id, user_id))
        conn.commit()
        conn.close()

    @staticmethod
    def mark_all_notifications_read(user_id: int):
        conn = get_connection()
        c = conn.cursor()
        c.execute("UPDATE notifications SET is_read = 1 WHERE user_id = ?", (user_id,))
        conn.commit()
        conn.close()

    # Audit Logs
    @staticmethod
    def log_audit(user_id: Optional[int], user_email: Optional[str], action: str,
                  resource_type: str, resource_id: Optional[str] = None, details: Optional[str] = None):
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO audit_logs (user_id, user_email, action, resource_type, resource_id, details, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, user_email or "anonymous", action, resource_type, resource_id, details, now))
        conn.commit()
        conn.close()

    @staticmethod
    def list_audit_logs(limit: int = 100) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?", (limit,))
        rows = c.fetchall()
        conn.close()
        return rows

    # Consents
    @staticmethod
    def record_consent(user_id: int, consent_type: str):
        conn = get_connection()
        c = conn.cursor()
        now = datetime.utcnow().isoformat()
        c.execute("""
            INSERT INTO consent_records (user_id, consent_type, is_consented, consent_version, granted_at)
            VALUES (?, ?, 1, 'v2026.1', ?)
        """, (user_id, consent_type, now))
        conn.commit()
        conn.close()

    @staticmethod
    def list_consents(user_id: int) -> List[Dict[str, Any]]:
        conn = get_connection()
        c = conn.cursor()
        c.execute("SELECT * FROM consent_records WHERE user_id = ? ORDER BY id DESC", (user_id,))
        rows = c.fetchall()
        conn.close()
        return rows

    # Overview Stats
    @staticmethod
    def get_dashboard_overview(user_id: Optional[int] = None, is_customer: bool = False) -> Dict[str, Any]:
        conn = get_connection()
        c = conn.cursor()
        
        if is_customer and user_id is not None:
            c.execute("SELECT COUNT(*) as cnt FROM properties WHERE owner_id = ?", (user_id,))
            props = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM property_valuations WHERE user_id = ?", (user_id,))
            vals = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM loan_applications WHERE applicant_id = ?", (user_id,))
            loans = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM loan_applications WHERE applicant_id = ? AND status = 'Under Review'", (user_id,))
            under_review = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM uploaded_documents WHERE user_id = ?", (user_id,))
            docs = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM fraud_flags")
            fraud = 0
            c.execute("SELECT COUNT(*) as cnt FROM reports")
            reports = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM risk_assessments r JOIN loan_applications l ON r.loan_application_id = l.id WHERE l.applicant_id = ?", (user_id,))
            risk = c.fetchone()["cnt"]
        else:
            c.execute("SELECT COUNT(*) as cnt FROM properties")
            props = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM property_valuations")
            vals = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM loan_applications")
            loans = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM loan_applications WHERE status = 'Under Review'")
            under_review = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM uploaded_documents")
            docs = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM fraud_flags WHERE status = 'Open' OR status = 'Under Investigation'")
            fraud = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM reports")
            reports = c.fetchone()["cnt"]
            c.execute("SELECT COUNT(*) as cnt FROM risk_assessments")
            risk = c.fetchone()["cnt"]

        conn.close()
        return {
            "total_properties": props,
            "valuations_completed": vals,
            "active_loan_applications": loans,
            "applications_under_review": under_review,
            "risk_assessments": risk,
            "documents_processed": docs,
            "fraud_alerts": fraud,
            "reports_generated": reports
        }

repo = Repository()
