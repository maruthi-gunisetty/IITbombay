import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, Bell, Calendar, UserCheck, CheckCircle2, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/api';

const routeTitleMap = {
  '/dashboard': 'Executive Overview',
  '/dashboard/properties': 'Property Portfolio Management',
  '/dashboard/valuation': 'AI Property Valuation Studio',
  '/dashboard/mortgage': 'Mortgage Underwriting Engine',
  '/dashboard/risk': 'Unified Risk Intelligence',
  '/dashboard/documents': 'Document Intelligence & OCR',
  '/dashboard/fraud': 'Fraud & Anomaly Detection',
  '/dashboard/location': 'Geospatial Location Intelligence',
  '/dashboard/market': 'Market Analytics & Price Velocity',
  '/dashboard/reports': 'Institutional Reports & Dossiers',
  '/dashboard/notifications': 'Notification Center',
  '/dashboard/ai-chat': 'Gruha Anwesh Intelligence Assistant',
  '/dashboard/admin/users': 'Enterprise User Directory',
  '/dashboard/admin/audit-logs': 'Immutable Audit Traceability',
  '/dashboard/compliance': 'Responsible AI Governance & Compliance',
  '/dashboard/settings': 'Settings & BYOK API Configuration',
  '/dashboard/help': 'Platform Help Center & Knowledge Base',
};

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentPath = location.pathname;
  const pageTitle = routeTitleMap[currentPath] || 'Platform Dashboard';

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationsAPI.list();
        setNotifications(res.data || []);
      } catch (e) {
        // quiet fallback
      }
    };
    fetchNotifs();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E2E6D5] flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* Title & Breadcrumb */}
      <div>
        <div className="flex items-center space-x-2 text-[11px] text-[#636B2F]">
          <span>Gruha Anwesh</span>
          <span>/</span>
          <span className="text-[#3D4127] font-semibold">{pageTitle}</span>
        </div>
        <h1 className="text-base font-bold text-[#3D4127] tracking-tight leading-none mt-0.5">
          {pageTitle}
        </h1>
      </div>

      {/* Center Global Search */}
      <div className="hidden lg:block w-80">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#636B2F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search properties, loan IDs, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FAFBF7] border border-[#E2E6D5] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#3D4127] placeholder-[#636B2F]/60 focus:outline-none focus:border-[#636B2F] transition-colors"
          />
        </form>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center space-x-5">
        
        {/* Date Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#FAFBF7] border border-[#E2E6D5] text-xs text-[#3D4127]">
          <Calendar className="w-3.5 h-3.5 text-[#636B2F]" />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg bg-[#FAFBF7] border border-[#E2E6D5] text-[#636B2F] hover:text-[#3D4127] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#FFFFFF] border border-[#E2E6D5] rounded-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E6D5]">
                <span className="text-xs font-bold text-[#3D4127]">Notifications ({unreadCount} unread)</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#636B2F] font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#E2E6D5]/60 py-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#636B2F] text-center py-4">No recent notifications</p>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div key={n.id} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#636B2F]">{n.title}</span>
                        <span className="text-[9px] text-[#3D4127]/60">{n.category}</span>
                      </div>
                      <p className="text-[11px] text-[#3D4127] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-[#E2E6D5] text-center">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-[#636B2F] font-semibold hover:underline inline-flex items-center space-x-1"
                >
                  <span>View All In Notification Center</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Role & Profile Indicator */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-3 p-1 rounded-lg hover:bg-[#FAFBF7] transition-colors"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-[#3D4127]">{user?.full_name || 'User'}</div>
              <div className="text-[10px] text-[#636B2F] font-medium">{user?.account_type || 'Customer'}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#636B2F] to-[#3D4127] flex items-center justify-center text-xs font-bold text-white shadow-md">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#E2E6D5] rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#E2E6D5]">
                <p className="text-xs font-bold text-[#3D4127] truncate">{user?.full_name}</p>
                <p className="text-[10px] text-[#636B2F] truncate">{user?.email}</p>
              </div>
              <Link
                to="/dashboard/settings"
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-xs text-[#3D4127] hover:bg-[#FAFBF7]"
              >
                Account Settings
              </Link>
              <Link
                to="/dashboard/settings"
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-xs text-[#3D4127] hover:bg-[#FAFBF7]"
              >
                API Key Management (BYOK)
              </Link>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#DC2626] hover:bg-rose-50 border-t border-[#E2E6D5]"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default TopBar;
