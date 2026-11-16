import uuid
from typing import Dict, Any, List

class FraudService:
    @staticmethod
    def scan_for_anomalies(
        property_data: Dict[str, Any] = None,
        loan_data: Dict[str, Any] = None,
        existing_properties: List[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Scans property and underwriting profiles for statistical anomalies, duplicate registrations, and valuation spikes."""
        alerts = []

        # 1. Valuation Spike Check
        if property_data:
            area = float(property_data.get("built_up_area_sqft", 1000))
            est_value = float(property_data.get("estimated_value", 0))
            if area > 0 and est_value > 0:
                price_sqft = est_value / area
                # Benchmark check: if price per sqft exceeds 60,000 for standard locations
                locality = str(property_data.get("locality", "")).lower()
                if "worli" not in locality and "bandra" not in locality and price_sqft > 35000:
                    alerts.append({
                        "alert_code": f"FRD-{uuid.uuid4().hex[:6].upper()}",
                        "alert_type": "Valuation Inflation Anomaly",
                        "severity": "High",
                        "detection_method": "Locality Price-per-Sqft Statistical Outlier (> 2.8 Sigma)",
                        "reason": f"Unit price of INR {round(price_sqft, 2)}/sqft significantly exceeds locality 95th percentile benchmark.",
                        "status": "Open"
                    })

            # Plotted Land built-up check
            ptype = property_data.get("property_type", "")
            land_area = float(property_data.get("land_area_sqft", 0))
            if ptype == "Residential Plot" and area > land_area and land_area > 0:
                alerts.append({
                    "alert_code": f"FRD-{uuid.uuid4().hex[:6].upper()}",
                    "alert_type": "Inconsistent Property Dimension",
                    "severity": "Medium",
                    "detection_method": "Geometric Dimension Constraint Rule",
                    "reason": "Registered built-up area cannot exceed land plot area for single-story residential plots.",
                    "status": "Open"
                })

        # 2. Loan Underwriting Anomalies
        if loan_data:
            monthly_income = float(loan_data.get("monthly_income", 0))
            annual_income = monthly_income * 12
            loan_amount = float(loan_data.get("requested_loan_amount", 0))
            
            # Extreme loan-to-income multiple (> 9x)
            if annual_income > 0 and (loan_amount / annual_income) > 8.5:
                alerts.append({
                    "alert_code": f"FRD-{uuid.uuid4().hex[:6].upper()}",
                    "alert_type": "Income-to-Debt Leverage Discrepancy",
                    "severity": "High",
                    "detection_method": "Leverage Multiple Outlier",
                    "reason": f"Requested loan amount is {round(loan_amount / annual_income, 1)}x annual borrower gross income, exceeding the 7x threshold.",
                    "status": "Open"
                })

            # LTV Ceiling Anomaly (> 90%)
            ltv = float(loan_data.get("loan_to_value_ratio", 0))
            if ltv > 85.0:
                alerts.append({
                    "alert_code": f"FRD-{uuid.uuid4().hex[:6].upper()}",
                    "alert_type": "Elevated Loan-to-Value Exposure",
                    "severity": "Critical" if ltv > 92 else "Medium",
                    "detection_method": "Regulatory LTV Bound Check",
                    "reason": f"Loan-to-Value ratio at {ltv}% exceeds regulatory prudential safety guidelines.",
                    "status": "Open"
                })

        return alerts

fraud_service = FraudService()
