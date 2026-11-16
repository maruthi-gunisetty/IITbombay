from typing import Dict, Any, List

class UnderwritingService:
    @staticmethod
    def calculate_emi(principal: float, annual_rate_pct: float, tenure_years: int) -> float:
        """Calculates standard reducing balance monthly EMI using verified financial formula."""
        if principal <= 0 or annual_rate_pct <= 0 or tenure_years <= 0:
            return 0.0
        monthly_rate = (annual_rate_pct / 100.0) / 12.0
        n_months = tenure_years * 12
        emi = principal * monthly_rate * ((1.0 + monthly_rate) ** n_months) / (((1.0 + monthly_rate) ** n_months) - 1.0)
        return round(emi, 2)

    @classmethod
    def assess_application(cls, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates comprehensive underwriting metrics, risk factors, and financial affordability."""
        loan_amount = float(data.get("requested_loan_amount", 0.0))
        tenure_years = int(data.get("loan_tenure_years", 20))
        annual_rate = float(data.get("interest_rate_percent", 8.5))
        monthly_income = float(data.get("monthly_income", 0.0))
        other_income = float(data.get("other_income", 0.0))
        total_monthly_income = max(1.0, monthly_income + other_income)
        existing_emi = float(data.get("existing_monthly_emi", 0.0))
        credit_score = data.get("credit_score")
        property_value = float(data.get("property_market_value") or (loan_amount * 1.25))

        monthly_emi = cls.calculate_emi(loan_amount, annual_rate, tenure_years)
        total_repayment = round(monthly_emi * (tenure_years * 12), 2)
        total_interest = round(total_repayment - loan_amount, 2)

        # Debt to Income Ratio (DTI)
        total_monthly_obligations = monthly_emi + existing_emi
        dti_ratio = round((total_monthly_obligations / total_monthly_income) * 100.0, 2)

        # Loan to Value Ratio (LTV)
        ltv_ratio = round((loan_amount / property_value) * 100.0, 2) if property_value > 0 else 0.0

        # Capacity rating
        if dti_ratio <= 35.0:
            capacity_rating = "Exceptional Repayment Capacity"
        elif dti_ratio <= 45.0:
            capacity_rating = "Strong Repayment Capacity"
        elif dti_ratio <= 55.0:
            capacity_rating = "Moderate / Threshold Repayment Capacity"
        else:
            capacity_rating = "Strained Debt Capacity"

        # Risk Factors Detection
        risk_factors: List[str] = []
        if dti_ratio > 50.0:
            risk_factors.append(f"High Debt-to-Income ratio ({dti_ratio}% exceeds prudent 50% limit)")
        if ltv_ratio > 80.0:
            risk_factors.append(f"High Loan-to-Value exposure ({ltv_ratio}% exceeds regulatory 80% ceiling)")
        if credit_score and credit_score < 680:
            risk_factors.append(f"Advisory credit score ({credit_score}) below benchmark 700 threshold")
        if data.get("employment_duration_years", 3.0) < 1.0:
            risk_factors.append("Employment tenure under 12 months indicates job stability risk")
        if not risk_factors:
            risk_factors.append("Borrower exhibits sound debt coverage and robust equity buffer")

        # Missing data checks
        missing_data: List[str] = []
        if not credit_score:
            missing_data.append("Credit Bureau consented score not yet ingested")
        if not data.get("employer"):
            missing_data.append("Primary employer corporate details unverified")

        return {
            "estimated_monthly_emi": monthly_emi,
            "debt_to_income_ratio": dti_ratio,
            "loan_to_value_ratio": ltv_ratio,
            "total_interest_payable": total_interest,
            "total_repayment_amount": total_repayment,
            "repayment_capacity_rating": capacity_rating,
            "risk_factors": risk_factors,
            "missing_data": missing_data,
            "disposable_income_after_debt": round(total_monthly_income - total_monthly_obligations, 2)
        }

underwriting_service = UnderwritingService()
