import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, BarChart3, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#080E1B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#3978F6] selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#3978F6]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2457C5] to-[#29C5E8] flex items-center justify-center p-0.5 shadow-lg">
            <div className="w-full h-full bg-[#080E1B] rounded-[10px] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#29C5E8]" />
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#F5F7FC]">
            PROPWISE <span className="text-[#3978F6]">AI</span>
          </span>
        </Link>
        <h2 className="text-center text-xl font-bold text-[#F5F7FC] tracking-tight">
          Client & Officer Portal Authentication
        </h2>
        <p className="mt-2 text-center text-xs text-[#98A7BD]">
          Secure entry for valuation intelligence and mortgage decisioning.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#0D1628] border border-[#23324A] py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#EF5B67]/10 border border-[#EF5B67]/30 flex items-start space-x-2.5 text-xs text-[#EF5B67]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#F5F7FC] mb-1.5">
                Corporate or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#98A7BD] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@propwise.ai"
                  className="w-full bg-[#111D32] border border-[#23324A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F7FC] placeholder-[#98A7BD]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#F5F7FC]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-[#3978F6] hover:text-[#29C5E8] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#98A7BD] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#111D32] border border-[#23324A] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F5F7FC] placeholder-[#98A7BD]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#98A7BD] hover:text-[#F5F7FC]"
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
                  className="w-4 h-4 rounded bg-[#111D32] border-[#23324A] text-[#3978F6] focus:ring-0"
                />
                <span className="text-xs text-[#98A7BD]">Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold text-xs tracking-wide transition-all duration-200 shadow-lg shadow-[#3978F6]/25 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Institutional Demo Credentials Quick Select */}
          <div className="mt-6 pt-5 border-t border-[#23324A]">
            <span className="text-[10px] font-bold text-[#98A7BD] uppercase block tracking-wider mb-2.5">
              Instant Demo Access Profiles
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemo('officer@propwise.ai', 'Officer@PropWise2026')}
                className="p-2 rounded-lg bg-[#111D32] hover:bg-[#111D32]/80 border border-[#23324A] text-left text-[#98A7BD] hover:text-[#F5F7FC] transition-colors"
              >
                <span className="font-semibold block text-[#3978F6]">Bank Officer</span>
                <span className="text-[10px] block opacity-70">officer@propwise.ai</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('customer@propwise.ai', 'Customer@PropWise2026')}
                className="p-2 rounded-lg bg-[#111D32] hover:bg-[#111D32]/80 border border-[#23324A] text-left text-[#98A7BD] hover:text-[#F5F7FC] transition-colors"
              >
                <span className="font-semibold block text-[#20C997]">Customer</span>
                <span className="text-[10px] block opacity-70">customer@propwise.ai</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('analyst@propwise.ai', 'Analyst@PropWise2026')}
                className="p-2 rounded-lg bg-[#111D32] hover:bg-[#111D32]/80 border border-[#23324A] text-left text-[#98A7BD] hover:text-[#F5F7FC] transition-colors"
              >
                <span className="font-semibold block text-[#29C5E8]">Property Analyst</span>
                <span className="text-[10px] block opacity-70">analyst@propwise.ai</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@propwise.ai', 'Admin@PropWise2026')}
                className="p-2 rounded-lg bg-[#111D32] hover:bg-[#111D32]/80 border border-[#23324A] text-left text-[#98A7BD] hover:text-[#F5F7FC] transition-colors"
              >
                <span className="font-semibold block text-[#F5B942]">Enterprise Admin</span>
                <span className="text-[10px] block opacity-70">admin@propwise.ai</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#98A7BD]">
            New to PROPWISE AI?{' '}
            <Link to="/register" className="text-[#3978F6] hover:text-[#29C5E8] font-semibold">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
