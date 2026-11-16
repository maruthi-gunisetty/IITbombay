import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, BarChart3, AlertCircle, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-[#080E1B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#3978F6] selection:text-white">
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
          Password Recovery
        </h2>
        <p className="mt-2 text-center text-xs text-[#98A7BD]">
          Generate a secure, time-bounded verification token to reset your password.
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

          {resetSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-[#20C997]/20 border border-[#20C997] mx-auto flex items-center justify-center text-[#20C997]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#F5F7FC]">Password Successfully Updated</h3>
              <p className="text-xs text-[#98A7BD]">
                Your account credentials have been updated. You may now log in to your workspace.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold"
              >
                Proceed to Sign In
              </Link>
            </div>
          ) : !submitted ? (
            <form onSubmit={handleRequestToken} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F5F7FC] mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#98A7BD] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@propwise.ai"
                    className="w-full bg-[#111D32] border border-[#23324A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F7FC] placeholder-[#98A7BD]/60 focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-semibold text-xs transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Validating...' : 'Generate Reset Token'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="p-3 bg-[#111D32] border border-[#23324A] rounded-xl text-xs space-y-1">
                <span className="text-[#20C997] font-semibold block">Expiring Verification Token</span>
                <p className="font-mono text-[10px] text-[#98A7BD] break-all">{demoToken}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F5F7FC] mb-1.5">
                  Set New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#98A7BD] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter at least 8 characters"
                    className="w-full bg-[#111D32] border border-[#23324A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F7FC] placeholder-[#98A7BD]/60 focus:outline-none focus:border-[#3978F6]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#20C997] hover:bg-[#20C997]/80 text-[#080E1B] font-bold text-xs transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-[#98A7BD]">
            Remember your credentials?{' '}
            <Link to="/login" className="text-[#3978F6] hover:text-[#29C5E8] font-semibold">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
