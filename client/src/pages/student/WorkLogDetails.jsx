import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import WorkLogStatusBadge from '../../components/worklogs/WorkLogStatusBadge';
import { getWorkLogById, submitWorkLog, reviewWorkLog } from '../../services/worklog.service';
import {
  ArrowLeft,
  Clock,
  Briefcase,
  User,
  Calendar,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Edit,
  Send,
  AlertCircle,
  MessageSquare,
  Check,
  Building2,
  FileText
} from 'lucide-react';

export default function WorkLogDetails({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workLog, setWorkLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mentorFeedback, setMentorFeedback] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittingLog, setSubmittingLog] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [notification, setNotification] = useState(null);

  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let activeUser = user;
  if (!activeUser && sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
    try {
      activeUser = JSON.parse(sessionUserStr);
    } catch (e) {}
  }
  const userRole = activeUser?.role || 'student';

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWorkLogById(id);
      if (res && res.success) {
        setWorkLog(res.data);
        if (res.data.mentorFeedback) {
          setMentorFeedback(res.data.mentorFeedback);
        }
      } else {
        setError('Work log not found.');
      }
    } catch (err) {
      setError(err.message || 'Work log not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWorkLog = async () => {
    setSubmittingLog(true);
    try {
      const res = await submitWorkLog(id);
      if (res && res.success) {
        showNotification('Work log submitted successfully.');
        fetchDetails();
      } else {
        alert(res.message || 'Failed to submit work log.');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit work log.');
    } finally {
      setSubmittingLog(false);
    }
  };

  const handleReview = async (newStatus) => {
    setReviewError(null);
    if (newStatus === 'rejected' && (!mentorFeedback || !mentorFeedback.trim())) {
      setReviewError('Please provide feedback explaining why the work log is rejected.');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewWorkLog(id, {
        status: newStatus,
        mentorFeedback: mentorFeedback ? mentorFeedback.trim() : 'Approved'
      });
      if (res && res.success) {
        showNotification(`Work log ${newStatus} successfully.`);
        fetchDetails();
      } else {
        setReviewError(res.message || 'Failed to review work log.');
      }
    } catch (err) {
      setReviewError(err.message || 'Failed to review work log.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const backPath = userRole === 'mentor' ? '/mentor/worklogs' : userRole === 'admin' ? '/admin/worklogs' : '/student/worklogs';

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="my-worklogs">
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in zoom-in-98 duration-300">
        
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Back to Work Logs
        </button>

        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
            <Check size={16} />
            <span>{notification}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading work log details...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error}</h3>
          </div>
        ) : !workLog ? null : (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <WorkLogStatusBadge status={workLog.status} />
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar size={14} /> {formatDate(workLog.date)}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                  {workLog.title}
                </h1>
              </div>

              {userRole === 'student' && (
                <div className="flex items-center gap-2">
                  {workLog.status === 'draft' && (
                    <>
                      <button
                        onClick={() => navigate(`/student/worklogs/${workLog._id}/edit`)}
                        className="px-4 py-2 text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 rounded-xl hover:bg-amber-100 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        disabled={submittingLog}
                        onClick={handleSubmitWorkLog}
                        className="px-4 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                      >
                        <Send size={14} />
                        <span>{submittingLog ? 'Submitting...' : 'Submit'}</span>
                      </button>
                    </>
                  )}

                  {workLog.status === 'rejected' && (
                    <button
                      onClick={() => navigate(`/student/worklogs/${workLog._id}/edit`)}
                      className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit size={14} />
                      <span>Edit & Resubmit</span>
                    </button>
                  )}

                  {workLog.status === 'submitted' && (
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800">
                      Waiting for mentor review
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Internship</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <Briefcase size={14} className="text-blue-500 shrink-0" />
                  <span>{workLog.internshipId?.title || 'Internship'}</span>
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Associated Task</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {workLog.taskId?.title || 'General Work Activity'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Hours Logged</span>
                <p className="font-black text-slate-900 dark:text-white mt-0.5 text-sm flex items-center gap-1">
                  <Clock size={14} className="text-emerald-500" />
                  <span>{workLog.hoursWorked} hours</span>
                </p>
              </div>
            </div>

            {workLog.studentId && (userRole === 'mentor' || userRole === 'admin') && (
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                    {workLog.studentId.name ? workLog.studentId.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Student Candidate</span>
                    <p className="font-black text-slate-900 dark:text-white">{workLog.studentId.name}</p>
                    <p className="text-slate-500 font-semibold">{workLog.studentId.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-white mb-1.5 uppercase text-[11px] tracking-wider">
                  Work Description
                </h3>
                <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap border border-slate-100 dark:border-slate-800">
                  {workLog.description}
                </p>
              </div>

              {workLog.challenges && (
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white mb-1.5 uppercase text-[11px] tracking-wider">
                    Challenges Faced
                  </h3>
                  <p className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/30 text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap border border-amber-100 dark:border-amber-900/40">
                    {workLog.challenges}
                  </p>
                </div>
              )}

              {workLog.learning && (
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white mb-1.5 uppercase text-[11px] tracking-wider">
                    Learning Outcomes
                  </h3>
                  <p className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-wrap border border-emerald-100 dark:border-emerald-900/40">
                    {workLog.learning}
                  </p>
                </div>
              )}

              {workLog.githubLink && (
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white mb-1.5 uppercase text-[11px] tracking-wider">
                    GitHub / Pull Request Link
                  </h3>
                  <a
                    href={workLog.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-extrabold hover:underline"
                  >
                    <span>Open GitHub URL</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            {(workLog.mentorFeedback || workLog.reviewedBy) && (
              <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-purple-200/60 dark:border-purple-800 pb-2">
                  <span className="font-black text-purple-900 dark:text-purple-200 uppercase text-[10px]">
                    Mentor Review & Feedback
                  </span>
                  {workLog.reviewedAt && (
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                      Reviewed on {formatDate(workLog.reviewedAt)}
                    </span>
                  )}
                </div>
                {workLog.mentorFeedback && (
                  <p className="text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                    "{workLog.mentorFeedback}"
                  </p>
                )}
                {workLog.reviewedBy?.name && (
                  <p className="text-[10px] text-purple-700 dark:text-purple-300 font-bold">
                    Reviewed By: {workLog.reviewedBy.name}
                  </p>
                )}
              </div>
            )}

            {(userRole === 'mentor' || userRole === 'admin') && workLog.status === 'submitted' && (
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-4">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare size={16} className="text-purple-500" />
                    <span>Review Work Log</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Provide constructive feedback and choose to approve or reject this submission.</p>
                </div>

                {reviewError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 font-bold">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Mentor Feedback</label>
                  <textarea
                    rows={3}
                    value={mentorFeedback}
                    onChange={(e) => setMentorFeedback(e.target.value)}
                    placeholder="Enter feedback for the student..."
                    className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-medium"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    disabled={submittingReview}
                    onClick={() => handleReview('rejected')}
                    className="px-5 py-2.5 font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-2xl cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    <XCircle size={15} />
                    <span>Reject</span>
                  </button>

                  <button
                    disabled={submittingReview}
                    onClick={() => handleReview('approved')}
                    className="px-6 py-2.5 font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md shadow-emerald-600/30 cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={15} />
                    <span>{submittingReview ? 'Processing...' : 'Approve Work Log'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
