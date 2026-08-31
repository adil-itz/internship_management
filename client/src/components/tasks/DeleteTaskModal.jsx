import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { deleteTask } from '../../services/internshipTask.service';

export default function DeleteTaskModal({ isOpen, onClose, onSuccess, task }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !task) return null;

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);

    try {
      const res = await deleteTask(task._id);
      if (res && res.success) {
        onSuccess && onSuccess(task._id);
        onClose();
      } else {
        setError(res.message || 'Failed to delete task');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle size={20} />
            <h3 className="font-black text-base">Delete Task Confirmation</h3>
          </div>
          <button
            onClick={onClose}
            disabled={deleting}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-extrabold">
            {error}
          </div>
        )}

        <div className="space-y-2 text-xs">
          <p className="font-bold text-slate-900 dark:text-white text-sm">
            Are you sure you want to delete this task?
          </p>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-medium">
            <span className="font-extrabold text-slate-900 dark:text-white">{task.title}</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            This action cannot be undone. All task submissions and statistics linked to this task will be permanently removed.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {deleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Delete Task</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
