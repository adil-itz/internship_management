import React, { useState } from 'react';
import StarRating from './StarRating';
import { createMentorFinalFeedback } from '../../services/feedback.service';
import { X, Award, Send, Check, AlertCircle, HelpCircle } from 'lucide-react';

export default function MentorFinalEvaluation({
  isOpen,
  onClose,
  studentId,
  studentName = '',
  internshipTitle = '',
  onSuccess
}) {
  const [overall, setOverall] = useState(5);
  const [technicalSkills, setTechnicalSkills] = useState(5);
  const [problemSolving, setProblemSolving] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [teamwork, setTeamwork] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [taskCompletion, setTaskCompletion] = useState(5);
  const [learningAbility, setLearningAbility] = useState(5);
  const [recommendation, setRecommendation] = useState(true);
  const [comments, setComments] = useState('');

  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setConfirming(true);
  };

  const handleFinalConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = {
        ratings: {
          overall,
          technicalSkills,
          problemSolving,
          communication,
          teamwork,
          professionalism,
          taskCompletion,
          learningAbility
        },
        recommendation,
        comments
      };

      const res = await createMentorFinalFeedback(studentId, payload);
      if (res && res.success) {
        setSuccessMsg('Final evaluation submitted successfully.');
        setTimeout(() => {
          if (onSuccess) onSuccess(res.feedback);
          onClose();
        }, 1200);
      } else {
        setError(res?.message || 'Failed to submit final evaluation');
        setConfirming(false);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while submitting');
      setConfirming(false);
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
              <Award size={20} className="text-purple-500" />
              <span>Mentor Final Evaluation</span>
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

        {confirming ? (
          <div className="p-6 text-center space-y-6 flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
              <HelpCircle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Confirm Final Evaluation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Are you sure you want to submit the final evaluation? Once submitted, this evaluation will be recorded permanently.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-700 text-xs font-bold">
                {error}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-4 py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleFinalConfirm}
                className="px-6 py-2.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Yes, Submit Evaluation'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInitialSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
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
                id="final-overall-rating"
              />
              <StarRating
                label="Technical Skills"
                value={technicalSkills}
                onChange={setTechnicalSkills}
                size={18}
                id="final-tech-rating"
              />
              <StarRating
                label="Problem Solving"
                value={problemSolving}
                onChange={setProblemSolving}
                size={18}
                id="final-problem-rating"
              />
              <StarRating
                label="Communication"
                value={communication}
                onChange={setCommunication}
                size={18}
                id="final-comm-rating"
              />
              <StarRating
                label="Teamwork"
                value={teamwork}
                onChange={setTeamwork}
                size={18}
                id="final-team-rating"
              />
              <StarRating
                label="Professionalism"
                value={professionalism}
                onChange={setProfessionalism}
                size={18}
                id="final-prof-rating"
              />
              <StarRating
                label="Task Completion"
                value={taskCompletion}
                onChange={setTaskCompletion}
                size={18}
                id="final-task-rating"
              />
              <StarRating
                label="Learning Ability"
                value={learningAbility}
                onChange={setLearningAbility}
                size={18}
                id="final-learn-rating"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Final Recommendation
              </label>
              <select
                value={recommendation ? 'true' : 'false'}
                onChange={(e) => setRecommendation(e.target.value === 'true')}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
              >
                <option value="true">Recommended for Completion / Hiring</option>
                <option value="false">Not Recommended</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
                Final Comments & Feedback Summary
              </label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Final comments on overall internship performance..."
                maxLength={1000}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/40"
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
                className="px-5 py-2.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send size={14} />
                <span>Submit Final Evaluation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
