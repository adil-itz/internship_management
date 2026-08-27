import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ApplicationStatusBadge from '../../components/applications/ApplicationStatusBadge';
import InterviewStatusBadge from '../../components/applications/InterviewStatusBadge';
import ApplicationStatusTimeline from '../../components/applications/ApplicationStatusTimeline';
import ConfirmationModal from '../../components/applications/ConfirmationModal';
import { getApplicationById, withdrawApplication } from '../../services/application.service';
import { getStudentAssignments } from '../../services/mentorAssignment.service';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Video,
  AlertCircle,
  CheckCircle2,
  XCircle,
  UserCheck,
  Award,
  RotateCcw
} from 'lucide-react';

export default function StudentApplicationDetails({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [mentorAssignment, setMentorAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApplicationById(id);
      if (res && res.success) {
        setApplication(res.application);
        if (res.application.status === 'selected') {
          fetchMentorAssignment(res.application.internship?._id);
        }
      } else {
        setError('Application details not found.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorAssignment = async (internshipId) => {
    try {
      const res = await getStudentAssignments();
      if (res && res.success && res.assignments) {
        const found = res.assignments.find((a) => a.internship?._id === internshipId || a.internship === internshipId);
        if (found) setMentorAssignment(found);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      const res = await withdrawApplication(id);
      if (res && res.success) {
        setApplication(res.application);
        setWithdrawModalOpen(false);
      } else {
        alert(res.message || 'Failed to withdraw application');
      }
    } catch (err) {
      alert(err.message || 'Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="p-12 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">Loading application details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="space-y-4 max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/student/applications')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Applications
          </button>
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error || 'Application Not Found'}</h3>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const internship = application.internship || {};
  const companyName = typeof internship.company === 'object' && internship.company !== null ? internship.company.name : 'Company';
  const interview = application.interview;
  const canWithdraw = !['selected', 'rejected', 'withdrawn'].includes(application.status);

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="applications">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/student/applications')}
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} /> Back to Applications
          </button>

          {canWithdraw && (
            <button
              onClick={() => setWithdrawModalOpen(true)}
              className="px-4 py-2 text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl border border-rose-200 dark:border-rose-800 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <RotateCcw size={14} /> Withdraw Application
            </button>
          )}
        </div>

        {application.status === 'selected' && (
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl space-y-2">
            <div className="flex items-center gap-2">
              <Award size={24} />
              <h2 className="text-xl font-black">Congratulations!</h2>
            </div>
            <p className="text-xs text-emerald-100 font-medium">
              You have been selected for the <strong className="text-white">{internship.title}</strong> internship position.
            </p>
          </div>
        )}

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">
                {companyName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-black text-slate-900 dark:text-white">
                  {internship.title || 'Internship Position'}
                </h1>
                <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <Building2 size={14} className="text-blue-500" />
                  <span>{companyName}</span>
                </p>
              </div>
            </div>

            <ApplicationStatusBadge status={application.status} />
          </div>

          <div className="space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-400">Application Progress</h3>
            <ApplicationStatusTimeline
              status={application.status}
              appliedAt={application.appliedAt}
              interviewDate={interview?.date}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {interview && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Calendar size={18} />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">Interview Details</h3>
                  </div>
                  <InterviewStatusBadge status={interview.status || 'scheduled'} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Date & Time</span>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {interview.date ? new Date(interview.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBD'} • {interview.time || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block text-[10px] uppercase">Mode</span>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 capitalize flex items-center gap-1">
                      {interview.mode === 'online' ? <Video size={14} className="text-blue-500" /> : <MapPin size={14} className="text-indigo-500" />}
                      <span>{interview.mode || 'Online'}</span>
                    </p>
                  </div>
                </div>

                {interview.mode === 'online' && interview.meetingLink && (
                  <div className="pt-2">
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      <Video size={14} /> Join Interview Meeting <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {interview.mode === 'offline' && interview.location && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase block">Location</span>
                    <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{interview.location}</p>
                  </div>
                )}

                {interview.notes && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase block">Instructions / Notes</span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{interview.notes}</p>
                  </div>
                )}
              </div>
            )}

            {application.status === 'rejected' && application.rejectionReason && (
              <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-2 text-xs">
                <h4 className="font-extrabold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                  <XCircle size={16} className="text-rose-500" /> Rejection Feedback
                </h4>
                <p className="text-rose-700 dark:text-rose-300 font-medium">{application.rejectionReason}</p>
              </div>
            )}

            {application.status === 'selected' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <UserCheck size={18} className="text-blue-500" /> Assigned Mentor Information
                </h3>

                {mentorAssignment ? (
                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {mentorAssignment.mentor?.name || 'Mentor'}
                        </h4>
                        <p className="text-slate-500 font-medium">{mentorAssignment.mentor?.email}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {mentorAssignment.status}
                      </span>
                    </div>
                    <Link
                      to="/student/mentor"
                      className="inline-flex items-center gap-1 text-blue-600 font-extrabold hover:underline"
                    >
                      View Mentor Details →
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-medium">
                    Mentor: <strong className="text-slate-700 dark:text-slate-300">Not assigned yet</strong>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Cover Letter
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line">
                {application.coverLetter || 'No cover letter provided.'}
              </p>
            </div>

          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-black text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Submitted Resume
              </h3>
              {application.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center justify-between border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} /> View Submitted Resume
                  </span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-xs text-slate-400">No resume link attached.</p>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
              <h3 className="font-black text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Application Summary
              </h3>

              <div className="flex justify-between text-slate-500">
                <span>Applied Date:</span>
                <strong className="text-slate-900 dark:text-white font-extrabold">
                  {new Date(application.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </strong>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Internship Type:</span>
                <strong className="text-slate-900 dark:text-white font-extrabold capitalize">
                  {internship.internshipType || 'N/A'}
                </strong>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Duration:</span>
                <strong className="text-slate-900 dark:text-white font-extrabold">
                  {internship.duration || 'N/A'}
                </strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ConfirmationModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        onConfirm={handleWithdraw}
        title="Withdraw Application?"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmText="Withdraw"
        confirmVariant="danger"
        loading={withdrawing}
      />
    </DashboardLayout>
  );
}
