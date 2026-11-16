import re
from typing import Dict, Any, List

class DocumentService:
    @staticmethod
    def extract_document_data(file_name: str, doc_type: str, raw_content: bytes = None) -> Dict[str, Any]:
        """Performs simulated and rule-based OCR data extraction and cross-check validation."""
        clean_name = file_name.lower()
        extracted_fields: Dict[str, Any] = {}
        validation_flags: List[str] = []
        extracted_text = ""

        if "salary" in clean_name or "pay" in clean_name or doc_type == "Income Proof":
            extracted_text = f"MONTHLY SALARY SLIP\nEmployer: Tech Innovations Global Pvt Ltd\nEmployee Name: Rahul Sharma\nPay Period: October 2026\nGross Salary: INR 2,25,000\nNet Deductions: INR 28,500\nNet Pay: INR 1,96,500\nBank Account: HDFC Bank - A/C No. XXXXXX8941"
            extracted_fields = {
                "document_category": "Income Proof / Salary Slip",
                "extracted_name": "Rahul Sharma",
                "employer": "Tech Innovations Global Pvt Ltd",
                "gross_income": 225000,
                "net_income": 196500,
                "statement_month": "October 2026",
                "bank_reference": "HDFC Bank"
            }
        elif "bank" in clean_name or "statement" in clean_name or doc_type == "Bank Statement":
            extracted_text = f"ACCOUNT STATEMENT - 6 MONTH SUMMARY\nAccount Holder: Rahul Sharma\nBank: HDFC Bank Premium Banking\nAccount Number: 50100492818941\nAverage Monthly Balance: INR 3,85,000\nSalary Inflow Credited: Regularly 1st of every month\nBounces / Unpaid Cheques: 0"
            extracted_fields = {
                "document_category": "Bank Statement",
                "extracted_name": "Rahul Sharma",
                "average_monthly_balance": 385000,
                "salary_credit_regularity": "Consistent (1st of Month)",
                "cheque_dishonour_count": 0
            }
        elif "aadhaar" in clean_name or "pan" in clean_name or "passport" in clean_name or doc_type == "Identity Proof":
            extracted_text = f"GOVERNMENT OF INDIA - TAX IDENTIFICATION / AADHAAR\nName: Rahul Sharma\nFather Name: K. L. Sharma\nDOB: 14/08/1988\nID Ref: ABCPS9412M\nVerification Status: Digitally Signed XML Match"
            extracted_fields = {
                "document_category": "Identity Document",
                "extracted_name": "Rahul Sharma",
                "date_of_birth": "14/08/1988",
                "id_number_masked": "••••••••9412M",
                "signature_validity": "Valid Cryptographic Signature"
            }
        elif "sale" in clean_name or "deed" in clean_name or "property" in clean_name or doc_type == "Property Document":
            extracted_text = f"REGISTERED SALE DEED & TITLE CONVEYANCE\nProperty: Flat 802, Highline Horizon, Powai, Mumbai\nSurvey Number: CTS 849/2\nBuilt-up Area: 1450 sqft\nSeller: Apex Developers LLP\nPurchaser: Rahul Sharma\nEncumbrance Status: Nil"
            extracted_fields = {
                "document_category": "Property Title Deed",
                "property_address": "Flat 802, Highline Horizon, Powai, Mumbai",
                "survey_number": "CTS 849/2",
                "built_up_area_sqft": 1450,
                "encumbrance_status": "Clear / Nil Encumbrance"
            }
        else:
            extracted_text = f"TAX COMPLIANCE ACKNOWLEDGEMENT\nAssessment Year: 2026-27\nAssessee: Rahul Sharma\nTotal Taxable Income: INR 26,40,000\nTax Paid: INR 5,82,000\nFiling Status: Verified"
            extracted_fields = {
                "document_category": "Income Tax Assessment",
                "extracted_name": "Rahul Sharma",
                "annual_taxable_income": 2640000,
                "tax_paid": 582000,
                "acknowledgement_status": "ITR-V Digitally Verified"
            }

        # Quality & Inconsistency validation checks
        if "extracted_name" in extracted_fields and extracted_fields["extracted_name"] != "Rahul Sharma":
            validation_flags.append("Potential applicant name mismatch across secondary records")
        if "encumbrance_status" in extracted_fields and extracted_fields["encumbrance_status"] != "Clear / Nil Encumbrance":
            validation_flags.append("Encumbrance certificate requires legal conveyancer review")

        verification_status = "Verified" if not validation_flags else "Needs Review"

        return {
            "extracted_text": extracted_text,
            "extracted_fields": extracted_fields,
            "validation_flags": validation_flags,
            "verification_status": verification_status,
            "ocr_status": "Processed"
        }

document_service = DocumentService()
