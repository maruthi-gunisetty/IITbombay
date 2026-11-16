from typing import Dict, Any, List

class RiskService:
    @staticmethod
    def analyze_risk(property_data: Dict[str, Any], borrower_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates decoupled Property Risk vs Borrower Risk scores and combines them with explainable factor weights."""
        missing_data = []

        # 1. Property Risk Score Computation (0 = zero risk, 100 = critical risk)
        p_score = 20.0 # base score
        age = float(property_data.get("property_age_years", 3))
        if age > 20:
            p_score += 25.0
        elif age > 10:
            p_score += 12.0
            
        condition = property_data.get("property_condition", "Good")
        if condition == "Needs Renovation":
            p_score += 25.0
        elif condition == "Fair":
            p_score += 12.0
        elif condition == "Excellent":
            p_score -= 8.0

        quality = property_data.get("construction_quality", "Standard")
        if quality == "Economy":
            p_score += 15.0
        elif quality in ("A Grade", "Premium"):
            p_score -= 5.0

        property_risk = max(5.0, min(95.0, p_score))

        # 2. Borrower Risk Score Computation (0 = zero risk, 100 = critical risk)
        b_score = 15.0
        dti = float(borrower_data.get("debt_to_income_ratio", 40.0))
        if dti > 60:
            b_score += 45.0
        elif dti > 50:
            b_score += 30.0
        elif dti > 40:
            b_score += 15.0
        else:
            b_score -= 5.0

        ltv = float(borrower_data.get("loan_to_value_ratio", 75.0))
        if ltv > 85:
            b_score += 25.0
        elif ltv > 75:
            b_score += 12.0

        credit_score = borrower_data.get("credit_score")
        if credit_score:
            if credit_score < 650:
                b_score += 35.0
            elif credit_score < 720:
                b_score += 15.0
            elif credit_score >= 780:
                b_score -= 15.0
        else:
            missing_data.append("Credit score absent; provisional risk weighting applied")
            b_score += 20.0

        borrower_risk = max(5.0, min(95.0, b_score))

        # 3. Overall Combined Risk Weighting: 45% Collateral + 55% Capacity
        overall_score = round((0.45 * property_risk) + (0.55 * borrower_risk), 2)

        # Risk Category classification
        if missing_data and (not credit_score):
            category = "Insufficient Data"
        elif overall_score <= 30.0:
            category = "Low"
        elif overall_score <= 60.0:
            category = "Moderate"
        elif overall_score <= 80.0:
            category = "High"
        else:
            category = "Critical"

        # Explainable breakdown
        breakdown = {
            "Collateral Age and Wear": round(property_risk * 0.25, 2),
            "Locality and Liquidity Risk": round(property_risk * 0.20, 2),
            "Debt Coverage Obligation (DTI)": round(borrower_risk * 0.35, 2),
            "Borrower Leverage (LTV)": round(borrower_risk * 0.20, 2),
        }

        key_factors = []
        if dti > 45:
            key_factors.append(f"DTI at {dti}% imposes elevated monthly liquidity pressure")
        if ltv > 80:
            key_factors.append(f"LTV at {ltv}% requires enhanced collateral insurance")
        if age > 15:
            key_factors.append(f"Property age ({age} yrs) requires structural engineering audit")
        if not key_factors:
            key_factors.append("Balanced collateral valuation with sustainable debt-service capacity")

        recommendation = (
            "Decision Support Recommendation: Lending file presents acceptable risk parameters subject to standard KYC and title verification."
            if category in ("Low", "Moderate") else
            "Decision Support Recommendation: Enhanced underwriting due diligence and senior bank officer review required before loan sanction."
        )

        return {
            "property_risk_score": round(property_risk, 2),
            "borrower_risk_score": round(borrower_risk, 2),
            "overall_risk_score": overall_score,
            "risk_category": category,
            "risk_contribution_breakdown": breakdown,
            "key_risk_factors": key_factors,
            "missing_data_flags": missing_data,
            "model_version": "PropWise-RiskPolicy-v3.1",
            "recommendation": recommendation
        }

risk_service = RiskService()
