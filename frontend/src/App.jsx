import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Public & Auth Pages
import LandingPage from './pages/public/LandingPage';
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
      <div className="min-h-screen bg-[#080E1B] flex items-center justify-center text-xs text-[#98A7BD]">
        Initializing PropWise secure session...
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
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
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
