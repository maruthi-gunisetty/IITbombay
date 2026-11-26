import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, Eye, EyeOff, Home, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    accountType: 'Customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirmation password do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (!agreeTerms) {
      setError('You must accept the terms of data processing and platform usage.');
      return;
    }

    setLoading(true);
    try {
      await register({
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        password: formData.password,
        account_type: formData.accountType
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#3978F6] selection:text-white">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0284C7]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center justify-center space-x-3 mb-6 group w-full">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#636B2F] to-[#3D4127] flex items-center justify-center p-0.5 shadow-md">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Home className="w-5 h-5 text-[#636B2F]" />
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#3D4127]">
            Gruha <span className="text-[#636B2F]">Anwesh</span>
          </span>
        </Link>
        <h2 className="text-center text-xl font-bold text-[#0F172A] tracking-tight">
          Create Client &amp; Advisory Account
        </h2>
        <p className="mt-2 text-center text-xs text-[#475569]">
          Register to access private estate portfolios, valuation models, and underwriting workflows.
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

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Designated Account Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'Customer', label: 'Borrower / Owner' },
                  { role: 'Bank Officer', label: 'Credit Officer' },
                  { role: 'Property Analyst', label: 'Asset Valuer' }
                ].map(({ role, label }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, accountType: role })}
                    className={`py-2 px-1 text-center rounded-xl border text-[11px] font-semibold transition-all ${formData.accountType === role
                        ? 'bg-[#3978F6]/20 border-[#3978F6] text-[#0284C7]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] text-[#475569] hover:text-[#0F172A]'
                      }`}
                  >
                    <span className="block truncate">{role}</span>
                    <span className="block text-[9px] opacity-60 font-normal truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Rahul Sharma"
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#475569]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@organization.com"
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#475569]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+91 98200 00000"
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#475569]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min 8 characters"
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

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2 flex items-center space-x-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full ${strength >= step
                          ? strength >= 3
                            ? 'bg-[#059669]'
                            : 'bg-[#D97706]'
                          : 'bg-[#E2E8F0]'
                        }`}
                    />
                  ))}
                  <span className="text-[10px] text-[#475569] pl-1">
                    {strength <= 2 ? 'Moderate' : 'Strong'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0F172A] placeholder-[#475569]/60 focus:outline-none focus:border-[#3978F6] transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded bg-[#FFFFFF] border-[#E2E8F0] text-[#3978F6] focus:ring-0"
                />
                <span className="text-[11px] text-[#475569] leading-tight">
                  I accept the institutional terms of service, AI decision support disclosures, and privacy policies.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold text-xs tracking-wide transition-all duration-200 shadow-lg shadow-[#3978F6]/25 disabled:opacity-50 flex items-center justify-center space-x-2 mt-4"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#475569]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#3978F6] hover:text-[#0284C7] font-semibold">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
