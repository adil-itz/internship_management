import React, { useState } from 'react';
import { X, CheckCircle2, RotateCcw, ExternalLink, AlertCircle } from 'lucide-react';
import { reviewTask } from '../../services/internshipTask.service';

export default function ReviewTaskModal({ isOpen, onClose, onSuccess, task }) {
  const [mentorFeedback, setMentorFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !task) return null;

  const studentName = task.student?.name || 'Student';
  const submissionUrl = task.submissionUrl || '';
  const submissionNote = task.submissionNote || '';

  const handleReview = async (actionStatus) => {
    setError(null);
    setSubmitting(true);

    try {
      const res = await reviewTask(task._id, {
        status: actionStatus,
        mentorFeedback: mentorFeedback || (actionStatus === 'completed' ? 'Good work.' : 'Please make the requested changes.')
      });

      if (res && res.success) {
        onSuccess && onSuccess(res.task);
        onClose();
      } else {
        setError(res.message || 'Failed to review task');
      }
    } catch (err) {
      setError(err.message || 'Failed to review task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-black text-lg text-slate-900 dark:text-white">Review Submitted Task</h3>
            <p className="text-xs text-slate-400 font-medium">Intern: {studentName}</p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-extrabold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <span className="text-slate-400 font-extrabold uppercase text-[10px]">Task Title</span>
            <p className="font-black text-slate-900 dark:text-white text-sm">{task.title}</p>
          </div>

          {submissionUrl && (
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-2">
              <span className="text-purple-700 dark:text-purple-300 font-extrabold uppercase text-[10px] flex items-center gap-1">
                <ExternalLink size={12} /> Submission URL
              </span>
              <a
                href={submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-black text-purple-600 dark:text-purple-400 hover:underline break-all"
              >
                <span>{submissionUrl}</span>
                <ExternalLink size={13} />
              </a>

              {submissionNote && (
                <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/60">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase">Student Note</span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{submissionNote}</p>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block font-extrabold text-slate-700 dark:text-slate-300 mb-1">
              Mentor Feedback & Review Remarks
            </label>
            <textarea
              rows={3}
              value={mentorFeedback}
              onChange={(e) => setMentorFeedback(e.target.value)}
              placeholder="Provide constructive feedback or state requested revisions..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            ></textarea>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={() => handleReview('in_progress')}
              className="w-full sm:w-auto px-5 py-2.5 font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RotateCcw size={15} />
              <span>Request Changes</span>
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => handleReview('completed')}
              className="w-full sm:w-auto px-6 py-2.5 font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Reviewing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={15} />
                  <span>Mark Task Completed</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
