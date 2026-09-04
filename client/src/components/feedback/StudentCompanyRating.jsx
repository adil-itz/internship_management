import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { createCompanyRating, updateFeedback } from '../../services/feedback.service';
import { X, Building2, Send, Check, AlertCircle } from 'lucide-react';

export default function StudentCompanyRating({
  isOpen,
  onClose,
  companyId,
  companyName = '',
  existingFeedback = null,
  onSuccess
}) {
  const [overall, setOverall] = useState(5);
  const [companyCulture, setCompanyCulture] = useState(5);
  const [workEnvironment, setWorkEnvironment] = useState(5);
  const [mentorSupport, setMentorSupport] = useState(5);
  const [professionalGrowth, setProfessionalGrowth] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [internshipManagement, setInternshipManagement] = useState(5);
  const [recommendation, setRecommendation] = useState(true);
  const [comments, setComments] = useState('');
  const [visibility, setVisibility] = useState('public');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (existingFeedback) {
      const r = existingFeedback.ratings || {};
      setOverall(r.overall || 5);
      setCompanyCulture(r.companyCulture || 5);
      setWorkEnvironment(r.workEnvironment || 5);
      setMentorSupport(r.mentorSupport || 5);
      setProfessionalGrowth(r.professionalGrowth || 5);
      setCommunication(r.communication || 5);
      setInternshipManagement(r.internshipManagement || 5);
      setRecommendation(existingFeedback.recommendation !== false);
      setComments(existingFeedback.comments || '');
      setVisibility(existingFeedback.visibility || 'public');
    }
  }, [existingFeedback, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!overall || overall < 1) {
      setError('Please select an overall rating.');
      return;
    }

    if (!companyId && !existingFeedback?._id) {
      setError('Company information not available for rating.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ratings: {
          overall,
          companyCulture,
          workEnvironment,
          mentorSupport,
          professionalGrowth,
          communication,
          internshipManagement
        },
        recommendation,
        comments,
        visibility
      };

      let res;
      if (existingFeedback?._id) {
        res = await updateFeedback(existingFeedback._id, payload);
      } else {
        res = await createCompanyRating(companyId, payload);
      }

      if (res && res.success) {
        setSuccessMsg(existingFeedback ? 'Company review updated successfully.' : 'Company review submitted successfully.');
        setTimeout(() => {
          if (onSuccess) onSuccess(res.feedback);
          onClose();
        }, 1200);
      } else {
        setError(res?.message || 'Failed to submit company review');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while submitting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 size={20} className="text-blue-500" />
              <span>{existingFeedback ? 'Edit Company Review' : 'Rate Your Company'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Share your experience working with this company. {companyName && `(${companyName})`}
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
              label="Overall Company Experience"
              value={overall}
              onChange={setOverall}
              size={24}
              id="company-overall-rating"
            />
            <StarRating
              label="Company Culture"
              value={companyCulture}
              onChange={setCompanyCulture}
              size={20}
              id="culture-rating"
            />
            <StarRating
              label="Work Environment"
              value={workEnvironment}
              onChange={setWorkEnvironment}
              size={20}
              id="work-env-rating"
            />
            <StarRating
              label="Mentor Support"
              value={mentorSupport}
              onChange={setMentorSupport}
              size={20}
              id="mentor-rating"
            />
            <StarRating
              label="Professional Growth"
              value={professionalGrowth}
              onChange={setProfessionalGrowth}
              size={20}
              id="growth-rating"
            />
            <StarRating
              label="Communication"
              value={communication}
              onChange={setCommunication}
              size={20}
              id="comm-rating"
            />
            <StarRating
              label="Internship Management"
              value={internshipManagement}
              onChange={setInternshipManagement}
              size={20}
              id="mgmt-rating"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Would you recommend this company to other interns?
            </label>
            <div className="flex items-center gap-4 text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
                <input
                  type="radio"
                  name="companyRecommendation"
                  checked={recommendation === true}
                  onChange={() => setRecommendation(true)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
                <input
                  type="radio"
                  name="companyRecommendation"
                  checked={recommendation === false}
                  onChange={() => setRecommendation(false)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Company Feedback & Comments
            </label>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="What did you like about the company? What could the company improve?"
              maxLength={1000}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Review Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-bold"
            >
              <option value="public">Public (Visible to students & employers)</option>
              <option value="private">Anonymous / Private</option>
            </select>
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
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
              <span>{loading ? 'Submitting...' : existingFeedback ? 'Edit Company Review' : 'Submit Company Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
