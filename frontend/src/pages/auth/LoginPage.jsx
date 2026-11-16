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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#3978F6] selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#3978F6]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center space-x-3 mb-6">
          <img
            alt="Haven & Key Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/ALJJyrAf8wxbxnaQNYaVA6z6lfB5jMc5LTtlN93GkdKrF0zMehykUb3DX877wyL8utZ0zaHuV-JhDYDIF6t5jPDUS-uYUb7RThCFbdjF-R3vz8fbdlbn61XvIBYsXofPeDldo_p1pGdoMUgQYTyHDA9qB9iprl_kVS3Tz9WT_ykZISk8S4FzAg4gZTHgCZTykdTTknvikFX0zVskFYSRYf2SLJV-_SOmzz6zzBUxuCAUZo4"
          />
          <span className="font-headline-sm text-2xl tracking-tight text-[#0F172A] uppercase font-medium">
            Haven &amp; Key <span className="text-xs text-[#0284C7] normal-case tracking-normal ml-1">· PropWise AI</span>
          </span>
        </Link>
        <h2 className="text-center text-xl font-bold text-[#0F172A] tracking-tight">
          Client &amp; Advisory Portal Authentication
        </h2>
        <p className="mt-2 text-center text-xs text-[#475569]">
          Secure institutional gateway for property valuation, portfolio analytics, and mortgage underwriting.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#F1F5F9] border border-[#E2E8F0] py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 flex items-start space-x-2.5 text-xs text-[#DC2626]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Corporate or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="officer@propwise.ai"
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#475569]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0F172A]">
                  Password
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
                  placeholder="Enter your password"
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#0F172A] placeholder-[#475569]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#0F172A]"
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
                  className="w-4 h-4 rounded bg-[#FFFFFF] border-[#E2E8F0] text-[#3978F6] focus:ring-0"
                />
                <span className="text-xs text-[#475569]">Remember this workstation</span>
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
          <div className="mt-6 pt-5 border-t border-[#E2E8F0]">
            <span className="text-[10px] font-bold text-[#475569] uppercase block tracking-wider mb-2.5">
              Instant Demo Access Profiles
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillDemo('officer@propwise.ai', 'Officer@PropWise2026')}
                className="p-2 rounded-lg bg-[#FFFFFF] hover:bg-[#FFFFFF]/80 border border-[#E2E8F0] text-left text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                <span className="font-semibold block text-[#3978F6]">Bank Officer</span>
                <span className="text-[10px] block opacity-70">officer@propwise.ai</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('customer@propwise.ai', 'Customer@PropWise2026')}
                className="p-2 rounded-lg bg-[#FFFFFF] hover:bg-[#FFFFFF]/80 border border-[#E2E8F0] text-left text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                <span className="font-semibold block text-[#059669]">Customer</span>
                <span className="text-[10px] block opacity-70">customer@propwise.ai</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('analyst@propwise.ai', 'Analyst@PropWise2026')}
                className="p-2 rounded-lg bg-[#FFFFFF] hover:bg-[#FFFFFF]/80 border border-[#E2E8F0] text-left text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                <span className="font-semibold block text-[#0284C7]">Property Analyst</span>
                <span className="text-[10px] block opacity-70">analyst@propwise.ai</span>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('admin@propwise.ai', 'Admin@PropWise2026')}
                className="p-2 rounded-lg bg-[#FFFFFF] hover:bg-[#FFFFFF]/80 border border-[#E2E8F0] text-left text-[#475569] hover:text-[#0F172A] transition-colors"
              >
                <span className="font-semibold block text-[#D97706]">Enterprise Admin</span>
                <span className="text-[10px] block opacity-70">admin@propwise.ai</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#475569]">
            New to PROPWISE AI?{' '}
            <Link to="/register" className="text-[#3978F6] hover:text-[#0284C7] font-semibold">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
