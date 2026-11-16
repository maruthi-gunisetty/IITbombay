import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Check, Clock, Filter, AlertCircle } from 'lucide-react';
import { notificationsAPI } from '../../services/api';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await notificationsAPI.list();
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#F5F7FC] tracking-tight">Notification Center</h2>
          <p className="text-xs text-[#98A7BD]">
            System events, valuation completions, underwriting status transitions, and risk alerts.
          </p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl bg-[#111D32] hover:bg-[#0D1628] border border-[#23324A] text-xs font-semibold text-[#29C5E8] flex items-center space-x-1.5 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-[#23324A] pb-3 text-xs">
        {['all', 'unread', 'read'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-lg capitalize font-semibold transition-colors ${
              filter === f
                ? 'bg-[#3978F6] text-white'
                : 'bg-[#111D32] text-[#98A7BD] hover:text-[#F5F7FC]'
            }`}
          >
            {f} Notifications
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-[#111D32] border border-[#23324A] rounded-2xl divide-y divide-[#23324A] overflow-hidden shadow-xl">
        {loading ? (
          <div className="text-center py-12 text-xs text-[#98A7BD]">Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#98A7BD]">No notifications in this view.</div>
        ) : (
          filtered.map(n => (
            <div
              key={n.id}
              className={`p-4 flex items-start justify-between transition-colors ${
                !n.is_read ? 'bg-[#0D1628]/80' : 'hover:bg-[#080E1B]/40'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#080E1B] border border-[#23324A] flex items-center justify-center text-[#29C5E8] mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-[#F5F7FC]">{n.title}</h4>
                    <span className="px-2 py-0.2 rounded bg-[#3978F6]/20 text-[#3978F6] text-[10px] font-bold">
                      {n.category}
                    </span>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-[#EF5B67]"></span>
                    )}
                  </div>
                  <p className="text-xs text-[#98A7BD] mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-[#98A7BD]/60 block mt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="p-1.5 rounded-lg text-[#98A7BD] hover:text-[#20C997] hover:bg-[#080E1B] transition-colors"
                  title="Mark as read"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default NotificationCenter;
