import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Calculator, Landmark, ShieldAlert,
  FileText, AlertTriangle, MapPin, TrendingUp, FileCheck2,
  Bell, Bot, Users, History, Scale, Settings, HelpCircle,
  LogOut, ChevronLeft, ChevronRight, BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAdmin, isBankOfficer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navSectionClass = "text-[11px] font-semibold text-[#636B2F]/90 uppercase tracking-wider px-3 mb-2 mt-6";

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
      isActive
        ? 'bg-[#D4DE95]/40 text-[#3D4127] font-bold border border-[#BAC095] shadow-sm'
        : 'text-[#636B2F] hover:text-[#3D4127] hover:bg-[#BAC095]/15'
    } ${collapsed ? 'justify-center px-0' : ''}`;

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#FFFFFF] border-r border-[#E2E6D5] flex flex-col transition-all duration-300 z-40 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E6D5]">
        <div className={`flex items-center space-x-3 ${collapsed ? 'hidden' : 'flex'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#636B2F] to-[#3D4127] flex items-center justify-center p-0.5 shadow-md">
            <div className="w-full h-full bg-[#FFFFFF] rounded-[6px] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#636B2F]" />
            </div>
          </div>
          <div>
            <span className="text-base font-bold text-[#3D4127] tracking-tight block leading-none">
              PROPWISE <span className="text-[#636B2F]">AI</span>
            </span>
            <span className="text-[9px] text-[#636B2F] uppercase tracking-wider block font-medium mt-0.5">
              Enterprise Suite
            </span>
          </div>
        </div>

        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#636B2F] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-[#636B2F] hover:text-[#3D4127] hover:bg-[#BAC095]/20 transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        
        {/* MAIN */}
        <div className={collapsed ? 'hidden' : navSectionClass}>Main</div>
        <NavLink to="/dashboard" end className={linkClass} title="Overview">
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Overview</span>}
        </NavLink>
        <NavLink to="/dashboard/properties" className={linkClass} title="Properties">
          <Building2 className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Properties</span>}
        </NavLink>
        <NavLink to="/dashboard/valuation" className={linkClass} title="Property Valuation">
          <Calculator className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Property Valuation</span>}
        </NavLink>
        <NavLink to="/dashboard/mortgage" className={linkClass} title="Mortgage Applications">
          <Landmark className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Mortgage Underwriting</span>}
        </NavLink>

        {/* INTELLIGENCE */}
        <div className={collapsed ? 'hidden' : navSectionClass}>Intelligence</div>
        <NavLink to="/dashboard/risk" className={linkClass} title="Risk Intelligence">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>Risk Intelligence</span>}
        </NavLink>
        <NavLink to="/dashboard/documents" className={linkClass} title="Document Intelligence">
          <FileText className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>Document Intelligence</span>}
        </NavLink>
        <NavLink to="/dashboard/fraud" className={linkClass} title="Fraud Detection">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>Fraud & Anomalies</span>}
        </NavLink>
        <NavLink to="/dashboard/location" className={linkClass} title="Location Intelligence">
          <MapPin className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>Location Intelligence</span>}
        </NavLink>
        <NavLink to="/dashboard/market" className={linkClass} title="Market Analytics">
          <TrendingUp className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>Market Analytics</span>}
        </NavLink>

        {/* MANAGEMENT */}
        <div className={collapsed ? 'hidden' : navSectionClass}>Management</div>
        <NavLink to="/dashboard/reports" className={linkClass} title="Reports & Insights">
          <FileCheck2 className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>Reports & Dossiers</span>}
        </NavLink>
        <NavLink to="/dashboard/notifications" className={linkClass} title="Notifications">
          <Bell className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>Notifications</span>}
        </NavLink>
        <NavLink to="/dashboard/ai-chat" className={linkClass} title="PropWise Assistant">
          <Bot className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>PropWise Assistant</span>}
        </NavLink>

        {/* ADMINISTRATION (Admin & Bank Officers) */}
        {(isAdmin || isBankOfficer) && (
          <>
            <div className={collapsed ? 'hidden' : navSectionClass}>Administration</div>
            <NavLink to="/dashboard/admin/users" className={linkClass} title="User Management">
              <Users className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
              {!collapsed && <span>User Directory</span>}
            </NavLink>
            <NavLink to="/dashboard/admin/audit-logs" className={linkClass} title="Audit Logs">
              <History className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
              {!collapsed && <span>Audit Traceability</span>}
            </NavLink>
            <NavLink to="/dashboard/compliance" className={linkClass} title="Compliance & Governance">
              <Scale className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
              {!collapsed && <span>Responsible AI Charter</span>}
            </NavLink>
          </>
        )}

        {/* ACCOUNT */}
        <div className={collapsed ? 'hidden' : navSectionClass}>Portal &amp; Account</div>
        <NavLink to="/" className={linkClass} title="Haven & Key Public Portal">
          <Building2 className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span className="text-[#636B2F]">Public Estate Portal</span>}
        </NavLink>
        <NavLink to="/dashboard/settings" className={linkClass} title="Settings & BYOK">
          <Settings className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>Settings & BYOK</span>}
        </NavLink>
        <NavLink to="/dashboard/help" className={linkClass} title="Help Center">
          <HelpCircle className="w-4 h-4 flex-shrink-0 text-[#636B2F]" />
          {!collapsed && <span>Help Center</span>}
        </NavLink>
      </div>

      {/* Sidebar Footer with User Card & Logout */}
      <div className="p-3 border-t border-[#E2E6D5] bg-[#FAFBF7]">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#D4DE95]/40 border border-[#BAC095] flex items-center justify-center text-xs font-bold text-[#3D4127]">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#3D4127] truncate">{user?.full_name || 'User'}</p>
                <span className="text-[10px] text-[#636B2F] font-medium block truncate">
                  {user?.account_type || 'Customer'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#636B2F] hover:text-[#DC2626] hover:bg-rose-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex justify-center p-2 text-[#636B2F] hover:text-[#3D4127]"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
