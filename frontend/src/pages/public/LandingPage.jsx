import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calculator, Landmark, ShieldAlert, FileText, AlertTriangle,
  MapPin, TrendingUp, FileCheck2, Bot, ArrowRight, ShieldCheck,
  CheckCircle2, Lock, Cpu, Eye, Users, FileSignature
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calculator,
      title: "AI Property Valuation",
      desc: "Multi-variable regression models with price-per-square-foot benchmarking, confidence intervals, and explainable feature contributions.",
      link: "/register"
    },
    {
      icon: Landmark,
      title: "Mortgage Underwriting",
      desc: "Automated debt-to-income and loan-to-value calculations with amortization schedules and human reviewer decision workflows.",
      link: "/register"
    },
    {
      icon: ShieldAlert,
      title: "Unified Risk Intelligence",
      desc: "Decoupled evaluation of collateral asset risk and borrower repayment capacity, aggregated through documented institutional policies.",
      link: "/register"
    },
    {
      icon: FileText,
      title: "Document Intelligence",
      desc: "Optical character recognition (OCR) and automated extraction for title deeds, income proofs, tax records, and bank statements.",
      link: "/register"
    },
    {
      icon: AlertTriangle,
      title: "Fraud & Anomaly Detection",
      desc: "Real-time scans for valuation inflation spikes, geometric plot discrepancies, duplicate asset listings, and excessive leverage.",
      link: "/register"
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      desc: "Geospatial mapping and proximity analysis measuring transit connectivity, educational infrastructure, and locality density.",
      link: "/register"
    },
    {
      icon: TrendingUp,
      title: "Market Analytics",
      desc: "Longitudinal price velocity metrics, quarterly locality comparisons, and housing sector demand indices across primary clusters.",
      link: "/register"
    },
    {
      icon: FileCheck2,
      title: "Automated Reporting",
      desc: "Institution-grade downloadable PDF dossiers with cryptographic reference numbers, assessment breakdowns, and policy disclosures.",
      link: "/register"
    },
    {
      icon: Bot,
      title: "PropWise AI Assistant",
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
    <div className="min-h-screen bg-[#080E1B] text-[#F5F7FC] selection:bg-[#3978F6] selection:text-white">
      {/* Public Sticky Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Subtle Background Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#3978F6]/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-[#29C5E8]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#111D32] border border-[#23324A] text-xs text-[#29C5E8] mb-8 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#20C997]" />
            <span>Enterprise Property Valuation & Mortgage Underwriting Intelligence</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F5F7FC] max-w-4xl mx-auto leading-tight sm:leading-none">
            Transform Property Data Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3978F6] via-[#29C5E8] to-[#20C997]">Smarter Lending Decisions</span>
          </h1>

          {/* Subtitle Description */}
          <p className="mt-6 text-lg sm:text-xl text-[#98A7BD] max-w-3xl mx-auto leading-relaxed">
            An intelligent real estate and fintech platform combining AI-powered property valuation, mortgage underwriting, risk intelligence, and document verification.
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-base font-semibold transition-all duration-200 shadow-xl shadow-[#3978F6]/25 flex items-center justify-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#platform"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#111D32] hover:bg-[#111D32]/80 text-[#F5F7FC] border border-[#23324A] text-base font-semibold transition-all duration-200"
            >
              Explore Platform
            </a>
          </div>

          {/* Enterprise Preview Dashboard Card */}
          <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl bg-[#0D1628] border border-[#23324A] p-4 sm:p-6 shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between pb-4 border-b border-[#23324A] text-xs text-[#98A7BD]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#EF5B67]/80"></span>
                <span className="w-3 h-3 rounded-full bg-[#F5B942]/80"></span>
                <span className="w-3 h-3 rounded-full bg-[#20C997]/80"></span>
                <span className="ml-2 font-mono text-[11px] text-[#F5F7FC]">propwise.ai/dashboard/intelligence</span>
              </div>
              <span className="hidden sm:inline text-[#20C997] font-semibold">Institutional Grade Decision Engine</span>
            </div>

            {/* Dashboard Visual Mock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-left">
              
              {/* Asset Card Preview */}
              <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4 space-y-3">
                <div className="h-32 rounded-lg bg-cover bg-center overflow-hidden relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80')" }}>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#080E1B]/80 text-[10px] text-[#29C5E8] font-bold">
                    Penthouse 4 BHK
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F5F7FC]">Highline Horizon Penthouse</h4>
                  <p className="text-xs text-[#98A7BD]">Powai, Mumbai Suburban</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#23324A]">
                  <div>
                    <span className="text-[10px] text-[#98A7BD] uppercase block">Valuation</span>
                    <span className="text-sm font-bold text-[#20C997]">INR 7.45 Cr</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#98A7BD] uppercase block">Confidence</span>
                    <span className="text-xs font-semibold text-[#29C5E8]">94.2% ML Bound</span>
                  </div>
                </div>
              </div>

              {/* Financial Metrics Preview */}
              <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F5F7FC]">Underwriting Assessment</span>
                    <span className="px-2 py-0.5 rounded bg-[#20C997]/15 text-[#20C997] text-[10px] font-bold">Prime File</span>
                  </div>
                  <p className="text-[11px] text-[#98A7BD] mt-1">Application LN-2026-89410A</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#98A7BD]">Debt-to-Income (DTI)</span>
                    <span className="font-semibold text-[#F5F7FC]">44.1%</span>
                  </div>
                  <div className="w-full bg-[#080E1B] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#20C997] h-full w-[44.1%]"></div>
                  </div>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-[#98A7BD]">Loan-to-Value (LTV)</span>
                    <span className="font-semibold text-[#F5F7FC]">64.4%</span>
                  </div>
                  <div className="w-full bg-[#080E1B] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#3978F6] h-full w-[64.4%]"></div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#080E1B] border border-[#23324A] text-[11px] text-[#98A7BD]">
                  Monthly Debt Service: <strong className="text-[#F5F7FC]">INR 4,13,550</strong> (20 Year Amortization)
                </div>
              </div>

              {/* Unified Risk Score Preview */}
              <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F5F7FC]">Unified Risk Matrix</span>
                    <span className="text-[10px] text-[#29C5E8] font-mono">v3.1 Policy</span>
                  </div>
                  <p className="text-[11px] text-[#98A7BD] mt-1">Decoupled Vectors Aggregation</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-[#080E1B] border border-[#23324A]">
                    <span className="text-[10px] text-[#98A7BD] block">Collateral Risk</span>
                    <span className="text-base font-bold text-[#20C997]">22.5 / 100</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#080E1B] border border-[#23324A]">
                    <span className="text-[10px] text-[#98A7BD] block">Borrower Risk</span>
                    <span className="text-base font-bold text-[#20C997]">24.0 / 100</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#20C997]/10 border border-[#20C997]/30 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#20C997]">Overall Category: Low Risk</span>
                  <CheckCircle2 className="w-4 h-4 text-[#20C997]" />
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Platform Features Grid */}
      <section id="features" className="py-24 bg-[#0D1628]/60 border-t border-[#23324A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider text-[#3978F6] uppercase">Integrated Intelligence Suite</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FC] mt-2">
              Comprehensive Real Estate & Lending Modules
            </h2>
            <p className="text-[#98A7BD] mt-4 text-base">
              Every critical dimension of real estate appraisal and mortgage risk assessment unified into one interconnected enterprise environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#111D32] border border-[#23324A] rounded-xl p-6 hover:border-[#3978F6]/50 transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#0D1628] border border-[#23324A] flex items-center justify-center text-[#29C5E8] mb-5 group-hover:text-white group-hover:bg-[#3978F6] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#F5F7FC] group-hover:text-[#29C5E8] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#98A7BD] mt-2.5 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#23324A]/60">
                    <Link
                      to={feat.link}
                      className="text-xs font-semibold text-[#3978F6] hover:text-[#29C5E8] flex items-center space-x-1.5 transition-colors"
                    >
                      <span>Explore Capability</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Visual Workflow Section (How It Works) */}
      <section id="workflow" className="py-24 border-t border-[#23324A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider text-[#29C5E8] uppercase">End-to-End Pipeline</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FC] mt-2">
              Structured Decision Pipeline
            </h2>
            <p className="text-[#98A7BD] mt-4 text-base">
              From collateral property ingestion to affirmative human officer sign-off, every step follows documented institutional financial rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.slice(0, 4).map((ws, i) => (
              <div key={i} className="bg-[#111D32] border border-[#23324A] rounded-xl p-5 relative">
                <span className="text-3xl font-extrabold text-[#3978F6]/30 block mb-2">{ws.step}</span>
                <h4 className="text-sm font-bold text-[#F5F7FC]">{ws.title}</h4>
                <p className="text-xs text-[#98A7BD] mt-2 leading-relaxed">{ws.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {workflowSteps.slice(4).map((ws, i) => (
              <div key={i} className="bg-[#111D32] border border-[#23324A] rounded-xl p-5 relative">
                <span className="text-3xl font-extrabold text-[#29C5E8]/30 block mb-2">{ws.step}</span>
                <h4 className="text-sm font-bold text-[#F5F7FC]">{ws.title}</h4>
                <p className="text-xs text-[#98A7BD] mt-2 leading-relaxed">{ws.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Trust & Security Section */}
      <section id="security" className="py-24 bg-[#0D1628]/60 border-t border-[#23324A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider text-[#20C997] uppercase">Enterprise Security & Governance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7FC] mt-2">
              Security Built for Regulated Institutions
            </h2>
            <p className="text-[#98A7BD] mt-4 text-base">
              Engineered with authenticated encryption, non-delegable human authority, and transparent model explainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityPillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <div key={i} className="bg-[#111D32] border border-[#23324A] rounded-xl p-6 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#080E1B] border border-[#23324A] flex items-center justify-center text-[#20C997]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#F5F7FC]">{pillar.title}</h3>
                  <p className="text-xs text-[#98A7BD] leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080E1B] border-t border-[#23324A] py-16 text-xs text-[#98A7BD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 space-y-3">
            <span className="text-lg font-bold text-[#F5F7FC] tracking-tight block">
              PROPWISE <span className="text-[#3978F6]">AI</span>
            </span>
            <p className="text-xs text-[#98A7BD] max-w-sm leading-relaxed">
              Smarter Property Valuation. Safer Lending Decisions. Enterprise real estate and fintech intelligence ecosystem.
            </p>
            <p className="text-[11px] text-[#98A7BD]/70">
              Copyright 2026 PROPWISE AI. All rights reserved.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#F5F7FC] uppercase text-[11px] block">Platform</span>
            <Link to="/register" className="block hover:text-white">AI Valuation</Link>
            <Link to="/register" className="block hover:text-white">Mortgage Underwriting</Link>
            <Link to="/register" className="block hover:text-white">Risk Intelligence</Link>
            <Link to="/register" className="block hover:text-white">Document OCR</Link>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#F5F7FC] uppercase text-[11px] block">Governance</span>
            <a href="#security" className="block hover:text-white">Trust & Security</a>
            <Link to="/dashboard/compliance" className="block hover:text-white">Responsible AI Charter</Link>
            <Link to="/dashboard/compliance" className="block hover:text-white">Privacy Architecture</Link>
            <Link to="/dashboard/compliance" className="block hover:text-white">Terms of Processing</Link>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-[#F5F7FC] uppercase text-[11px] block">Support</span>
            <Link to="/login" className="block hover:text-white">Client Portal Sign In</Link>
            <Link to="/dashboard/help" className="block hover:text-white">Knowledge Base</Link>
            <Link to="/dashboard/settings" className="block hover:text-white">BYOK API Setup</Link>
            <a href="mailto:support@propwise.ai" className="block hover:text-white">Contact Institutional Desk</a>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
