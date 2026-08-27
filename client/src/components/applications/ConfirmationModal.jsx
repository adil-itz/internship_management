import React from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'Please confirm this action.',
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  loading = false
}) {
  if (!isOpen) return null;

  const btnClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-0">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} className="text-blue-500" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`px-5 py-2 text-xs font-extrabold rounded-xl shadow-md cursor-pointer transition-all ${btnClasses[confirmVariant] || btnClasses.primary}`}
            >
              {loading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
