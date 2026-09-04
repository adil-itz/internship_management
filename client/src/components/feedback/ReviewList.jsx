import React from 'react';
import StarRating from './StarRating';
import { ThumbsUp, ThumbsDown, Calendar, User, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

export default function ReviewList({ reviews = [], pagination, onPageChange }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
        <MessageSquare size={28} className="mx-auto text-slate-400" />
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">No reviews yet</h4>
        <p className="text-xs text-slate-500">Student reviews and experiences will be listed here.</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {reviews.map((rev) => {
          const reviewerName = rev.reviewerId?.name || (rev.visibility === 'public' ? 'Intern' : 'Anonymous Intern');
          const overallScore = rev.ratings?.overall || 0;

          return (
            <div
              key={rev._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                    {reviewerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{reviewerName}</span>
                    </h4>
                    <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(rev.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StarRating value={overallScore} readOnly size={16} showLabel={false} />
                  <span className="font-black text-xs text-amber-500">{overallScore}.0</span>
                </div>
              </div>

              {rev.comments && (
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line">
                  "{rev.comments}"
                </p>
              )}

              {rev.recommendation !== undefined && rev.recommendation !== null && (
                <div className="pt-1 flex items-center gap-2">
                  {rev.recommendation ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <ThumbsUp size={12} /> Recommends this internship / company
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                      <ThumbsDown size={12} /> Does not recommend
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500">
            Page <strong className="text-slate-900 dark:text-white">{pagination.page}</strong> of <strong className="text-slate-900 dark:text-white">{pagination.totalPages}</strong>
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              className="px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-all flex items-center gap-1"
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              className="px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-all flex items-center gap-1"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
