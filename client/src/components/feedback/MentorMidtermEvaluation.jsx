import React, { useState } from 'react';
import StarRating from './StarRating';
import { createMentorMidtermFeedback } from '../../services/feedback.service';
import { X, Award, Send, Check, AlertCircle } from 'lucide-react';

export default function MentorMidtermEvaluation({
  isOpen,
  onClose,
  studentId,
  studentName = '',
  internshipTitle = '',
  onSuccess
}) {
  const [overall, setOverall] = useState(4);
  const [technicalSkills, setTechnicalSkills] = useState(4);
  const [communication, setCommunication] = useState(4);
  const [taskCompletion, setTaskCompletion] = useState(4);
  const [problemSolving, setProblemSolving] = useState(4);
  const [learningAbility, setLearningAbility] = useState(4);
  const [recommendation, setRecommendation] = useState(true);
  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    setLoading(true);
    try {
      const payload = {
        ratings: {
          overall,
          technicalSkills,
          communication,
          taskCompletion,
          problemSolving,
          learningAbility
        },
        recommendation,
        comments
      };

      const res = await createMentorMidtermFeedback(studentId, payload);
      if (res && res.success) {
        setSuccessMsg('Midterm evaluation submitted successfully.');
        setTimeout(() => {
          if (onSuccess) onSuccess(res.feedback);
          onClose();
        }, 1200);
      } else {
        setError(res?.message || 'Failed to submit midterm evaluation');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while submitting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award size={20} className="text-indigo-500" />
              <span>Midterm Evaluation</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Student: <strong className="text-slate-900 dark:text-white">{studentName}</strong> {internshipTitle && `• ${internshipTitle}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-4">
            <StarRating
              label="Overall Performance"
              value={overall}
              onChange={setOverall}
              size={22}
              id="midterm-overall-rating"
            />
            <StarRating
              label="Technical Skills"
              value={technicalSkills}
              onChange={setTechnicalSkills}
              size={18}
              id="midterm-tech-rating"
            />
            <StarRating
              label="Communication"
              value={communication}
              onChange={setCommunication}
              size={18}
              id="midterm-comm-rating"
            />
            <StarRating
              label="Task Completion"
              value={taskCompletion}
              onChange={setTaskCompletion}
              size={18}
              id="midterm-task-rating"
            />
            <StarRating
              label="Problem Solving"
              value={problemSolving}
              onChange={setProblemSolving}
              size={18}
              id="midterm-problem-rating"
            />
            <StarRating
              label="Learning Progress"
              value={learningAbility}
              onChange={setLearningAbility}
              size={18}
              id="midterm-learn-rating"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Midterm Recommendation
            </label>
            <select
              value={recommendation ? 'true' : 'false'}
              onChange={(e) => setRecommendation(e.target.value === 'true')}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
            >
              <option value="true">Meets / Exceeds Expectations (Recommended)</option>
              <option value="false">Needs Improvement (Not Recommended)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Midterm Comments & Assessment
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide midterm assessment details..."
              maxLength={1000}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
              <span>{loading ? 'Submitting...' : 'Submit Midterm Evaluation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
