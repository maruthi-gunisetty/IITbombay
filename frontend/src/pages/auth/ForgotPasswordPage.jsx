import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Home, AlertCircle, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { authAPI } from '../../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [demoToken, setDemoToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword({ email });
      setSubmitted(true);
      if (res.data?.demo_reset_token) {
        setDemoToken(res.data.demo_reset_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.resetPassword({ token: demoToken, new_password: newPassword });
      setResetSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#636B2F] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#636B2F] to-[#3D4127] flex items-center justify-center p-0.5 shadow-lg shadow-[#636B2F]/20">
            <div className="w-full h-full bg-[#FAFBF7] rounded-[10px] flex items-center justify-center">
              <Home className="w-5 h-5 text-[#636B2F]" />
            </div>
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#3D4127]">
            Gruha <span className="text-[#636B2F]">Anwesh</span>
          </span>
        </Link>
        <h2 className="text-center text-xl font-bold text-[#3D4127] tracking-tight">
          Password Recovery
        </h2>
        <p className="mt-2 text-center text-xs text-[#636B2F]">
          Generate a secure, time-bounded verification token to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#FFFFFF] border border-[#E2E6D5] py-8 px-6 shadow-xl rounded-2xl sm:px-10">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 flex items-start space-x-2.5 text-xs text-[#DC2626]">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resetSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-[#636B2F]/20 border border-[#636B2F] mx-auto flex items-center justify-center text-[#636B2F]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#3D4127]">Password Successfully Updated</h3>
              <p className="text-xs text-[#636B2F]">
                Your account credentials have been updated. You may now log in to your workspace.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#636B2F] hover:bg-[#3D4127] text-white text-xs font-semibold shadow-md transition-colors"
              >
                Proceed to Sign In
              </Link>
            </div>
          ) : !submitted ? (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D4127] mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#636B2F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@propwise.ai"
                    className="w-full bg-[#FAFBF7] border border-[#E2E6D5] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3D4127] placeholder-[#636B2F]/60 focus:outline-none focus:border-[#636B2F]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#636B2F] hover:bg-[#3D4127] text-white font-semibold text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md"
              >
                <span>{loading ? 'Validating...' : 'Generate Reset Token'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-[#FAFBF7] border border-[#E2E6D5] rounded-xl text-xs space-y-1">
                <span className="text-[#636B2F] font-semibold block">Expiring Verification Token</span>
                <p className="font-mono text-[10px] text-[#3D4127] break-all">{demoToken}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D4127] mb-1.5">
                  Set New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#636B2F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 8 characters"
                    className="w-full bg-[#FAFBF7] border border-[#E2E6D5] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3D4127] placeholder-[#636B2F]/60 focus:outline-none focus:border-[#636B2F]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#636B2F] hover:bg-[#3D4127] text-white font-bold text-xs transition-colors disabled:opacity-50 shadow-md"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-[#636B2F]">
            Remember your credentials?{' '}
            <Link to="/login" className="text-[#3D4127] hover:text-[#636B2F] font-semibold underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
