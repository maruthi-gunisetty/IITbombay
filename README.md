# PROPWISE AI

### *Smarter Property Valuation. Safer Lending Decisions.*

PROPWISE AI is an enterprise real estate and fintech intelligence platform combining automated machine learning property valuation (AVM), mortgage underwriting calculations, optical document extraction, statistical fraud/anomaly detection, decoupled risk scoring, and context-grounded AI decision support.

---

## Brand Identity & Exact Color Palette

The user interface strictly adheres to an enterprise dark fintech aesthetic with zero emojis and zero informal hyphens:

| Surface / Element | Exact Hex Color | Purpose |
| :--- | :--- | :--- |
| **Main Background** | `#080E1B` | Primary platform canvas background |
| **Secondary Background**| `#0D1628` | Nested modules, modal headers, navigation drawer |
| **Sidebar Background**  | `#0A1222` | Permanent authenticated navigation drawer |
| **Cards & Panels**      | `#111D32` | Metric surfaces, data tables, analytical cards |
| **Primary Blue**        | `#3978F6` | Primary CTAs, active highlights, key metrics |
| **Secondary Blue**      | `#2457C5` | Hover states, gradient anchors, secondary actions |
| **Accent Cyan**         | `#29C5E8` | Feature icons, status accents, highlight text |
| **Success Emerald**     | `#20C997` | Prime tiers, approved applications, high confidence |
| **Warning Amber**       | `#F5B942` | Under investigation, moderate risk, threshold DTI |
| **Danger Rose**         | `#EF5B67` | High/Critical fraud flags, elevated LTV anomalies |
| **Primary Text**        | `#F5F7FC` | High-contrast headings and primary metrics |
| **Secondary Text**      | `#98A7BD` | Subtitles, labels, timestamps, metadata |
| **Borders & Dividers**  | `#23324A` | Institutional card borders, table dividers |

---

## Core Institutional Modules

### 1. Automated Machine Learning Valuation (AVM)
- Multi-parameter non-linear regression factoring locality base rate, built-up area, room layouts, physical construction grade (Premium, A Grade, Standard, Economy), asset condition, and annual depreciation.
- SHAP-style explainable feature attribution breakdown.
- Upper and lower uncertainty bounds with 94%+ statistical confidence scoring.
- Comparable cluster transaction lookups.

### 2. Mortgage Underwriting Engine
- Validated reducing-balance monthly EMI calculation:
  $$\text{EMI} = P \times r \times \frac{(1+r)^n}{(1+r)^n - 1}$$
- Debt-to-Income (DTI) and Loan-to-Value (LTV) ratios.
- Affordability indices and repayment capacity classifications.
- Non-delegable human credit officer adjudication workflow.

### 3. Unified Risk Intelligence
- Decoupled Collateral Asset Risk ($0 - 100$) vs. Borrower Repayment Risk ($0 - 100$).
- Configurable institutional aggregation policy:
  $$\text{Composite Risk} = (0.45 \times \text{Collateral Risk}) + (0.55 \times \text{Borrower Risk})$$
- Real-time interactive policy simulator.

### 4. Document Intelligence & OCR
- File ingestion (PDF, PNG, JPG) with text extraction.
- Entity parsing for salary slips, bank statements, Aadhaar/PAN, title deeds, and tax filings.
- Cross-document name mismatch and encumbrance discrepancy checks.

### 5. Fraud & Anomaly Detection
- Real-time statistical screening for unit price inflation spikes ($> 2.8\sigma$).
- Geometric dimensional inconsistencies (e.g., built-up area exceeding plotted land area).
- Excessive leverage multiple detection ($> 7\times$ annual income) and high LTV ceiling breaches.
- Status investigation tracking (Open, Under Investigation, Escalated, Resolved).

### 6. Geospatial Location Intelligence
- Interactive OpenStreetMap and Leaflet map canvas.
- Verified spatial proximity to metro transit corridors, international schools, and multispecialty medical infrastructure.
- Locality demand and absorption scores.

### 7. Dual API Key Management (BYOK)
- Dedicated Bring Your Own Key support for OpenRouter.
- Secure server-side AES-256-GCM authenticated encryption.
- Intelligent automatic fallback routing: if platform quota is exhausted, automatically route to validated personal key.
- Live usage telemetry and request counters.

### 8. Institutional Reports & Certified PDFs
- Direct programmatic PDF compilation via ReportLab.
- Downloadable institutional dossiers with cryptographic reference IDs and policy disclosures.

---

## Default Demo Profiles

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Enterprise Admin** | `admin@propwise.ai` | `Admin@PropWise2026` | Full platform administration, user directory governance, audit logs |
| **Bank Officer** | `officer@propwise.ai` | `Officer@PropWise2026` | Mortgage adjudication, fraud investigations, underwriting reviews |
| **Customer** | `customer@propwise.ai` | `Customer@PropWise2026` | Asset registration, loan application, personal dossiers |
| **Property Analyst** | `analyst@propwise.ai` | `Analyst@PropWise2026` | Valuation modeling, market analytics, locality comparisons |

---

## Local Development & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Server Setup
```bash
# From workspace root
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
- API Documentation: `http://127.0.0.1:8000/docs`
- Health Endpoint: `http://127.0.0.1:8000/api/health`

### 2. Frontend Application Setup
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
- Web Application: `http://localhost:5173`
