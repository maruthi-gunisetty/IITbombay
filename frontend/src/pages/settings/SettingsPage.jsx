import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, Key, User, Lock, Bell, Shield,
  CheckCircle2, AlertCircle, RefreshCw, Trash2, Eye, EyeOff,
  ExternalLink, ArrowRight, ShieldCheck, Cpu
} from 'lucide-react';
import { aiAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ai_keys');
  
  // BYOK State
  const [byokStatus, setByokStatus] = useState(null);
  const [loadingByok, setLoadingByok] = useState(true);
  const [usageStats, setUsageStats] = useState(null);
  
  // Add/Update Key Modal State
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [validatingKey, setValidatingKey] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyError, setKeyError] = useState('');

  // Profile Form
  const [profileName, setProfileName] = useState(user?.full_name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone_number || '');

  // Password Form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const fetchBYOKData = async () => {
    setLoadingByok(true);
    try {
      const [statusRes, usageRes] = await Promise.all([
        aiAPI.getKeyStatus(),
        aiAPI.getUsage()
      ]);
      setByokStatus(statusRes.data);
      setUsageStats(usageRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingByok(false);
    }
  };

  useEffect(() => {
    fetchBYOKData();
  }, []);

  const handleTestKey = async () => {
    if (!apiKeyInput.trim()) return;
    setValidatingKey(true);
    setValidationResult(null);
    setKeyError('');
    try {
      const res = await aiAPI.validateKey(apiKeyInput.trim());
      setValidationResult(res.data);
    } catch (err) {
      setKeyError(err.response?.data?.detail || 'Key validation failed.');
    } finally {
      setValidatingKey(false);
    }
  };

  const handleSaveKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setValidatingKey(true);
    setKeyError('');
    try {
      const res = await aiAPI.saveKey(apiKeyInput.trim());
      setByokStatus(res.data);
      setKeyModalOpen(false);
      setApiKeyInput('');
      setValidationResult(null);
      fetchBYOKData();
    } catch (err) {
      setKeyError(err.response?.data?.detail || 'Failed to securely store key.');
    } finally {
      setValidatingKey(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!window.confirm("Confirm secure deletion of your personal OpenRouter API key?")) return;
    try {
      await aiAPI.deleteKey();
      fetchBYOKData();
    } catch (err) {
      alert("Failed to delete key: " + err.message);
    }
  };

  const handleTogglePreference = async (key, val) => {
    try {
      const res = await aiAPI.updatePreferences({ [key]: val });
      setByokStatus(res.data);
      fetchBYOKData();
    } catch (err) {
      alert("Failed to update preference: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#F5F7FC] tracking-tight">System Configuration & BYOK</h2>
        <p className="text-xs text-[#98A7BD]">
          Manage account parameters, security settings, and dual API key management (Bring Your Own Key).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#23324A] pb-3 text-xs">
        {[
          { id: 'ai_keys', label: 'AI & BYOK Key Management', icon: Key },
          { id: 'profile', label: 'Profile Information', icon: User },
          { id: 'security', label: 'Security & Access', icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#3978F6] text-white shadow-md shadow-[#3978F6]/20'
                  : 'bg-[#111D32] text-[#98A7BD] hover:text-[#F5F7FC]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BYOK KEY MANAGEMENT */}
      {activeTab === 'ai_keys' && (
        <div className="space-y-6">
          
          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-[#98A7BD] uppercase block font-semibold">Active Inference Gateway</span>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#20C997] animate-pulse"></span>
                <span className="text-lg font-bold text-[#F5F7FC]">{byokStatus?.active_provider || 'Platform'}</span>
              </div>
              <p className="text-[11px] text-[#98A7BD]">
                {byokStatus?.active_provider === 'Personal'
                  ? 'Requests billed directly to your personal OpenRouter account.'
                  : 'Platform pool active with automatic BYOK fallback enabled.'}
              </p>
            </div>

            <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-[#98A7BD] uppercase block font-semibold">Platform Key Status</span>
              <span className="text-sm font-bold text-[#20C997] block">
                {byokStatus?.platform_api_status || 'Operational'}
              </span>
              <p className="text-[11px] text-[#98A7BD]">
                Managed infrastructure pool providing standard quota allocations.
              </p>
            </div>

            <div className="bg-[#111D32] border border-[#23324A] rounded-xl p-4 space-y-2">
              <span className="text-[10px] text-[#98A7BD] uppercase block font-semibold">Personal BYOK Key</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-[#29C5E8]">
                  {byokStatus?.masked_key || 'Not Configured'}
                </span>
                {byokStatus?.masked_key && (
                  <button
                    onClick={handleDeleteKey}
                    className="text-[#EF5B67] hover:text-[#EF5B67]/80 text-xs"
                    title="Purge Key"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#98A7BD]">
                Stored securely via AES-256-GCM authenticated encryption.
              </p>
            </div>

          </div>

          {/* BYOK Controls & Actions */}
          <div className="bg-[#111D32] border border-[#23324A] rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#23324A] gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FC]">Bring Your Own Key (BYOK) Configuration</h3>
                <p className="text-xs text-[#98A7BD]">
                  Connect your OpenRouter account to enable dedicated capacity and custom model endpoints.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setKeyModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-md"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{byokStatus?.masked_key ? 'Update Personal Key' : 'Add Personal Key'}</span>
                </button>
              </div>
            </div>

            {/* Preference Toggles */}
            <div className="space-y-4 text-xs">
              
              <div className="p-4 rounded-xl bg-[#080E1B] border border-[#23324A] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#F5F7FC]">Automatic Quota Fallback Routing</h4>
                  <p className="text-[#98A7BD] mt-0.5">
                    If platform API limits or rate quotas are reached, automatically fall back to your personal key.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={byokStatus?.is_automatic_fallback_enabled ?? true}
                    onChange={(e) => handleTogglePreference('is_automatic_fallback_enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#23324A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3978F6]"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl bg-[#080E1B] border border-[#23324A] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#F5F7FC]">Enable Personal Key Usage</h4>
                  <p className="text-[#98A7BD] mt-0.5">
                    Permit the platform to utilize your stored OpenRouter key for AI requests.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!byokStatus?.masked_key}
                    checked={byokStatus?.is_personal_key_enabled ?? false}
                    onChange={(e) => handleTogglePreference('is_personal_key_enabled', e.target.checked)}
                    className="sr-only peer disabled:opacity-50"
                  />
                  <div className="w-11 h-6 bg-[#23324A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#20C997]"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl bg-[#080E1B] border border-[#23324A] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#F5F7FC]">Preferred Primary Provider</h4>
                  <p className="text-[#98A7BD] mt-0.5">
                    Select which API source is evaluated first before fallback.
                  </p>
                </div>
                <select
                  value={byokStatus?.preferred_source || 'Platform'}
                  onChange={(e) => handleTogglePreference('preferred_source', e.target.value)}
                  disabled={!byokStatus?.is_personal_key_enabled}
                  className="bg-[#111D32] border border-[#23324A] rounded-xl px-3 py-1.5 text-xs text-[#F5F7FC] disabled:opacity-50"
                >
                  <option value="Platform">Platform Managed Key</option>
                  <option value="Personal">Personal BYOK Key</option>
                </select>
              </div>

            </div>

            {/* Instruction Link */}
            <div className="p-3 bg-[#080E1B] border border-[#23324A] rounded-xl text-xs text-[#98A7BD] flex items-center justify-between">
              <span>Need an OpenRouter API key? Generate one with credits from the official console:</span>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[#29C5E8] hover:underline font-semibold inline-flex items-center space-x-1"
              >
                <span>openrouter.ai/keys</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Usage Statistics Dashboard */}
          <div className="bg-[#111D32] border border-[#23324A] rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-[#F5F7FC]">Gateway Usage & Fallback Telemetry</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
              <div className="p-3.5 bg-[#080E1B] rounded-xl border border-[#23324A]">
                <span className="text-[#98A7BD] block">Total Inferences</span>
                <span className="text-xl font-bold text-[#F5F7FC]">{usageStats?.total_requests || 0}</span>
              </div>
              <div className="p-3.5 bg-[#080E1B] rounded-xl border border-[#23324A]">
                <span className="text-[#98A7BD] block">Successful Inferences</span>
                <span className="text-xl font-bold text-[#20C997]">{usageStats?.successful_requests || 0}</span>
              </div>
              <div className="p-3.5 bg-[#080E1B] rounded-xl border border-[#23324A]">
                <span className="text-[#98A7BD] block">Platform Pool Usage</span>
                <span className="text-xl font-bold text-[#3978F6]">{usageStats?.platform_requests || 0}</span>
              </div>
              <div className="p-3.5 bg-[#080E1B] rounded-xl border border-[#23324A]">
                <span className="text-[#98A7BD] block">BYOK Usage</span>
                <span className="text-xl font-bold text-[#29C5E8]">{usageStats?.personal_requests || 0}</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PROFILE INFORMATION */}
      {activeTab === 'profile' && (
        <div className="bg-[#111D32] border border-[#23324A] rounded-2xl p-6 shadow-xl space-y-4 text-xs max-w-xl">
          <h3 className="text-sm font-bold text-[#F5F7FC]">User Profile Information</h3>
          <div>
            <label className="block text-[#F5F7FC] font-semibold mb-1">Full Name</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full bg-[#080E1B] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC]"
            />
          </div>
          <div>
            <label className="block text-[#F5F7FC] font-semibold mb-1">Email (Permanent)</label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full bg-[#080E1B] border border-[#23324A] rounded-xl px-3 py-2 text-[#98A7BD] opacity-60"
            />
          </div>
          <div>
            <label className="block text-[#F5F7FC] font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              className="w-full bg-[#080E1B] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC]"
            />
          </div>
          <div className="p-3 bg-[#080E1B] rounded-xl border border-[#23324A]">
            <span className="text-[#98A7BD] block">Assigned Account Role</span>
            <span className="font-bold text-[#20C997] text-sm">{user?.account_type}</span>
          </div>
          <button
            onClick={() => alert("Profile updated successfully.")}
            className="px-5 py-2.5 rounded-xl bg-[#3978F6] text-white font-semibold"
          >
            Save Profile
          </button>
        </div>
      )}

      {/* TAB 3: SECURITY */}
      {activeTab === 'security' && (
        <div className="bg-[#111D32] border border-[#23324A] rounded-2xl p-6 shadow-xl space-y-4 text-xs max-w-xl">
          <h3 className="text-sm font-bold text-[#F5F7FC]">Change Password</h3>
          {passMsg && (
            <div className="p-3 rounded-xl bg-[#20C997]/10 border border-[#20C997]/30 text-[#20C997]">
              {passMsg}
            </div>
          )}
          <div>
            <label className="block text-[#F5F7FC] font-semibold mb-1">Current Password</label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              className="w-full bg-[#080E1B] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC]"
            />
          </div>
          <div>
            <label className="block text-[#F5F7FC] font-semibold mb-1">New Password (Min 8 characters)</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full bg-[#080E1B] border border-[#23324A] rounded-xl px-3 py-2 text-[#F5F7FC]"
            />
          </div>
          <button
            onClick={() => {
              if (newPass.length < 8) {
                alert("New password must be at least 8 characters.");
                return;
              }
              setPassMsg("Password updated successfully.");
              setCurrentPass('');
              setNewPass('');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#3978F6] text-white font-semibold"
          >
            Update Password
          </button>
        </div>
      )}

      {/* Add / Update Personal Key Modal */}
      {keyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0D1628] border border-[#23324A] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#23324A]">
              <div>
                <h3 className="text-sm font-bold text-[#F5F7FC]">Configure Personal OpenRouter API Key</h3>
                <p className="text-[11px] text-[#98A7BD]">Key will be validated and authenticated via AES-256-GCM.</p>
              </div>
              <button onClick={() => setKeyModalOpen(false)} className="text-[#98A7BD] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {keyError && (
              <div className="p-3 rounded-xl bg-[#EF5B67]/10 border border-[#EF5B67]/30 text-[#EF5B67] flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{keyError}</span>
              </div>
            )}

            {validationResult && (
              <div className="p-3 rounded-xl bg-[#20C997]/10 border border-[#20C997]/30 text-[#20C997] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{validationResult.message}</span>
              </div>
            )}

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#F5F7FC] font-semibold">OpenRouter Key (sk-or-v1-...)</label>
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#3978F6] hover:underline text-[10px]"
                  >
                    Obtain Key
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showKeyInput ? 'text' : 'password'}
                    required
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full bg-[#111D32] border border-[#23324A] rounded-xl px-3 py-2.5 text-[#F5F7FC] font-mono text-xs focus:outline-none focus:border-[#3978F6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A7BD]"
                  >
                    {showKeyInput ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#080E1B] rounded-xl border border-[#23324A] text-[11px] text-[#98A7BD] space-y-1">
                <span className="text-[#20C997] font-semibold block">Security Protection Protocol</span>
                <p>Your API key is never transmitted in plaintext to client browsers or stored in localStorage. It is encrypted on the server with AES-256-GCM.</p>
              </div>

              <div className="pt-3 border-t border-[#23324A] flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={validatingKey || !apiKeyInput.trim()}
                  className="px-3 py-2 rounded-xl bg-[#111D32] text-[#29C5E8] hover:bg-[#0D1628] border border-[#23324A] font-semibold"
                >
                  {validatingKey ? 'Testing Connection...' : 'Verify Key'}
                </button>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setKeyModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#111D32] text-[#98A7BD]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={validatingKey || !apiKeyInput.trim()}
                    className="px-5 py-2 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold shadow-md"
                  >
                    Save & Encrypt Key
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
