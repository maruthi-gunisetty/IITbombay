import React, { useState, useEffect } from 'react';
import {
  Users, History, Shield, Activity, Search, CheckCircle2,
  AlertCircle, Lock, ShieldCheck, ChevronRight
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ovRes, usersRes, logsRes] = await Promise.all([
        adminAPI.getOverview(),
        adminAPI.listUsers(),
        adminAPI.listAuditLogs()
      ]);
      setOverview(ovRes.data);
      setUsers(usersRes.data || []);
      setAuditLogs(logsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateRole(userId, newRole);
      fetchData();
    } catch (err) {
      alert("Role update failed: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleToggleActive = async (userId, currentActive) => {
    try {
      await adminAPI.toggleStatus(userId, !currentActive);
      fetchData();
    } catch (err) {
      alert("Status toggle failed: " + (err.response?.data?.detail || err.message));
    }
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Enterprise Administration & Governance</h2>
        <p className="text-xs text-[#475569]">
          User directory management, role-based access governance, and immutable institutional audit traceability.
        </p>
      </div>

      {/* System Status Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
          <span className="text-xs text-[#475569] block">Registered Users</span>
          <div className="text-2xl font-black text-[#0F172A] mt-1">{overview?.total_users || 0}</div>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
          <span className="text-xs text-[#475569] block">Active User Accounts</span>
          <div className="text-2xl font-black text-[#059669] mt-1">{overview?.active_users || 0}</div>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
          <span className="text-xs text-[#475569] block">Audit Event Count</span>
          <div className="text-2xl font-black text-[#3978F6] mt-1">{auditLogs.length}</div>
        </div>
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl p-4">
          <span className="text-xs text-[#475569] block">System Health</span>
          <div className="text-sm font-bold text-[#059669] mt-2 flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
            <span>{overview?.system_status || 'Operational'}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#E2E8F0] pb-3 text-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors ${
            activeTab === 'users'
              ? 'bg-[#3978F6] text-white shadow-md'
              : 'bg-[#FFFFFF] text-[#475569] hover:text-[#0F172A]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>User Directory Governance</span>
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors ${
            activeTab === 'audit'
              ? 'bg-[#3978F6] text-white shadow-md'
              : 'bg-[#FFFFFF] text-[#475569] hover:text-[#0F172A]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Audit Traceability Logs</span>
        </button>
      </div>

      {/* USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xl space-y-4 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Assigned User Accounts ({users.length})
            </h3>
            <div className="w-64 relative">
              <Search className="w-3.5 h-3.5 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#0F172A] placeholder-[#475569] focus:outline-none focus:border-[#3978F6]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F5F9] text-[#475569] border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">User</th>
                  <th className="py-2.5 px-3 font-semibold">Account Role</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Registered</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Role Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-[#F1F5F9]/60 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#0F172A] block">{u.full_name}</span>
                      <span className="text-[10px] text-[#475569]">{u.email}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3978F6]/15 text-[#3978F6] border border-[#3978F6]/30">
                        {u.account_type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleActive(u.id, u.is_active)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          u.is_active
                            ? 'bg-[#059669]/15 text-[#059669] border-[#059669]/40'
                            : 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/40'
                        }`}
                      >
                        {u.is_active ? 'Active' : 'Deactivated'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={u.account_type}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#0F172A]"
                      >
                        <option value="Customer">Customer</option>
                        <option value="Bank Officer">Bank Officer</option>
                        <option value="Property Analyst">Property Analyst</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Immutable System Audit Logs ({auditLogs.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F1F5F9] text-[#475569] border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold">User Principal</th>
                  <th className="py-2.5 px-3 font-semibold">Action Trigger</th>
                  <th className="py-2.5 px-3 font-semibold">Resource</th>
                  <th className="py-2.5 px-3 font-semibold">Audit Details</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Host IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#F1F5F9]/60 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#475569]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#0F172A]">{log.user_email}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0284C7]">{log.action}</td>
                    <td className="py-2.5 px-3 text-[#475569]">{log.resource_type} #{log.resource_id || ''}</td>
                    <td className="py-2.5 px-3 text-[#0F172A] max-w-xs truncate">{log.details || ''}</td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-[#475569] text-right">{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
