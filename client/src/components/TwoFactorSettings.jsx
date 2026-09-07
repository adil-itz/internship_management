import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  get2FAStatus,
  setup2FA,
  verify2FASetup,
  disable2FA,
} from '../services/auth.service';

export default function TwoFactorSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [otpToken, setOtpToken] = useState('');

  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await get2FAStatus();
      if (res.success) {
        setIsEnabled(res.enabled);
      }
    } catch (err) {
      setError(err.message || 'Failed to load 2FA status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleStartSetup = async () => {
    setError('');
    setSuccess('');
    try {
      setActionLoading(true);
      const res = await setup2FA();
      if (res.success) {
        setShowSetupModal(true);
        setSuccess('OTP sent to your email. Please enter it below to complete 2FA setup.');
      }
    } catch (err) {
      setError(err.message || 'Failed to send setup OTP');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmSetup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!otpToken || otpToken.trim().length !== 6) {
      setError('Please enter a 6-digit OTP token');
      return;
    }

    try {
      setActionLoading(true);
      const res = await verify2FASetup(otpToken.trim());
      if (res.success) {
        setIsEnabled(true);
        setShowSetupModal(false);
        setOtpToken('');
        setSuccess('Two-Factor Authentication (Email OTP) enabled successfully!');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Invalid or expired OTP.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDisable = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!disablePassword) {
      setError('Please enter your password to disable 2FA');
      return;
    }

    try {
      setActionLoading(true);
      const res = await disable2FA(disablePassword);
      if (res.success) {
        setIsEnabled(false);
        setShowDisableModal(false);
        setDisablePassword('');
        setSuccess('2FA disabled successfully');
      }
    } catch (err) {
      setError(err.message || 'Failed to disable 2FA. Check your password.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 space-y-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${
            isEnabled 
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400' 
              : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400'
          }`}>
            {isEnabled ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Two-Factor Authentication (2FA)
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                isEnabled 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}>
                {isEnabled ? 'Enabled (Email OTP)' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Secure your account using 6-digit email verification codes upon sign in.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
        ) : isEnabled ? (
          <button
            onClick={() => {
              setError('');
              setSuccess('');
              setShowDisableModal(true);
            }}
            className="px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/60 rounded-xl transition-all cursor-pointer shrink-0"
          >
            Disable 2FA
          </button>
        ) : (
          <button
            onClick={handleStartSetup}
            disabled={actionLoading}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
          >
            {actionLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Enable 2FA</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {showSetupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowSetupModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
                <KeyRound size={24} />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Verify Email OTP
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We sent a 6-digit OTP code to your registered email. Enter it below to enable 2FA.
              </p>
            </div>

            <form onSubmit={handleConfirmSetup} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl text-center text-xl font-bold tracking-[0.5em] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSetupModal(false)}
                  className="w-1/2 py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-1/2 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Verify & Enable</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDisableModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowDisableModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X size={20} />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
                <Lock size={24} />
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Disable Two-Factor Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Please enter your account password to confirm disabling 2FA.
              </p>
            </div>

            <form onSubmit={handleConfirmDisable} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Account Password
                </label>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDisableModal(false)}
                  className="w-1/2 py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-1/2 py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span>Disable 2FA</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
