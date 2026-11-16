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
  '/dashboard/ai-chat': 'PropWise Intelligence Assistant',
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
    <header className="h-16 bg-[#080E1B] border-b border-[#23324A] flex items-center justify-between px-6 sticky top-0 z-30">
      
      {/* Title & Breadcrumb */}
      <div>
        <div className="flex items-center space-x-2 text-[11px] text-[#98A7BD]">
          <span>PropWise</span>
          <span>/</span>
          <span className="text-[#3978F6] font-medium">{pageTitle}</span>
        </div>
        <h1 className="text-base font-bold text-[#F5F7FC] tracking-tight leading-none mt-0.5">
          {pageTitle}
        </h1>
      </div>

      {/* Center Global Search */}
      <div className="hidden lg:block w-80">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-[#98A7BD] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search properties, loan IDs, reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111D32] border border-[#23324A] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#F5F7FC] placeholder-[#98A7BD] focus:outline-none focus:border-[#3978F6] transition-colors"
          />
        </form>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center space-x-5">
        
        {/* Date Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#111D32]/70 border border-[#23324A] text-xs text-[#98A7BD]">
          <Calendar className="w-3.5 h-3.5 text-[#29C5E8]" />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-lg bg-[#111D32] border border-[#23324A] text-[#98A7BD] hover:text-[#F5F7FC] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF5B67] text-[9px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111D32] border border-[#23324A] rounded-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#23324A]">
                <span className="text-xs font-bold text-[#F5F7FC]">Notifications ({unreadCount} unread)</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-[#3978F6] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-[#23324A]/50 py-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#98A7BD] text-center py-4">No recent notifications</p>
                ) : (
                  notifications.slice(0, 5).map(n => (
                    <div key={n.id} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#29C5E8]">{n.title}</span>
                        <span className="text-[9px] text-[#98A7BD]">{n.category}</span>
                      </div>
                      <p className="text-[11px] text-[#98A7BD] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 border-t border-[#23324A] text-center">
                <Link
                  to="/dashboard/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-[#3978F6] hover:underline inline-flex items-center space-x-1"
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
            className="flex items-center space-x-3 p-1 rounded-lg hover:bg-[#111D32] transition-colors"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-[#F5F7FC]">{user?.full_name || 'User'}</div>
              <div className="text-[10px] text-[#20C997] font-medium">{user?.account_type || 'Customer'}</div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3978F6] to-[#29C5E8] flex items-center justify-center text-xs font-bold text-white shadow-md">
              {user?.full_name?.charAt(0) || 'U'}
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#111D32] border border-[#23324A] rounded-xl shadow-2xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#23324A]">
                <p className="text-xs font-bold text-[#F5F7FC] truncate">{user?.full_name}</p>
                <p className="text-[10px] text-[#98A7BD] truncate">{user?.email}</p>
              </div>
              <Link
                to="/dashboard/settings"
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-xs text-[#98A7BD] hover:text-[#F5F7FC] hover:bg-[#0D1628]"
              >
                Account Settings
              </Link>
              <Link
                to="/dashboard/settings"
                onClick={() => setUserMenuOpen(false)}
                className="block px-4 py-2 text-xs text-[#98A7BD] hover:text-[#F5F7FC] hover:bg-[#0D1628]"
              >
                API Key Management (BYOK)
              </Link>
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full text-left px-4 py-2 text-xs text-[#EF5B67] hover:bg-[#0D1628] border-t border-[#23324A]"
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
