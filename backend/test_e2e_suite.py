import json
import urllib.request
import urllib.parse

BASE_URL = "http://127.0.0.1:8000/api"

def make_req(path, method="GET", data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def run_tests():
    print("--- 1. Testing Health Endpoint ---")
    status, res = make_req("/health")
    assert status == 200, f"Health check failed: {res}"
    print("Health Status:", res["status"], "| Service:", res["service"])

    print("\n--- 2. Testing Authentication (Login Officer) ---")
    status, login_res = make_req("/auth/login", method="POST", data={
        "email": "officer@propwise.ai",
        "password": "Officer@PropWise2026"
    })
    assert status == 200, f"Login failed: {login_res}"
    token = login_res["access_token"]
    user = login_res["user"]
    print("Logged in as:", user["full_name"], "| Role:", user["account_type"])

    print("\n--- 3. Testing Properties Endpoint ---")
    status, props = make_req("/properties", token=token)
    assert status == 200, f"Failed listing properties: {props}"
    print("Properties found:", len(props))

    print("\n--- 4. Testing Valuation Predict ---")
    status, val = make_req("/valuation/predict", method="POST", data={
        "locality": "worli",
        "city": "Mumbai",
        "property_type": "Penthouse",
        "built_up_area_sqft": 2400,
        "land_area_sqft": 2800,
        "bedrooms": 4,
        "bathrooms": 4,
        "property_age_years": 3,
        "construction_quality": "Premium",
        "property_condition": "Excellent"
    }, token=token)
    assert status == 200, f"Valuation prediction failed: {val}"
    print("Valuation Estimated:", val["estimated_value"], "INR | Price/sqft:", val["price_per_sqft"], "| Confidence:", val["confidence_score"])

    print("\n--- 5. Testing Mortgage Applications & Review ---")
    status, loans = make_req("/loans", token=token)
    assert status == 200
    print("Loans count:", len(loans))
    if len(loans) > 0:
        target_loan = loans[0]
        status, rev = make_req(f"/loans/{target_loan['id']}/review", method="PATCH", data={
            "status": "Approved",
            "reviewer_decision": "Approved by Senior Lending Officer Vikramaditya Sengupta",
            "officer_notes": "All title and DTI requirements fulfilled."
        }, token=token)
        assert status == 200
        print("Loan Adjudicated:", rev["application_number"], "Status:", rev["status"])

    print("\n--- 6. Testing Unified Risk Intelligence ---")
    status, risk = make_req("/risk/analyze", method="POST", data={
        "property_data": {"property_age_years": 4, "property_condition": "Good"},
        "borrower_data": {"debt_to_income_ratio": 42.0, "loan_to_value_ratio": 65.0, "credit_score": 780}
    }, token=token)
    assert status == 200
    print("Risk Category:", risk["risk_category"], "| Score:", risk["overall_risk_score"])

    print("\n--- 7. Testing Fraud Alert Listing & Status Update ---")
    status, alerts = make_req("/fraud/alerts", token=token)
    assert status == 200
    print("Fraud Alerts:", len(alerts))
    if len(alerts) > 0:
        status, updated_alert = make_req(f"/fraud/alerts/{alerts[0]['id']}", method="PATCH", data={
            "status": "Resolved",
            "investigation_notes": "Title conveyance verified against state registry."
        }, token=token)
        assert status == 200
        print("Alert updated to:", updated_alert["status"])

    print("\n--- 8. Testing Market Analytics ---")
    status, mkt = make_req("/market/analytics", token=token)
    assert status == 200
    print("Market Quarters:", len(mkt["historical_trends"]), "| Localities:", len(mkt["locality_comparisons"]))

    print("\n--- 9. Testing Report Generation & Download URL ---")
    status, rep = make_req("/reports", method="POST", data={
        "report_type": "Property Valuation Report",
        "title": "Valuation Dossier - Worli Cluster",
        "reference_id": "VAL-2026-TEST",
        "summary": "Automated institutional valuation dossier.",
        "details": {"locality": "Worli", "estimated_value": "INR 21.5 Cr"}
    }, token=token)
    assert status == 200
    print("Report Generated:", rep["report_number"], "PDF:", rep["pdf_filename"])

    print("\n--- 10. Testing PropWise Intelligence Assistant Chat ---")
    status, ai_res = make_req("/ai/chat", method="POST", data={
        "message": "Explain the debt-to-income and loan-to-value limits used by PropWise AI."
    }, token=token)
    assert status == 200
    print("AI Reply Provider:", ai_res["provider_used"], "| Model:", ai_res["model"])
    print("AI Snippet:", ai_res["message"][:120], "...")

    print("\n--- 11. Testing BYOK API Key Preferences ---")
    status, byok = make_req("/ai/keys/status", token=token)
    assert status == 200
    print("BYOK Status:", byok["platform_api_status"], "| Active Provider:", byok["active_provider"])

    status, pref = make_req("/ai/keys/preferences", method="PATCH", data={
        "is_automatic_fallback_enabled": True,
        "preferred_source": "Platform"
    }, token=token)
    assert status == 200
    print("BYOK Preferences Updated successfully!")

    print("\n--- 12. Testing Admin Overview & Audit Logs (Admin User) ---")
    # Login Admin
    status, admin_login = make_req("/auth/login", method="POST", data={
        "email": "admin@propwise.ai",
        "password": "Admin@PropWise2026"
    })
    assert status == 200
    admin_token = admin_login["access_token"]
    status, admin_ov = make_req("/admin/overview", token=admin_token)
    assert status == 200
    print("Admin Overview: Total Users:", admin_ov["total_users"], "| System:", admin_ov["system_status"])

    status, audit = make_req("/admin/audit-logs", token=admin_token)
    assert status == 200
    print("Audit Log Records Recorded:", len(audit))

    print("\n=============================================")
    print("ALL 12 END-TO-END SYSTEM SUITES PASSED CLEANLY!")
    print("=============================================")

if __name__ == "__main__":
    run_tests()
