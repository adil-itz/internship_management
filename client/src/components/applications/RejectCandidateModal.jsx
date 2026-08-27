import React, { useState } from 'react';
import { X, AlertTriangle, XCircle } from 'lucide-react';
import { updateApplicationStatus } from '../../services/application.service';

export default function RejectCandidateModal({ isOpen, onClose, applicationId, candidateName, onSuccess }) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setSubmitting(true);
    try {
      const res = await updateApplicationStatus(applicationId, {
        status: 'rejected',
        rejectionReason: rejectionReason.trim()
      });

      if (res && res.success) {
        if (onSuccess) onSuccess(res.application);
        onClose();
      } else {
        setError(res.message || 'Failed to reject candidate.');
      }
    } catch (err) {
      setError(err.message || 'Failed to reject candidate.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-0">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <XCircle size={20} />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Reject Candidate</h3>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            Are you sure you want to reject <strong className="text-slate-900 dark:text-white">{candidateName || 'this candidate'}</strong>? This action will mark their application as rejected.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Reason for Rejection (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide constructive feedback or reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={submitting}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md cursor-pointer transition-all"
            >
              {submitting ? 'Rejecting...' : 'Reject Candidate'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
