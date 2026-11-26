import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator, Landmark, ShieldAlert, FileText, AlertTriangle,
  MapPin, TrendingUp, FileCheck2, Bot, ArrowRight, ShieldCheck,
  CheckCircle2, Lock, Cpu, Eye, Users, FileSignature, Sparkles,
  Building, ChevronRight, Activity, ArrowUpRight, Check, Play,
  BarChart3, RefreshCw, Home
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { propertiesAPI } from '../../services/api';
import PropertyImage from '../../components/common/PropertyImage';
import { getPropertyFallbackImage } from '../../utils/propertyImages';

const sampleAssets = [
  {
    id: "sample-1",
    name: "Highline Horizon Penthouse",
    locality: "Powai, Mumbai Suburban",
    type: "Penthouse 4 BHK",
    valuation: "INR 7.45 Cr",
    confidence: "94.2% ML Bound",
    rateSqft: "INR 26,140 / sqft",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    applicationId: "LN-2026-89410A",
    underwriting: "Prime File",
    dti: "44.1%",
    ltv: "64.4%",
    emi: "INR 4,13,550",
    tenure: "20 Year Amortization",
    collateralRisk: "22.5 / 100",
    borrowerRisk: "24.0 / 100",
    riskCategory: "Low Risk",
    riskColor: "#059669"
  },
  {
    id: "sample-2",
    name: "DLF Magnolias Signature Golf Villa",
    locality: "Golf Course Road, Gurugram",
    type: "Ultra-Luxury Villa",
    valuation: "INR 26.50 Cr",
    confidence: "96.4% ML Bound",
    rateSqft: "INR 41,400 / sqft",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    applicationId: "LN-2026-90241B",
    underwriting: "HNW Private Tier",
    dti: "31.8%",
    ltv: "55.0%",
    emi: "INR 11,28,400",
    tenure: "15 Year Amortization",
    collateralRisk: "16.8 / 100",
    borrowerRisk: "18.2 / 100",
    riskCategory: "Low Risk",
    riskColor: "#059669"
  },
  {
    id: "sample-3",
    name: "Jubilee Hills Private Hilltop Compound",
    locality: "Jubilee Hills, Hyderabad",
    type: "Hilltop Estate 5 BHK",
    valuation: "INR 32.00 Cr",
    confidence: "95.1% ML Bound",
    rateSqft: "INR 37,200 / sqft",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    applicationId: "LN-2026-91480C",
    underwriting: "Institutional File",
    dti: "36.5%",
    ltv: "50.0%",
    emi: "INR 12,95,000",
    tenure: "20 Year Amortization",
    collateralRisk: "19.4 / 100",
    borrowerRisk: "21.0 / 100",
    riskCategory: "Low Risk",
    riskColor: "#059669"
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeAssetIndex, setActiveAssetIndex] = useState(0);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);

  // Quick Valuation Playground State
  const [calcCity, setCalcCity] = useState('Mumbai');
  const [calcSqft, setCalcSqft] = useState(2400);
  const [calcBhk, setCalcBhk] = useState(3);
  const [calcQuality, setCalcQuality] = useState('Premium');
  const [calcResult, setCalcResult] = useState(null);

  const activeAsset = sampleAssets[activeAssetIndex];

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await propertiesAPI.list();
        if (res.data && res.data.length > 0) {
          setFeaturedProperties(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load featured properties:", err);
      } finally {
        setLoadingProps(false);
      }
    };
    fetchProps();
  }, []);

  const runQuickValuation = (e) => {
    e.preventDefault();
    const cityRates = {
      'Mumbai': 28500,
      'Gurugram': 21000,
      'Bengaluru': 14500,
      'Hyderabad': 13200,
      'Goa': 18500
    };
    const qualityMultipliers = {
      'Standard': 0.85,
      'Premium': 1.0,
      'Luxury': 1.25,
      'Ultra Luxury': 1.55
    };
    const baseRate = cityRates[calcCity] || 20000;
    const mult = qualityMultipliers[calcQuality] || 1.0;
    const estimatedValue = calcSqft * baseRate * mult;
    const lower = estimatedValue * 0.94;
    const upper = estimatedValue * 1.06;

    setCalcResult({
      estimated: estimatedValue,
      lower: lower,
      upper: upper,
      ratePerSqft: Math.round(baseRate * mult),
      confidence: 94.8
    });
  };

  const formatCurrency = (val) => {
    if (!val) return 'INR 0';
    if (val >= 10000000) {
      return `INR ${(val / 10000000).toFixed(2)} Cr`;
    }
    return `INR ${(val / 100000).toFixed(2)} Lakhs`;
  };

  const features = [
    {
      icon: Calculator,
      title: "AI Property Valuation",
      tag: "Multi-Variable ML",
      desc: "Multi-variable regression models with price-per-square-foot benchmarking, confidence intervals, and explainable feature contributions.",
      link: "/valuation"
    },
    {
      icon: Landmark,
      title: "Mortgage Underwriting",
      tag: "FinTech Decisioning",
      desc: "Automated debt-to-income (DTI) and loan-to-value (LTV) calculations with amortization schedules and credit reviewer workflows.",
      link: "/register"
    },
    {
      icon: ShieldAlert,
      title: "Unified Risk Intelligence",
      tag: "Dual-Vector Policy",
      desc: "Decoupled evaluation of collateral asset risk and borrower repayment capacity, aggregated through documented institutional policies.",
      link: "/register"
    },
    {
      icon: FileText,
      title: "Document Intelligence",
      tag: "Automated OCR",
      desc: "Optical character recognition (OCR) and automated extraction for title deeds, income proofs, tax records, and bank statements.",
      link: "/register"
    },
    {
      icon: AlertTriangle,
      title: "Fraud & Anomaly Detection",
      tag: "Integrity Engine",
      desc: "Real-time scans for valuation inflation spikes, geometric plot discrepancies, duplicate asset listings, and excessive leverage.",
      link: "/register"
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      tag: "Geospatial GIS",
      desc: "Geospatial mapping and proximity analysis measuring transit connectivity, educational infrastructure, and locality density.",
      link: "/register"
    },
    {
      icon: TrendingUp,
      title: "Market Analytics",
      tag: "Price Velocity",
      desc: "Longitudinal price velocity metrics, quarterly locality comparisons, and housing sector demand indices across primary clusters.",
      link: "/register"
    },
    {
      icon: FileCheck2,
      title: "Automated Reporting",
      tag: "Cryptographic PDF",
      desc: "Institution-grade downloadable PDF dossiers with cryptographic reference numbers, assessment breakdowns, and policy disclosures.",
      link: "/register"
    },
    {
      icon: Bot,
      title: "Gruha Anwesh AI Assistant",
      tag: "Dual BYOK Copilot",
      desc: "Context-grounded assistant powered by dual API key management (BYOK), providing rigorous financial explanations without hallucinations.",
      link: "/register"
    }
  ];

  const workflowSteps = [
    { step: "01", title: "Asset & Applicant Ingestion", desc: "Structured capture of property specifications, coordinates, and applicant financial profile." },
    { step: "02", title: "AI Property Valuation", desc: "Multi-factor valuation regression generating price range, confidence score, and comparable metrics." },
    { step: "03", title: "Borrower Capacity Analysis", desc: "Precise EMI amortization, debt-to-income (DTI) ratio, and disposable income stress testing." },
    { step: "04", title: "Document OCR Extraction", desc: "Automated optical extraction and cross-consistency validation of identification and income deeds." },
    { step: "05", title: "Anomaly & Fraud Scanning", desc: "Algorithmic screening for valuation spikes, duplicate registrations, and leverage boundaries." },
    { step: "06", title: "Unified Risk Aggregation", desc: "Collateral risk and borrower capacity combined with transparent institutional policy weights." },
    { step: "07", title: "Human Review Decision", desc: "Final underwriting determination authorized by certified banking officers with immutable audit logging." },
  ];

  const securityPillars = [
    { icon: Lock, title: "AES-256-GCM Encryption", desc: "All BYOK personal API credentials encrypted at rest using authenticated cryptography." },
    { icon: Cpu, title: "Explainable Machine Learning", desc: "Every valuation displays explicit factor contributions; zero black-box numerical hallucinations." },
    { icon: Eye, title: "Human-in-the-Loop Governance", desc: "AI models serve strictly as decision support; lending sanction authority rests with credit officers." },
    { icon: FileSignature, title: "Immutable Audit Traceability", desc: "Complete cryptographic audit logs for every valuation, credit inquiry, and status alteration." },
    { icon: Users, title: "Role-Based Access Control", desc: "Strict data boundaries ensuring customers, property analysts, and bank officers access authorized records only." },
    { icon: ShieldCheck, title: "Explicit User Consent", desc: "Transparent consent capture for credit bureau data processing and automated underwriting analytics." },
  ];

  return (
    <div className="bg-[#FAFBF7] text-[#3D4127] min-h-screen flex flex-col font-sans antialiased selection:bg-[#636B2F] selection:text-white">
      {/* Sticky Dark Navigation Bar */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 bg-[#FAFBF7] overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#636B2F]/15 via-[#BAC095]/10 to-transparent blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-10 w-72 h-72 bg-[#D4DE95]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 right-10 w-80 h-80 bg-[#BAC095]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header Text & Badges */}
            <div className="text-center max-w-4xl mx-auto space-y-6">
              
              {/* Institutional Pill Badge */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E2E6D5] text-[11px] font-semibold text-[#636B2F] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#636B2F] animate-pulse" />
                <span className="tracking-wide uppercase font-bold text-[#3D4127]">
                  Enterprise Property Valuation &amp; Mortgage Underwriting Intelligence
                </span>
              </div>

              {/* Master Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#3D4127] tracking-tight leading-[1.15]">
                Transform Property Data Into <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#636B2F] via-[#3D4127] to-[#636B2F] bg-clip-text text-transparent">
                  Smarter Lending Decisions.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-[#5A613A] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                An intelligent real estate and fintech platform combining AI-powered property valuation, 
                mortgage underwriting, risk intelligence, and document verification.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="px-7 py-3.5 rounded-xl bg-[#636B2F] hover:bg-[#3D4127] text-white text-sm font-semibold transition-all duration-200 shadow-xl shadow-[#636B2F]/30 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#platform"
                  className="px-6 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAFBF7] text-[#3D4127] border border-[#E2E6D5] text-sm font-semibold transition-all duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Explore Platform</span>
                  <ChevronRight className="w-4 h-4 text-[#5A613A]" />
                </a>

                <Link
                  to="/catalog"
                  className="px-6 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAFBF7] text-[#3D4127] border border-[#E2E6D5] text-sm font-semibold transition-all duration-200 flex items-center space-x-2"
                >
                  <Building className="w-4 h-4 text-[#636B2F]" />
                  <span>Browse Properties</span>
                </Link>

                <Link
                  to="/valuation"
                  className="px-6 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAFBF7] text-[#636B2F] border border-[#E2E6D5] text-sm font-semibold transition-all duration-200 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-[#636B2F]" />
                  <span>AI Valuation Studio</span>
                </Link>
              </div>

            </div>

            {/* DASHBOARD PREVIEW COMPONENT (Exact UI Style as Dashboard) */}
            <div className="mt-14 max-w-6xl mx-auto">
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl shadow-2xl shadow-[#F8FAFC] overflow-hidden">
                
                {/* Browser-style Top Bar */}
                <div className="bg-slate-100 px-5 py-3.5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#DC2626]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#D97706]/80" />
                      <div className="w-3 h-3 rounded-full bg-[#059669]/80" />
                    </div>
                    <div className="px-3 py-1 rounded-md bg-white border border-[#E2E8F0] text-[11px] font-mono text-[#475569] flex items-center space-x-1.5">
                      <Lock className="w-3 h-3 text-[#059669]" />
                      <span>gruhaanwesh.ai/dashboard/intelligence</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-white px-2.5 py-1 rounded border border-[#E2E8F0]">
                      Institutional Decision Engine
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#059669]" />
                  </div>
                </div>

                {/* Interactive Sample Asset Selector */}
                <div className="bg-slate-50 px-5 py-2.5 border-b border-[#E2E8F0] flex items-center space-x-2 overflow-x-auto text-xs">
                  <span className="text-[#475569] text-[11px] font-semibold whitespace-nowrap mr-2">Sample Portfolio Files:</span>
                  {sampleAssets.map((asset, idx) => (
                    <button
                      key={asset.id}
                      onClick={() => setActiveAssetIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                        activeAssetIndex === idx
                          ? 'bg-[#3978F6] text-white shadow-sm'
                          : 'bg-[#FFFFFF] text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0]'
                      }`}
                    >
                      <span>{asset.name}</span>
                      <span className="text-[10px] opacity-75">({asset.valuation})</span>
                    </button>
                  ))}
                </div>

                {/* Dashboard Decision Engine Layout */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/60">
                  
                  {/* Left Column: Collateral Snapshot Card */}
                  <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#0284C7]">
                          {activeAsset.type}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#059669]/15 text-[#059669] border border-[#059669]/30">
                          Active Collateral
                        </span>
                      </div>

                      {/* Property Image with Fallback */}
                      <div className="relative h-44 rounded-lg overflow-hidden border border-[#E2E8F0] mb-4 bg-[#F8FAFC]">
                        <img
                          src={activeAsset.image}
                          alt={activeAsset.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getPropertyFallbackImage(activeAsset.type, activeAsset.name);
                            e.target.alt = '';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#E2E8F0] text-[11px] font-semibold text-[#0F172A] flex items-center space-x-1 shadow-sm">
                          <MapPin className="w-3 h-3 text-[#3978F6]" />
                          <span>{activeAsset.locality}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-[#0F172A] leading-snug">
                        {activeAsset.name}
                      </h3>
                    </div>

                    <div className="pt-4 border-t border-[#E2E8F0] mt-4 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#475569] tracking-wider block">
                          AI Assessed Valuation
                        </span>
                        <span className="text-2xl font-extrabold text-[#059669] tracking-tight block">
                          {activeAsset.valuation}
                        </span>
                        <span className="text-[10px] text-[#475569]">Benchmark: {activeAsset.rateSqft}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-[#475569] tracking-wider block">Confidence</span>
                        <span className="text-xs font-bold text-[#0284C7] bg-[#0284C7]/10 px-2.5 py-1 rounded-md border border-[#0284C7]/20 inline-block mt-0.5">
                          {activeAsset.confidence}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Mortgage Underwriting Assessment */}
                  <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569] block">Underwriting File</span>
                          <span className="text-xs font-mono font-bold text-[#0F172A]">{activeAsset.applicationId}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#3978F6]/20 text-[#3978F6] border border-[#3978F6]/40">
                          {activeAsset.underwriting}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-[#475569]">Debt-to-Income (DTI)</span>
                            <span className="font-bold text-[#0F172A]">{activeAsset.dti}</span>
                          </div>
                          <div className="w-full bg-[#FFFFFF] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#3978F6] h-full rounded-full" style={{ width: activeAsset.dti }} />
                          </div>
                          <span className="text-[9px] text-[#059669] mt-1 block">Within institutional threshold (&lt; 45%)</span>
                        </div>

                        <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-[#475569]">Loan-to-Value (LTV)</span>
                            <span className="font-bold text-[#0F172A]">{activeAsset.ltv}</span>
                          </div>
                          <div className="w-full bg-[#FFFFFF] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#0284C7] h-full rounded-full" style={{ width: activeAsset.ltv }} />
                          </div>
                          <span className="text-[9px] text-[#059669] mt-1 block">Comfortable collateral cushion (&lt; 75%)</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0] mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#475569]">Monthly Debt Service:</span>
                        <span className="font-bold text-[#0F172A]">{activeAsset.emi}</span>
                      </div>
                      <span className="text-[10px] text-[#475569] block mt-0.5">{activeAsset.tenure}</span>
                    </div>
                  </div>

                  {/* Right Column: Unified Risk Matrix */}
                  <div className="lg:col-span-3 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569]">Unified Risk Matrix</span>
                        <span className="text-[10px] font-semibold text-[#0284C7]">v3.1 Policy</span>
                      </div>

                      <div className="text-center py-2">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-[#059669] bg-[#F8FAFC] shadow-lg shadow-[#059669]/20">
                          <span className="text-xl font-extrabold text-[#059669]">A+</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs font-bold text-[#059669] block">{activeAsset.riskCategory}</span>
                          <span className="text-[10px] text-[#475569]">Decoupled Vector Score</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-[#E2E8F0]/50">
                          <span className="text-[#475569]">Collateral Risk</span>
                          <span className="font-bold text-[#059669]">{activeAsset.collateralRisk}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-[#475569]">Borrower Risk</span>
                          <span className="font-bold text-[#059669]">{activeAsset.borrowerRisk}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/login"
                      className="w-full mt-4 py-2.5 rounded-lg bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold text-center transition-colors flex items-center justify-center space-x-1 shadow-md shadow-[#3978F6]/20"
                    >
                      <span>Inspect Credit Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

                {/* Live Underwriting Activity Ticker */}
                <div className="bg-slate-100 px-6 py-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between text-xs text-[#475569] gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center space-x-1.5 text-[#059669] font-semibold text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                      <span>LIVE SYSTEM METRICS</span>
                    </span>
                    <span className="hidden sm:inline text-[#E2E8F0]">|</span>
                    <span className="hidden sm:inline">Active Loan Book: <b className="text-[#0F172A]">INR 48,500 Cr+</b></span>
                    <span className="hidden md:inline text-[#E2E8F0]">|</span>
                    <span className="hidden md:inline">Mean ML Valuation Variance: <b className="text-[#059669]">&lt; 3.2%</b></span>
                  </div>

                  <Link to="/catalog" className="text-[#3978F6] hover:text-[#0284C7] text-xs font-medium flex items-center space-x-1">
                    <span>Explore All Live Properties</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* PLATFORM FEATURES SECTION */}
        <section id="features" className="py-24 bg-[#F1F5F9] border-t border-[#E2E8F0] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold tracking-wider text-[#3978F6] uppercase bg-[#3978F6]/10 px-3 py-1 rounded-full border border-[#3978F6]/20">
                Integrated Intelligence Suite
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Comprehensive Real Estate &amp; Lending Modules
              </h2>
              <p className="text-[#475569] text-base leading-relaxed">
                Every critical dimension of real estate appraisal and mortgage risk assessment unified into one interconnected enterprise environment.
              </p>
            </div>

            {/* 9 Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#3978F6]/60 rounded-xl p-6 transition-all duration-200 shadow-md flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#3978F6]/20 to-[#0284C7]/20 border border-[#E2E8F0] flex items-center justify-center text-[#0284C7] group-hover:text-white group-hover:border-[#3978F6] transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569] bg-white px-2.5 py-1 rounded border border-[#E2E8F0]">
                          {f.tag}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#0284C7] transition-colors">
                          {f.title}
                        </h3>
                        <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                          {f.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E2E8F0] mt-5">
                      <Link
                        to={f.link}
                        className="text-xs font-semibold text-[#3978F6] hover:text-[#0284C7] inline-flex items-center space-x-1.5 transition-colors"
                      >
                        <span>Launch Module</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* HOW IT WORKS SECTION (7-Step Workflow) */}
        <section id="workflow" className="py-24 bg-white border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold tracking-wider text-[#0284C7] uppercase bg-[#0284C7]/10 px-3 py-1 rounded-full border border-[#0284C7]/20">
                End-to-End Orchestration
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                How It Works: Institutional Lending Lifecycle
              </h2>
              <p className="text-[#475569] text-base leading-relaxed">
                Structured sequence connecting automated ingestion, algorithmic appraisal, fraud verification, and certified credit committee sign-off.
              </p>
            </div>

            {/* Workflow Steps 1 to 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {workflowSteps.slice(0, 4).map((ws, i) => (
                <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 relative flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[#3978F6]/30 block mb-2 font-mono">
                      {ws.step}
                    </span>
                    <h4 className="text-sm font-bold text-[#0F172A]">{ws.title}</h4>
                    <p className="text-xs text-[#475569] mt-2 leading-relaxed">{ws.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0]/60 flex items-center text-[10px] text-[#0284C7]">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#059669]" />
                    <span>Automated Protocol</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Workflow Steps 5 to 7 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {workflowSteps.slice(4).map((ws, i) => (
                <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-5 relative flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[#0284C7]/30 block mb-2 font-mono">
                      {ws.step}
                    </span>
                    <h4 className="text-sm font-bold text-[#0F172A]">{ws.title}</h4>
                    <p className="text-xs text-[#475569] mt-2 leading-relaxed">{ws.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#E2E8F0]/60 flex items-center text-[10px] text-[#059669]">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#059669]" />
                    <span>{ws.step === "07" ? "Certified Sign-Off" : "Automated Protocol"}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* LIVE FEATURED PROPERTIES PORTFOLIO (Exact Same Card UI as Dashboard) */}
        <section id="properties" className="py-24 bg-[#F1F5F9] border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#059669] uppercase bg-[#059669]/10 px-3 py-1 rounded-full border border-[#059669]/20">
                  Collateral Asset Directory
                </span>
                <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-2">
                  Featured Prime Properties
                </h2>
                <p className="text-[#475569] text-sm mt-1">
                  Verified real estate collateral records currently managed across the platform.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  to="/catalog"
                  className="px-5 py-2.5 rounded-lg bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-md shadow-[#3978F6]/20"
                >
                  <span>View All Properties ({featuredProperties.length > 0 ? '12+' : '6'})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 rounded-lg bg-[#FFFFFF] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#E2E8F0] text-xs font-semibold transition-colors"
                >
                  + Register Asset
                </Link>
              </div>
            </div>

            {/* Properties Grid (Styled exactly like dashboard cards in Image 2) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featuredProperties.length > 0 ? featuredProperties : [
                {
                  id: "p1",
                  name: "Assagao Heritage Portuguese Estate",
                  city: "Assagao, Goa",
                  property_type: "Historic Estate",
                  bedrooms: 4,
                  bathrooms: 5,
                  parking_spaces: 4,
                  built_up_area_sqft: 6200,
                  construction_quality: "Restored Indo-Portuguese",
                  estimated_value: 185000000,
                  status: "Off-Market",
                  image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
                },
                {
                  id: "p2",
                  name: "DLF Magnolias Signature Golf Villa",
                  city: "Golf Course Road, Gurugram",
                  property_type: "Penthouse",
                  bedrooms: 4,
                  bathrooms: 5,
                  parking_spaces: 4,
                  built_up_area_sqft: 6400,
                  construction_quality: "Ultra Luxury Specification",
                  estimated_value: 265000000,
                  status: "Available",
                  image_url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
                },
                {
                  id: "p3",
                  name: "Jubilee Hills Private Hilltop Compound",
                  city: "Jubilee Hills, Hyderabad",
                  property_type: "Villa",
                  bedrooms: 5,
                  bathrooms: 7,
                  parking_spaces: 5,
                  built_up_area_sqft: 8600,
                  construction_quality: "Ultra Luxury Specification",
                  estimated_value: 320000000,
                  status: "Available",
                  image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                }
              ]).map((prop) => (
                <div
                  key={prop.id}
                  className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#3978F6]/60 rounded-xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Header with badges */}
                    <div className="relative h-48 bg-[#F8FAFC] overflow-hidden">
                      <PropertyImage
                        src={prop.image_url}
                        alt={prop.name}
                        propertyType={prop.property_type}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF]/90 text-[#0284C7] border border-[#E2E8F0] backdrop-blur-sm shadow-sm">
                          {prop.property_type || "Residential"}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm ${
                          prop.status === 'Off-Market'
                            ? 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/40'
                            : 'bg-[#059669]/15 text-[#059669] border border-[#059669]/40'
                        }`}>
                          {prop.status || 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-[#0F172A] leading-snug line-clamp-1">
                          {prop.name}
                        </h3>
                        <div className="flex items-center space-x-1.5 text-xs text-[#475569] mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#3978F6]" />
                          <span>{prop.locality ? `${prop.locality}, ${prop.city}` : prop.city}</span>
                        </div>
                      </div>

                      {/* Spec Matrix */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                        <div className="text-center">
                          <span className="text-[#475569] text-[10px] block">Bedrooms</span>
                          <span className="font-bold text-[#0F172A]">{prop.bedrooms || 3} BHK</span>
                        </div>
                        <div className="text-center border-x border-[#E2E8F0]">
                          <span className="text-[#475569] text-[10px] block">Bathrooms</span>
                          <span className="font-bold text-[#0F172A]">{prop.bathrooms || 3} Baths</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[#475569] text-[10px] block">Parking</span>
                          <span className="font-bold text-[#0F172A]">{prop.parking_spaces || 2} Park</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-[#475569] pt-1">
                        <div className="flex justify-between">
                          <span>Built-up Area:</span>
                          <span className="text-[#0F172A] font-semibold">{prop.built_up_area_sqft || 2800} sqft</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality Grade:</span>
                          <span className="text-[#059669] font-semibold">{prop.construction_quality || 'Premium'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Valuation and Action Footer */}
                  <div className="px-5 py-4 bg-[#F1F5F9] border-t border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#475569] block">
                        Assessed ML Value
                      </span>
                      <span className="text-base font-extrabold text-[#059669]">
                        {formatCurrency(prop.estimated_value)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/property/${prop.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold transition-colors flex items-center space-x-1"
                      >
                        <span>Inspect</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* INSTANT VALUATION CALCULATOR PLAYGROUND */}
        <section className="py-20 bg-white border-t border-[#E2E8F0]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-2xl">
              
              <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0284C7]">Interactive Simulation</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                  Run Instant AI Property Appraisal
                </h3>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Test our multi-variable price-per-square-foot regression model right now without signing in.
                </p>
              </div>

              <form onSubmit={runQuickValuation} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1.5">Metropolitan Cluster</label>
                  <select
                    value={calcCity}
                    onChange={(e) => setCalcCity(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:border-[#3978F6] outline-none cursor-pointer"
                  >
                    <option value="Mumbai">Mumbai Metropolitan (MMR)</option>
                    <option value="Gurugram">Gurugram / NCR Cyber City</option>
                    <option value="Bengaluru">Bengaluru Tech Corridor</option>
                    <option value="Hyderabad">Hyderabad Financial District</option>
                    <option value="Goa">North Goa Coastal Enclaves</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1.5">Built-up Area (Sq Ft)</label>
                  <input
                    type="number"
                    min="500"
                    max="20000"
                    step="50"
                    value={calcSqft}
                    onChange={(e) => setCalcSqft(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:border-[#3978F6] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1.5">Bedroom Configuration</label>
                  <select
                    value={calcBhk}
                    onChange={(e) => setCalcBhk(Number(e.target.value))}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:border-[#3978F6] outline-none cursor-pointer"
                  >
                    <option value="2">2 BHK Executive</option>
                    <option value="3">3 BHK Premium</option>
                    <option value="4">4 BHK Penthouse</option>
                    <option value="5">5+ BHK Estate Compound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1.5">Specification Grade</label>
                  <select
                    value={calcQuality}
                    onChange={(e) => setCalcQuality(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-xs text-[#0F172A] font-semibold focus:border-[#3978F6] outline-none cursor-pointer"
                  >
                    <option value="Standard">Standard Finishes</option>
                    <option value="Premium">Premium Architecture</option>
                    <option value="Luxury">Luxury Grade Specification</option>
                    <option value="Ultra Luxury">Ultra Luxury Bespoke</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-4 mt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#3978F6] to-[#0284C7] hover:opacity-95 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#3978F6]/25 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Instant AI Valuation Regression</span>
                  </button>
                </div>
              </form>

              {/* Instant Valuation Result Display */}
              {calcResult && (
                <div className="bg-[#F8FAFC] border border-[#059669]/40 rounded-xl p-6 mt-6 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-[#0284C7] tracking-wider block">Estimated Market Valuation</span>
                      <span className="text-3xl font-extrabold text-[#059669] tracking-tight">
                        {formatCurrency(calcResult.estimated)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs">
                      <div className="bg-[#FFFFFF] px-3.5 py-2 rounded-lg border border-[#E2E8F0]">
                        <span className="text-[#475569] block text-[10px]">Benchmarked Rate</span>
                        <span className="font-bold text-[#0F172A]">INR {calcResult.ratePerSqft.toLocaleString()} / sqft</span>
                      </div>
                      <div className="bg-[#FFFFFF] px-3.5 py-2 rounded-lg border border-[#E2E8F0]">
                        <span className="text-[#475569] block text-[10px]">ML Confidence</span>
                        <span className="font-bold text-[#059669]">{calcResult.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#475569] gap-3">
                    <span>
                      Confidence Interval (95% ML Bound): <b className="text-[#0F172A]">{formatCurrency(calcResult.lower)} — {formatCurrency(calcResult.upper)}</b>
                    </span>
                    <Link
                      to="/valuation"
                      className="text-[#3978F6] hover:text-[#0284C7] font-semibold flex items-center space-x-1"
                    >
                      <span>Open Full Multi-Factor Valuation Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* TRUST, SECURITY & GOVERNANCE SECTION */}
        <section id="security" className="py-24 bg-[#F1F5F9] border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold tracking-wider text-[#059669] uppercase bg-[#059669]/10 px-3 py-1 rounded-full border border-[#059669]/20">
                Enterprise Security &amp; Governance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Security Built for Regulated Institutions
              </h2>
              <p className="text-[#475569] text-base leading-relaxed">
                Engineered with authenticated encryption, non-delegable human authority, and transparent model explainability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityPillars.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <div key={i} className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#3978F6]/40 rounded-xl p-6 space-y-3 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#059669]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A]">{pillar.title}</h3>
                    <p className="text-xs text-[#475569] leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* INSTITUTIONAL CALL TO ACTION BANNER */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border-t border-[#E2E8F0] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#3978F6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#0284C7] bg-[#FFFFFF] px-4 py-1.5 rounded-full border border-[#E2E8F0]">
              Next-Gen Real Estate &amp; FinTech Infrastructure
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
              Ready to Upgrade Your Lending Infrastructure?
            </h2>
            <p className="text-[#475569] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Experience explainable AI property valuation, automated mortgage underwriting, and instant document extraction today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-8 py-3.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-sm font-semibold transition-all duration-200 shadow-xl shadow-[#3978F6]/30 flex items-center space-x-2"
              >
                <span>Create Institutional Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#E2E8F0] text-[#0F172A] border border-[#E2E8F0] text-sm font-semibold transition-all duration-200"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER (Exact Dark FinTech Style) */}
      <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] py-16 text-xs text-[#475569]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#636B2F] to-[#3D4127] flex items-center justify-center p-0.5 shadow-md">
                <div className="w-full h-full bg-[#FFFFFF] rounded-[6px] flex items-center justify-center">
                  <Home className="w-4 h-4 text-[#636B2F]" />
                </div>
              </div>
              <span className="text-lg font-bold text-[#3D4127] tracking-tight block">
                Gruha <span className="text-[#636B2F]">Anwesh</span>
              </span>
            </div>
            <p className="text-xs text-[#5A613A] max-w-sm leading-relaxed">
              Smarter Property Valuation. Safer Lending Decisions. Enterprise real estate and fintech intelligence ecosystem combining AI valuation, mortgage underwriting, and document verification.
            </p>
            <p className="text-[11px] text-[#5A613A]/70 pt-2">
              &copy; 2026 Gruha Anwesh. All rights reserved.
            </p>
          </div>

          {/* Platform Links */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#0F172A] uppercase text-[11px] tracking-wider block">Platform</span>
            <Link to="/valuation" className="block hover:text-[#0F172A] transition-colors">AI Property Valuation</Link>
            <Link to="/catalog" className="block hover:text-[#0F172A] transition-colors">Property Catalog</Link>
            <Link to="/dashboard/mortgage" className="block hover:text-[#0F172A] transition-colors">Mortgage Underwriting</Link>
            <Link to="/dashboard/risk" className="block hover:text-[#0F172A] transition-colors">Risk Intelligence</Link>
            <Link to="/dashboard/documents" className="block hover:text-[#0F172A] transition-colors">Document OCR</Link>
          </div>

          {/* Governance & Security */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#0F172A] uppercase text-[11px] tracking-wider block">Governance</span>
            <a href="#security" className="block hover:text-[#0F172A] transition-colors">Trust &amp; Security</a>
            <Link to="/dashboard/compliance" className="block hover:text-[#0F172A] transition-colors">Responsible AI Charter</Link>
            <Link to="/dashboard/compliance" className="block hover:text-[#0F172A] transition-colors">Privacy Architecture</Link>
            <Link to="/dashboard/admin/audit-logs" className="block hover:text-[#0F172A] transition-colors">Audit Traceability</Link>
          </div>

          {/* Support & Account */}
          <div className="space-y-2.5">
            <span className="font-bold text-[#0F172A] uppercase text-[11px] tracking-wider block">Support</span>
            <Link to="/login" className="block hover:text-[#0F172A] transition-colors">Client Portal Sign In</Link>
            <Link to="/register" className="block hover:text-[#0F172A] transition-colors">Register Account</Link>
            <Link to="/dashboard/help" className="block hover:text-[#0F172A] transition-colors">Knowledge Base</Link>
            <Link to="/dashboard/settings" className="block hover:text-[#0F172A] transition-colors">BYOK API Setup</Link>
          </div>

        </div>
      </footer>
    </div>
  );
}
