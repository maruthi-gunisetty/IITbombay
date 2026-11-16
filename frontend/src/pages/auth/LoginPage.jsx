import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, BarChart3, AlertCircle, ArrowRight, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const demoProfiles = [
  {
    role: "Bank Officer",
    email: "officer@propwise.ai",
    pass: "Officer@PropWise2026",
    badge: "Underwriting & Loans",
    color: "#3978F6",
    bg: "bg-blue-50 border-blue-200 text-blue-700"
  },
  {
    role: "Customer / Borrower",
    email: "customer@propwise.ai",
    pass: "Customer@PropWise2026",
    badge: "Portfolio & Applications",
    color: "#059669",
    bg: "bg-emerald-50 border-emerald-200 text-emerald-700"
  },
  {
    role: "Property Analyst",
    email: "analyst@propwise.ai",
    pass: "Analyst@PropWise2026",
    badge: "Valuation & Risk",
    color: "#0284C7",
    bg: "bg-sky-50 border-sky-200 text-sky-700"
  },
  {
    role: "Enterprise Admin",
    email: "admin@propwise.ai",
    pass: "Admin@PropWise2026",
    badge: "Full Governance",
    color: "#D97706",
    bg: "bg-amber-50 border-amber-200 text-amber-800"
  }
];

export default function LoginPage() {
  // Pre-fill fake/demo credentials by default so user can sign in immediately
  const [email, setEmail] = useState('officer@propwise.ai');
  const [password, setPassword] = useState('Officer@PropWise2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    try {
      await login(demoEmail, demoPass, true);
      navigate('/dashboard');
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#3978F6] selection:text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#3978F6]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2457C5] to-[#0284C7] flex items-center justify-center p-0.5 shadow-md">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#0284C7]" />
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#0F172A] uppercase">
            PROPWISE <span className="text-[#3978F6]">AI</span>
          </span>
        </Link>
        <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">
          Client &amp; Advisory Portal Authentication
        </h2>
        <p className="mt-1 text-xs text-[#475569] max-w-sm mx-auto leading-relaxed">
          Secure institutional gateway for AI property valuation, risk assessment, and mortgage underwriting.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white border border-[#E2E8F0] py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          
          {/* Demo Mode Notification Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start space-x-3 text-xs text-blue-900">
            <Zap className="w-4 h-4 text-[#3978F6] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Testing &amp; Demo Credentials Enabled</span>
              <span className="text-[11px] text-blue-800 leading-relaxed block mt-0.5">
                You can enter <b>ANY custom or fake credentials</b> (e.g. test@demo.com / 123456) or click any 1-click role profile below.
              </span>
            </div>
          </div>

          {/* 1-Click Instant Demo Login Buttons */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-[#475569] uppercase block tracking-wider mb-2">
              1-Click Instant Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              {demoProfiles.map((p) => (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleInstantLogin(p.email, p.pass)}
                  disabled={loading}
                  className="p-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#3978F6] bg-slate-50 hover:bg-white text-left transition-all duration-150 shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A] group-hover:text-[#3978F6] transition-colors">
                      {p.role}
                    </span>
                    <ArrowRight className="w-3 h-3 text-[#475569] group-hover:text-[#3978F6] group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <span className="text-[10px] text-[#475569] block mt-0.5 truncate">{p.email}</span>
                  <span className={`inline-block text-[9px] font-semibold px-1.5 py-0.5 rounded mt-1.5 border ${p.bg}`}>
                    {p.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[10px] font-semibold text-[#475569]">
                Or Sign In With Custom / Fake Credentials
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 flex items-start space-x-2.5 text-xs text-[#DC2626]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Email Address (Any email accepted)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@propwise.ai or test@demo.com"
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#475569]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0F172A]">
                  Password (Any password accepted)
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#3978F6] hover:text-[#0284C7] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter any password"
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#0F172A] placeholder-[#475569]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-white border-[#E2E8F0] text-[#3978F6] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-[#475569]">Remember session on this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold text-xs tracking-wide transition-all duration-200 shadow-md shadow-[#3978F6]/25 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{loading ? 'Authenticating Session...' : 'Sign In to Workspace'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#475569]">
            Want to register a brand new account?{' '}
            <Link to="/register" className="text-[#3978F6] hover:text-[#0284C7] font-semibold">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
