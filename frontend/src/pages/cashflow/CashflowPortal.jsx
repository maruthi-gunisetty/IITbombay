import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Smartphone, Tablet, Monitor, ExternalLink, ChevronLeft, ChevronRight,
  RotateCw, Layers, Sparkles, Building2, ShieldCheck, CheckCircle2
} from 'lucide-react';

const SCREENS = [
  {
    id: 'retail_kirana_dashboard',
    route: 'dashboard',
    title: 'Kirana Dashboard',
    tag: 'Core Operational Hub',
    desc: 'Live store status, available liquid cash, today sales & khata tabs',
    icon: 'storefront'
  },
  {
    id: 'pos_sale_quick_invoice',
    route: 'pos',
    title: 'Quick POS & Bill',
    tag: 'Billing Terminal',
    desc: '1-Tap Fast Add, barcode scanning, Cash/UPI/Udhar payments',
    icon: 'point_of_sale'
  },
  {
    id: 'customer_udhar_whatsapp_follow_up',
    route: 'udhar',
    title: 'Customer Udhar (Khata)',
    tag: 'Credit Recovery',
    desc: 'Ledger aging (0-15d, >15d), WhatsApp payment reminders & UPI link',
    icon: 'menu_book'
  },
  {
    id: 'cash_flow_forecast_simulator',
    route: 'runway',
    title: 'Runway & Simulator',
    tag: 'AI Forecast',
    desc: '30/60/90-day cashflow runway projections, what-if delay simulators',
    icon: 'trending_up'
  },
  {
    id: 'inventory_supplier_reorder',
    route: 'inventory',
    title: 'Inventory & POs',
    tag: 'Stock Management',
    desc: '482 SKUs live valuation, stockout alerts, draft supplier orders',
    icon: 'inventory_2'
  },
  {
    id: 'inward_stock_grn_verification',
    route: 'grn',
    title: 'Inward Stock GRN',
    tag: 'Dock Verification',
    desc: 'AI OCR paper invoice scanning, PO reconciliation & damage check',
    icon: 'local_shipping'
  },
  {
    id: 'cash_flow_forecast_post_grn',
    route: 'post-grn',
    title: 'Post-GRN Shield',
    tag: 'Capital Protection',
    desc: 'Debit note auto-application, credit lock & zero-outflow today check',
    icon: 'verified_user'
  },
  {
    id: 'ca_audit_gst_monthly_report',
    route: 'audit',
    title: 'CA Audit & GST',
    tag: 'Tax Compliance',
    desc: 'Audit-ready GSTR-1, GSTR-3B tax calculations, ITC breakdown & export',
    icon: 'account_balance'
  },
  {
    id: 'business_selection_light',
    route: 'business-selection',
    title: 'Business Selection',
    tag: 'Workspace Setup',
    desc: 'Select tailored domain: Kirana Retail, Salon & Beauty, or Education',
    icon: 'domain'
  },
  {
    id: 'onboarding_wizard',
    route: 'onboarding',
    title: 'Onboarding Wizard',
    tag: 'Account Baseline',
    desc: '3-Step business profile, GSTIN, bank integration & cash float',
    icon: 'badge'
  }
];

export default function CashflowPortal({ defaultScreen = 'retail_kirana_dashboard' }) {
  const [activeScreenId, setActiveScreenId] = useState(defaultScreen);
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile' | 'tablet' | 'desktop'
  const [iframeKey, setIframeKey] = useState(Date.now());
  const iframeRef = useRef(null);

  const activeIndex = SCREENS.findIndex((s) => s.id === activeScreenId);
  const currentScreen = SCREENS[activeIndex >= 0 ? activeIndex : 0];

  // Listen for navigation messages from inside the iframe
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data && e.data.type === 'NAVIGATE' && e.data.screen) {
        const found = SCREENS.find((s) => s.id === e.data.screen);
        if (found) {
          setActiveScreenId(found.id);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % SCREENS.length;
    setActiveScreenId(SCREENS[nextIdx].id);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + SCREENS.length) % SCREENS.length;
    setActiveScreenId(SCREENS[prevIdx].id);
  };

  const handleReload = () => {
    setIframeKey(Date.now());
  };

  const iframeSrc = `/stitch/${currentScreen.id}/code.html`;

  return (
    <div className="min-h-screen bg-[#F0F3FA] text-[#0F172A] flex flex-col font-sans selection:bg-[#2563EB] selection:text-white">
      {/* TOP COMMAND HEADER */}
      <header className="h-16 bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between shadow-xs sticky top-0 z-40">
        
        {/* Brand & Context */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#004AC6] to-[#2563EB] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-extrabold tracking-tight text-[#0F172A] leading-none">
                CASHFLOW <span className="text-[#2563EB]">AI</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1E40AF] text-[10px] font-bold border border-[#DBEAFE] uppercase tracking-wider">
                Precision Ledger
              </span>
            </div>
            <p className="text-[11px] text-[#475569] font-medium mt-0.5">
              Sharma General Kirana · Smart Cashflow Back Office
            </p>
          </div>
        </div>

        {/* Viewport Frame Mode Controls */}
        <div className="hidden md:flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0] space-x-1">
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              deviceMode === 'mobile'
                ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
            title="Mobile Smartphone Device View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (390px)</span>
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              deviceMode === 'tablet'
                ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
            title="Tablet Countertop POS View"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (768px)</span>
          </button>
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              deviceMode === 'desktop'
                ? 'bg-[#FFFFFF] text-[#2563EB] shadow-xs'
                : 'text-[#475569] hover:text-[#0F172A]'
            }`}
            title="Full Width Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop (100%)</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReload}
            className="p-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] transition-colors"
            title="Reload Screen"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <a
            href={iframeSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-colors"
            title="Open Raw Screen in New Tab"
          >
            <span>Fullscreen</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* HORIZONTAL SCREEN CAROUSEL / SELECTOR BAR */}
      <div className="bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5 overflow-x-auto no-scrollbar flex items-center space-x-2 shadow-xs z-30">
        <div className="flex items-center space-x-1 pr-2 border-r border-[#E2E8F0] shrink-0 text-xs text-[#475569] font-medium">
          <button
            onClick={handlePrev}
            className="p-1 rounded-lg hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] transition-colors"
            title="Previous Screen"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono font-bold text-[#0F172A] px-1">
            {activeIndex + 1}/{SCREENS.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1 rounded-lg hover:bg-[#F1F5F9] text-[#475569] hover:text-[#0F172A] transition-colors"
            title="Next Screen"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Screen Pills */}
        <div className="flex items-center space-x-2">
          {SCREENS.map((s, idx) => {
            const isActive = s.id === activeScreenId;
            return (
              <button
                key={s.id}
                onClick={() => setActiveScreenId(s.id)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 border ${
                  isActive
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                    : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {s.icon}
                </span>
                <span>{idx + 1}. {s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN VIEWPORT / CANVAS CONTAINER */}
      <main className="flex-1 p-2 sm:p-6 flex flex-col items-center justify-center overflow-auto">
        <div
          className={`transition-all duration-300 w-full flex flex-col items-center ${
            deviceMode === 'mobile'
              ? 'max-w-[420px]'
              : deviceMode === 'tablet'
              ? 'max-w-[780px]'
              : 'max-w-7xl'
          }`}
        >
          {/* DEVICE SHELL / BEZEL */}
          <div
            className={`w-full bg-[#FFFFFF] border border-[#CBD5E1] shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
              deviceMode === 'mobile'
                ? 'rounded-[36px] border-[6px] border-[#0F172A] h-[860px]'
                : deviceMode === 'tablet'
                ? 'rounded-[28px] border-[6px] border-[#1E293B] h-[880px]'
                : 'rounded-2xl h-[calc(100vh-140px)]'
            }`}
          >
            {/* Mobile / Tablet Simulated Status Header */}
            {deviceMode !== 'desktop' && (
              <div className="h-6 bg-[#0F172A] text-white px-6 flex items-center justify-between text-[10px] font-mono select-none">
                <span>9:41</span>
                <div className="w-16 h-3 bg-black rounded-full mx-auto" />
                <div className="flex items-center space-x-1">
                  <span>5G</span>
                  <span className="material-symbols-outlined text-[11px]">wifi</span>
                  <span className="material-symbols-outlined text-[11px]">battery_full</span>
                </div>
              </div>
            )}

            {/* EMBEDDED STITCH SCREEN IFRAME */}
            <iframe
              key={iframeKey + activeScreenId}
              ref={iframeRef}
              src={iframeSrc}
              title={currentScreen.title}
              className="w-full flex-1 border-0 bg-[#FAF8FF]"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>

          {/* ACTIVE SCREEN INFO STRIP */}
          <div className="w-full mt-3 px-2 flex items-center justify-between text-xs text-[#475569]">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              <strong className="text-[#0F172A]">{currentScreen.title}</strong>
              <span>—</span>
              <span className="truncate max-w-xs sm:max-w-md">{currentScreen.desc}</span>
            </div>
            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-[11px] text-[#475569]">Google Stitch Design System</span>
              <a
                href="/real-estate"
                className="text-[11px] text-[#2563EB] hover:underline font-semibold"
              >
                Gruha Anwesh Portal →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
