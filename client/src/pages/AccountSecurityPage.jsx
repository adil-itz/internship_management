import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TwoFactorSettings from '../components/TwoFactorSettings';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

export default function AccountSecurityPage({ darkMode, setDarkMode }) {
  return (
    <DashboardLayout darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-2xl space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles size={14} className="text-amber-400" />
              <span>Account Protection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Security & Two-Factor Authentication
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage multi-factor authentication (2FA) and account security preferences for your account.
            </p>
          </div>
        </div>

        <TwoFactorSettings />
      </div>
    </DashboardLayout>
  );
}
