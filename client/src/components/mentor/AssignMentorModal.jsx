import React, { useState, useEffect } from 'react';
import { X, UserCheck, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { assignMentor, getMentors } from '../../services/mentorAssignment.service';

export default function AssignMentorModal({ isOpen, onClose, internshipId, studentId, studentName, internshipTitle, onSuccess }) {
  const [mentors, setMentors] = useState([]);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      setSelectedMentorId('');
      fetchMentors();
    }
  }, [isOpen]);

  const fetchMentors = async () => {
    setLoadingMentors(true);
    try {
      const res = await getMentors();
      if (res && res.success) {
        setMentors(res.mentors || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch available mentors.');
    } finally {
      setLoadingMentors(false);
    }
  };

  if (!isOpen) return null;

  const realStudentId = typeof studentId === 'object' ? (studentId?._id || studentId?.id) : (studentId || '');
  const realStudentName = (typeof studentName === 'string' && studentName) ? studentName : (typeof studentId === 'object' ? (studentId?.name || studentId?.email) : '');
  const realInternshipId = typeof internshipId === 'object' ? (internshipId?._id || internshipId?.id) : (internshipId || '');
  const realInternshipTitle = (typeof internshipTitle === 'string' && internshipTitle) ? internshipTitle : (typeof internshipId === 'object' ? internshipId?.title : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedMentorId) {
      setError('Please select a mentor.');
      return;
    }

    if (!realStudentId) {
      setError('Student ID is missing.');
      return;
    }

    if (!realInternshipId) {
      setError('Internship ID is missing.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await assignMentor({
        internshipId: realInternshipId,
        studentId: realStudentId,
        mentorId: selectedMentorId
      });

      if (res && res.success) {
        setSuccessMsg('Mentor assigned successfully.');
        setTimeout(() => {
          if (onSuccess) onSuccess(res.assignment);
          onClose();
        }, 1200);
      } else {
        setError(res.message || 'Failed to assign mentor.');
      }
    } catch (err) {
      setError(err.message || 'Failed to assign mentor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-0">
        
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck size={20} className="text-blue-500" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Assign Mentor</h3>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
            <p className="text-slate-500 font-medium">
              Student: <strong className="text-slate-900 dark:text-white font-extrabold">{realStudentName || 'Candidate Student'}</strong>
            </p>
            <p className="text-slate-500 font-medium">
              Internship: <strong className="text-slate-900 dark:text-white font-extrabold">{realInternshipTitle || 'Internship'}</strong>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Select Mentor <span className="text-rose-500">*</span>
            </label>
            {loadingMentors ? (
              <div className="py-3 text-center text-xs text-slate-400 font-bold">
                Loading available mentors...
              </div>
            ) : mentors.length === 0 ? (
              <div className="p-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
                No mentors registered in the system yet.
              </div>
            ) : (
              <select
                value={selectedMentorId}
                onChange={(e) => setSelectedMentorId(e.target.value)}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="">-- Choose Mentor --</option>
                {mentors.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loadingMentors || mentors.length === 0}
              className="px-5 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl shadow-md cursor-pointer transition-all"
            >
              {submitting ? 'Assigning...' : 'Assign Mentor'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
