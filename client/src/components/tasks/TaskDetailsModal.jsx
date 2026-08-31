import React from 'react';
import { X, ExternalLink, Calendar, User, Briefcase, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import TaskStatusBadge from './TaskStatusBadge';
import TaskPriorityBadge from './TaskPriorityBadge';
import TaskProgressBar from './TaskProgressBar';

export default function TaskDetailsModal({ isOpen, onClose, task }) {
  if (!isOpen || !task) return null;

  const studentName = task.student?.name || 'N/A';
  const studentEmail = task.student?.email || '';
  const mentorName = task.mentor?.name || 'N/A';
  const mentorEmail = task.mentor?.email || '';
  const internshipTitle = task.internship?.title || 'N/A';
  const companyName = task.internship?.company || 'Company';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TaskPriorityBadge priority={task.priority} />
              <TaskStatusBadge status={task.status} />
            </div>
            <h2 className="font-black text-xl text-slate-900 dark:text-white mt-1">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-extrabold uppercase text-[10px]">Description</span>
            <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <TaskProgressBar progress={task.progress} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-slate-400 font-extrabold uppercase text-[10px] flex items-center gap-1">
                <User size={12} className="text-blue-500" /> Student
              </span>
              <div>
                <p className="font-black text-slate-900 dark:text-white">{studentName}</p>
                <p className="text-slate-500 text-[11px]">{studentEmail}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-slate-400 font-extrabold uppercase text-[10px] flex items-center gap-1">
                <User size={12} className="text-purple-500" /> Mentor
              </span>
              <div>
                <p className="font-black text-slate-900 dark:text-white">{mentorName}</p>
                <p className="text-slate-500 text-[11px]">{mentorEmail}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-slate-400 font-extrabold uppercase text-[10px] flex items-center gap-1">
              <Briefcase size={12} className="text-emerald-500" /> Internship
            </span>
            <p className="font-black text-slate-900 dark:text-white">{internshipTitle}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px]">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[9px]">Due Date</span>
              <p className="font-extrabold text-slate-900 dark:text-white">{formatDate(task.dueDate)}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[9px]">Created</span>
              <p className="font-extrabold text-slate-900 dark:text-white">{formatDate(task.createdAt)}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[9px]">Submitted</span>
              <p className="font-extrabold text-slate-900 dark:text-white">{formatDate(task.submittedAt)}</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[9px]">Reviewed</span>
              <p className="font-extrabold text-slate-900 dark:text-white">{formatDate(task.reviewedAt)}</p>
            </div>
          </div>

          {task.submissionUrl && (
            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-2">
              <span className="text-purple-700 dark:text-purple-300 font-extrabold uppercase text-[10px] flex items-center gap-1">
                <ExternalLink size={12} /> Student Submission Link
              </span>
              <a
                href={task.submissionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-black text-purple-600 dark:text-purple-400 hover:underline break-all"
              >
                <span>{task.submissionUrl}</span>
                <ExternalLink size={13} />
              </a>

              {task.submissionNote && (
                <div className="pt-2 border-t border-purple-200/60 dark:border-purple-900/60">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-[10px] uppercase">Submission Note</span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{task.submissionNote}</p>
                </div>
              )}
            </div>
          )}

          {task.mentorFeedback && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-1">
              <span className="text-blue-700 dark:text-blue-300 font-extrabold uppercase text-[10px] flex items-center gap-1">
                <MessageSquare size={12} /> Mentor Feedback
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{task.mentorFeedback}</p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
