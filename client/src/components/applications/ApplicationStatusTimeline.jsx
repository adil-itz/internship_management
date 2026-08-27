import React from 'react';
import { Check, X, RotateCcw } from 'lucide-react';

export default function ApplicationStatusTimeline({ status, appliedAt, interviewDate }) {
  if (status === 'rejected') {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          <X size={20} />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-rose-900 dark:text-rose-200">Application Rejected</h4>
          <p className="text-xs text-rose-600 dark:text-rose-400">Unfortunately, your application was not selected for this position.</p>
        </div>
      </div>
    );
  }

  if (status === 'withdrawn') {
    return (
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
          <RotateCcw size={18} />
        </div>
        <div>
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Application Withdrawn</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">You have withdrawn your application for this internship.</p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'applied', label: 'Applied', subtitle: appliedAt ? new Date(appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '' },
    { key: 'shortlisted', label: 'Shortlisted', subtitle: '' },
    { key: 'interview_scheduled', label: 'Interview Scheduled', subtitle: interviewDate ? new Date(interviewDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '' },
    { key: 'selected', label: 'Selected', subtitle: '' }
  ];

  const order = ['applied', 'shortlisted', 'interview_scheduled', 'selected'];
  const currentIndex = order.indexOf(status);

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 z-0"></div>
        
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 z-0 transition-all duration-500"
          style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 shadow-lg scale-110'
                    : isPassed
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-300 dark:border-slate-700'
                }`}
              >
                {isPassed ? <Check size={16} /> : idx + 1}
              </div>
              <span className={`mt-2 text-xs font-bold text-center max-w-[90px] ${
                isCurrent
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                  : isPassed
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-400'
              }`}>
                {step.label}
              </span>
              {step.subtitle && (
                <span className="text-[10px] text-slate-400 font-medium">{step.subtitle}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
