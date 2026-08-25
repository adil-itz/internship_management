import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DeleteInternshipModal({ isOpen, onClose, onConfirm, internshipTitle, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm">
            <AlertTriangle size={18} />
            <span>Delete Internship?</span>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Are you sure you want to delete this internship posting?
          </p>
          
          <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
            <p className="font-extrabold text-sm text-slate-900 dark:text-white">
              "{internshipTitle}"
            </p>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            This action cannot be undone. All prospective student views will be removed.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Internship'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
