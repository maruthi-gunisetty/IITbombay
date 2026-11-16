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

  const navSectionClass = "text-[11px] font-semibold text-[#98A7BD]/70 uppercase tracking-wider px-3 mb-2 mt-6";

  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
      isActive
        ? 'bg-[#111D32] text-[#29C5E8] border border-[#3978F6]/40 shadow-sm shadow-[#3978F6]/10'
        : 'text-[#98A7BD] hover:text-[#F5F7FC] hover:bg-[#111D32]/60'
    } ${collapsed ? 'justify-center px-0' : ''}`;

  return (
    <aside
      className={`h-screen sticky top-0 bg-[#0A1222] border-r border-[#23324A] flex flex-col transition-all duration-300 z-40 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#23324A]">
        <div className={`flex items-center space-x-3 ${collapsed ? 'hidden' : 'flex'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2457C5] to-[#29C5E8] flex items-center justify-center p-0.5 shadow-md">
            <div className="w-full h-full bg-[#0A1222] rounded-[6px] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#29C5E8]" />
            </div>
          </div>
          <div>
            <span className="text-base font-bold text-[#F5F7FC] tracking-tight block leading-none">
              PROPWISE <span className="text-[#3978F6]">AI</span>
            </span>
            <span className="text-[9px] text-[#98A7BD] uppercase tracking-wider block font-medium mt-0.5">
              Enterprise Suite
            </span>
          </div>
        </div>

        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-[#3978F6] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-[#98A7BD] hover:text-white hover:bg-[#111D32] transition-colors ${
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
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-[#29C5E8]" />
          {!collapsed && <span>Risk Intelligence</span>}
        </NavLink>
        <NavLink to="/dashboard/documents" className={linkClass} title="Document Intelligence">
          <FileText className="w-4 h-4 flex-shrink-0 text-[#29C5E8]" />
          {!collapsed && <span>Document Intelligence</span>}
        </NavLink>
        <NavLink to="/dashboard/fraud" className={linkClass} title="Fraud Detection">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-[#F5B942]" />
          {!collapsed && <span>Fraud & Anomalies</span>}
        </NavLink>
        <NavLink to="/dashboard/location" className={linkClass} title="Location Intelligence">
          <MapPin className="w-4 h-4 flex-shrink-0 text-[#20C997]" />
          {!collapsed && <span>Location Intelligence</span>}
        </NavLink>
        <NavLink to="/dashboard/market" className={linkClass} title="Market Analytics">
          <TrendingUp className="w-4 h-4 flex-shrink-0 text-[#3978F6]" />
          {!collapsed && <span>Market Analytics</span>}
        </NavLink>

        {/* MANAGEMENT */}
        <div className={collapsed ? 'hidden' : navSectionClass}>Management</div>
        <NavLink to="/dashboard/reports" className={linkClass} title="Reports & Insights">
          <FileCheck2 className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Reports & Dossiers</span>}
        </NavLink>
        <NavLink to="/dashboard/notifications" className={linkClass} title="Notifications">
          <Bell className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Notifications</span>}
        </NavLink>
        <NavLink to="/dashboard/ai-chat" className={linkClass} title="PropWise Assistant">
          <Bot className="w-4 h-4 flex-shrink-0 text-[#29C5E8]" />
          {!collapsed && <span>PropWise Assistant</span>}
        </NavLink>

        {/* ADMINISTRATION (Admin & Bank Officers) */}
        {(isAdmin || isBankOfficer) && (
          <>
            <div className={collapsed ? 'hidden' : navSectionClass}>Administration</div>
            <NavLink to="/dashboard/admin/users" className={linkClass} title="User Management">
              <Users className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>User Directory</span>}
            </NavLink>
            <NavLink to="/dashboard/admin/audit-logs" className={linkClass} title="Audit Logs">
              <History className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Audit Traceability</span>}
            </NavLink>
            <NavLink to="/dashboard/compliance" className={linkClass} title="Compliance & Governance">
              <Scale className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Responsible AI Charter</span>}
            </NavLink>
          </>
        )}

        {/* ACCOUNT */}
        <div className={collapsed ? 'hidden' : navSectionClass}>Portal &amp; Account</div>
        <NavLink to="/" className={linkClass} title="Haven & Key Public Portal">
          <Building2 className="w-4 h-4 flex-shrink-0 text-[#29C5E8]" />
          {!collapsed && <span className="text-[#29C5E8]">Public Estate Portal</span>}
        </NavLink>
        <NavLink to="/dashboard/settings" className={linkClass} title="Settings & BYOK">
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Settings & BYOK</span>}
        </NavLink>
        <NavLink to="/dashboard/help" className={linkClass} title="Help Center">
          <HelpCircle className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Help Center</span>}
        </NavLink>
      </div>

      {/* Sidebar Footer with User Card & Logout */}
      <div className="p-3 border-t border-[#23324A] bg-[#080E1B]/50">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#111D32] border border-[#3978F6]/40 flex items-center justify-center text-xs font-bold text-[#29C5E8]">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#F5F7FC] truncate">{user?.full_name || 'User'}</p>
                <span className="text-[10px] text-[#20C997] font-medium block truncate">
                  {user?.account_type || 'Customer'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-[#98A7BD] hover:text-[#EF5B67] hover:bg-[#111D32] rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex justify-center p-2 text-[#98A7BD] hover:text-[#F5F7FC]"
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
