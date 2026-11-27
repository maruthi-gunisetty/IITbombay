import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Cashflow AI & Precision Ledger Suite
import CashflowPortal from './pages/cashflow/CashflowPortal';

// Public & Auth Pages
import LandingPage from './pages/public/LandingPage';
import PropertyCatalogPage from './pages/properties/PropertyCatalogPage';
import PropertyDetailPage from './pages/properties/PropertyDetailPage';
import AdvisorValuationPage from './pages/valuation/AdvisorValuationPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Authenticated Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import PropertyList from './pages/properties/PropertyList';
import ValuationStudio from './pages/valuation/ValuationStudio';
import MortgageWorkspace from './pages/mortgage/MortgageWorkspace';
import UnifiedRiskCenter from './pages/risk/UnifiedRiskCenter';
import DocumentStudio from './pages/documents/DocumentStudio';
import FraudDetectionWorkspace from './pages/fraud/FraudDetectionWorkspace';
import LocationIntelligence from './pages/location/LocationIntelligence';
import MarketAnalytics from './pages/market/MarketAnalytics';
import ReportsWorkspace from './pages/reports/ReportsWorkspace';
import NotificationCenter from './pages/notifications/NotificationCenter';
import AIChatPage from './pages/dashboard/AIChatPage';
import AdminPanel from './pages/admin/AdminPanel';
import ComplianceCenter from './pages/compliance/ComplianceCenter';
import SettingsPage from './pages/settings/SettingsPage';
import HelpCenter from './pages/help/HelpCenter';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBF7] flex items-center justify-center text-xs text-[#636B2F]">
        Initializing Gruha Anwesh secure session...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Cashflow AI & Precision Ledger Portal (Stitch UI Suite) */}
      <Route path="/" element={<CashflowPortal defaultScreen="retail_kirana_dashboard" />} />
      <Route path="/cashflow" element={<CashflowPortal defaultScreen="retail_kirana_dashboard" />} />
      <Route path="/kirana" element={<CashflowPortal defaultScreen="retail_kirana_dashboard" />} />
      <Route path="/pos" element={<CashflowPortal defaultScreen="pos_sale_quick_invoice" />} />
      <Route path="/udhar" element={<CashflowPortal defaultScreen="customer_udhar_whatsapp_follow_up" />} />
      <Route path="/runway" element={<CashflowPortal defaultScreen="cash_flow_forecast_simulator" />} />
      <Route path="/inventory" element={<CashflowPortal defaultScreen="inventory_supplier_reorder" />} />
      <Route path="/grn" element={<CashflowPortal defaultScreen="inward_stock_grn_verification" />} />
      <Route path="/post-grn" element={<CashflowPortal defaultScreen="cash_flow_forecast_post_grn" />} />
      <Route path="/audit" element={<CashflowPortal defaultScreen="ca_audit_gst_monthly_report" />} />
      <Route path="/business-selection" element={<CashflowPortal defaultScreen="business_selection_light" />} />
      <Route path="/onboarding" element={<CashflowPortal defaultScreen="onboarding_wizard" />} />

      {/* Gruha Anwesh Real Estate Portal */}
      <Route path="/real-estate" element={<LandingPage />} />
      <Route path="/catalog" element={<PropertyCatalogPage />} />
      <Route path="/properties" element={<PropertyCatalogPage />} />
      <Route path="/property/:id" element={<PropertyDetailPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />
      <Route path="/valuation" element={<AdvisorValuationPage />} />
      <Route path="/advisor" element={<AdvisorValuationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Authenticated Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="properties" element={<PropertyList />} />
        <Route path="valuation" element={<ValuationStudio />} />
        <Route path="mortgage" element={<MortgageWorkspace />} />
        <Route path="risk" element={<UnifiedRiskCenter />} />
        <Route path="documents" element={<DocumentStudio />} />
        <Route path="fraud" element={<FraudDetectionWorkspace />} />
        <Route path="location" element={<LocationIntelligence />} />
        <Route path="market" element={<MarketAnalytics />} />
        <Route path="reports" element={<ReportsWorkspace />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="ai-chat" element={<AIChatPage />} />
        <Route path="admin/users" element={<AdminPanel />} />
        <Route path="admin/audit-logs" element={<AdminPanel />} />
        <Route path="compliance" element={<ComplianceCenter />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpCenter />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
