import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  Sparkles,
  Layers,
  Sun,
  Moon,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { verifyCertificatePublic } from '../services/certificate.service';

export default function PublicCertificateVerification({ darkMode, setDarkMode }) {
  const { certificateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await verifyCertificatePublic(certificateId);
        setResult(res);
      } catch (err) {
        setError(err.message || 'Unable to verify certificate at this time.');
      } finally {
        setLoading(false);
      }
    };

    if (certificateId) {
      verify();
    }
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 transition-colors duration-300 relative overflow-hidden">
      
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <header className="w-full max-w-5xl mx-auto flex items-center justify-between shrink-0 z-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
            <Layers size={20} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
            Inter<span className="text-blue-600 dark:text-blue-400">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700" />}
          </button>
          <Link
            to="/login"
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Portal Login</span>
          </Link>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto my-8 z-10">
        {loading ? (
          <div className="py-20 text-center space-y-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="w-10 h-10 mx-auto border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Verifying Certificate ID: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{certificateId}</span>...
            </p>
          </div>
        ) : error || !result || !result.valid ? (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-rose-200 dark:border-rose-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-inner">
              <ShieldAlert size={36} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                Invalid or Revoked Certificate
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Certificate Verification Failed
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {result?.status === 'revoked'
                  ? 'This certificate has been revoked by the issuing organization.'
                  : error || 'The requested certificate ID does not exist in the official InterFlow Registry.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              ID: {certificateId}
            </div>
          </div>
        ) : (
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600"></div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={36} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 size={14} />
                <span>Verified Authentic Certificate</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Official Internship Completion Certificate
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Issued by InterFlow Verified Credential Network
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-6">
              <div className="text-center border-b border-slate-200/80 dark:border-slate-800 pb-5 space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                  This certifies that
                </span>
                <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {result.certificate?.studentName}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  has successfully completed the official internship program:
                </p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-1">
                  {result.certificate?.internshipTitle}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Building2 size={12} className="text-blue-500" />
                    <span>Host Company</span>
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {result.certificate?.companyName}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <User size={12} className="text-indigo-500" />
                    <span>Supervising Mentor</span>
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {result.certificate?.mentorName || 'Official Mentor'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Calendar size={12} className="text-emerald-500" />
                    <span>Program Duration</span>
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {result.certificate?.startDate ? new Date(result.certificate.startDate).toLocaleDateString() : 'N/A'} - {result.certificate?.endDate ? new Date(result.certificate.endDate).toLocaleDateString() : 'Present'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Award size={12} className="text-amber-500" />
                    <span>Date Issued</span>
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {result.certificate?.issueDate ? new Date(result.certificate.issueDate).toLocaleDateString() : new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/80 dark:border-slate-800">
                <span>Certificate Record ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-200 bg-slate-200/60 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                  {result.certificate?.certificateId}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center text-[10px] text-slate-400 dark:text-slate-600 shrink-0 z-10">
        © {new Date().getFullYear()} InterFlow Verification Registry. Authenticated via cryptographic signatures.
      </footer>
    </div>
  );
}
