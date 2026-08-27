import React, { useState, useEffect } from 'react';
import { X, FileText, Send, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { createApplication } from '../../services/application.service';
import { getStudentProfile } from '../../services/student.service';

export default function ApplicationFormModal({ isOpen, onClose, internshipId, internshipTitle, companyName, onSuccess }) {
  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      setCoverLetter('');
      fetchProfileResume();
    }
  }, [isOpen]);

  const fetchProfileResume = async () => {
    setProfileLoading(true);
    try {
      const res = await getStudentProfile();
      if (res && res.profile && res.profile.resumeUrl) {
        setResumeUrl(res.profile.resumeUrl);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!resumeUrl.trim()) {
      setError('Please provide a valid resume URL or upload your resume in your Student Profile.');
      return;
    }

    if (!coverLetter.trim() || coverLetter.trim().length < 20) {
      setError('Please write a cover letter with at least 20 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createApplication({
        internshipId,
        resumeUrl: resumeUrl.trim(),
        coverLetter: coverLetter.trim()
      });

      if (res && res.success) {
        setSuccessMsg('Application submitted successfully.');
        setTimeout(() => {
          if (onSuccess) onSuccess(res.application);
          onClose();
        }, 1200);
      } else {
        setError(res.message || 'Failed to submit application.');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-0">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={18} className="text-blue-500" /> Apply for Internship
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {internshipTitle} • <strong className="text-slate-700 dark:text-slate-300">{companyName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Resume URL <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume.pdf"
                disabled={submitting || profileLoading}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {profileLoading ? 'Loading profile resume...' : 'Prefilled from your Student Profile if available.'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Cover Letter <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you are a great fit for this internship role..."
              disabled={submitting}
              className="w-full p-3.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition-all"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
