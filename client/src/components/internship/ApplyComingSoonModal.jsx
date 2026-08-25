import React from 'react';
import { Sparkles, X, Info } from 'lucide-react';

export default function ApplyComingSoonModal({ isOpen, onClose, internshipTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-extrabold text-sm">
            <Sparkles size={18} />
            <span>Applications Coming Soon</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="text-center space-y-3 py-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Info size={28} />
          </div>
          
          {internshipTitle && (
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
              {internshipTitle}
            </h4>
          )}

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            The internship application feature will be available soon. Please check back later or bookmark this opportunity!
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer transition-all"
          >
            OK, Understood
          </button>
        </div>
      </div>
    </div>
  );
}
