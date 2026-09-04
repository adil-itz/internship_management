import React from 'react';
import StarRating from './StarRating';
import { ThumbsUp, Star, Award, MessageSquare } from 'lucide-react';

export default function RatingSummary({ summary, type = 'internship' }) {
  if (!summary || summary.totalReviews === 0) {
    return (
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <Star size={24} className="mx-auto text-slate-400" />
        <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300">No ratings yet</h4>
        <p className="text-[11px] text-slate-400">Be the first intern to leave a review!</p>
      </div>
    );
  }

  const {
    averageOverall = 0,
    totalReviews = 0,
    recommendationPercentage = 0,
    learning,
    taskQuality,
    mentorSupport,
    workEnvironment,
    communication,
    workLifeBalance,
    companyCulture,
    professionalGrowth,
    internshipManagement
  } = summary;

  const categories = type === 'company' ? [
    { label: 'Learning', value: learning },
    { label: 'Work Environment', value: workEnvironment },
    { label: 'Mentor Support', value: mentorSupport },
    { label: 'Communication', value: communication },
    { label: 'Professional Growth', value: professionalGrowth },
    { label: 'Company Culture', value: companyCulture },
    { label: 'Internship Management', value: internshipManagement }
  ] : [
    { label: 'Learning', value: learning },
    { label: 'Task Quality', value: taskQuality },
    { label: 'Mentor Support', value: mentorSupport },
    { label: 'Work Environment', value: workEnvironment },
    { label: 'Communication', value: communication },
    { label: 'Work-Life Balance', value: workLifeBalance }
  ];

  const validCategories = categories.filter(c => c.value !== undefined && c.value !== null);

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center shrink-0">
            <span className="font-black text-2xl text-amber-500">{averageOverall}</span>
            <span className="text-[9px] font-extrabold uppercase text-amber-600 dark:text-amber-400">out of 5</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StarRating value={parseFloat(averageOverall)} readOnly size={18} showLabel={false} />
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Based on <strong className="text-slate-900 dark:text-white font-black">{totalReviews}</strong> student review{totalReviews > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {recommendationPercentage > 0 && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
            <ThumbsUp size={16} className="text-emerald-500 shrink-0" />
            <div>
              <p className="text-xs font-black">{recommendationPercentage}% Recommend</p>
              <p className="text-[10px] font-medium text-emerald-600/80 dark:text-emerald-400/80">Would recommend to other interns</p>
            </div>
          </div>
        )}
      </div>

      {validCategories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {validCategories.map((cat, idx) => {
            const score = parseFloat(cat.value || 0);
            const percentage = (score / 5) * 100;
            return (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{cat.label}</span>
                  <span className="font-black text-slate-900 dark:text-white">{score}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
