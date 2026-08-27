import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ApplicationStatusBadge from '../../components/applications/ApplicationStatusBadge';
import InterviewStatusBadge from '../../components/applications/InterviewStatusBadge';
import InterviewModal from '../../components/applications/InterviewModal';
import RejectCandidateModal from '../../components/applications/RejectCandidateModal';
import AssignMentorModal from '../../components/mentor/AssignMentorModal';
import ConfirmationModal from '../../components/applications/ConfirmationModal';
import { getApplicationById, updateApplicationStatus } from '../../services/application.service';
import { getInternshipAssignments } from '../../services/mentorAssignment.service';
import {
  ArrowLeft,
  User,
  Mail,
  FileText,
  ExternalLink,
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  UserCheck,
  Building2,
  AlertCircle
} from 'lucide-react';

export default function CompanyApplicationDetails({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [mentorAssignment, setMentorAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [assignMentorModalOpen, setAssignMentorModalOpen] = useState(false);
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getApplicationById(id);
      if (res && res.success) {
        setApplication(res.application);
        if (res.application.status === 'selected') {
          fetchMentorAssignment(res.application.internship?._id, res.application.candidate?._id);
        }
      } else {
        setError('Application details not found.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch application details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentorAssignment = async (internshipId, studentId) => {
    try {
      const res = await getInternshipAssignments(internshipId);
      if (res && res.success && res.assignments) {
        const found = res.assignments.find((a) => (a.student?._id === studentId || a.student === studentId) && a.status === 'active');
        if (found) setMentorAssignment(found);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShortlist = async () => {
    setActionLoading(true);
    try {
      const res = await updateApplicationStatus(id, { status: 'shortlisted' });
      if (res && res.success) {
        setApplication(res.application);
        setShortlistModalOpen(false);
      } else {
        alert(res.message || 'Failed to shortlist candidate.');
      }
    } catch (err) {
      alert(err.message || 'Failed to shortlist candidate.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelect = async () => {
    setActionLoading(true);
    try {
      const res = await updateApplicationStatus(id, { status: 'selected' });
      if (res && res.success) {
        setApplication(res.application);
        setSelectModalOpen(false);
      } else {
        alert(res.message || 'Failed to select candidate.');
      }
    } catch (err) {
      alert(err.message || 'Failed to select candidate.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="p-12 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">Loading candidate details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="space-y-4 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error || 'Application Not Found'}</h3>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const candidate = application.candidate || {};
  const internship = application.internship || {};
  const interview = application.interview;

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="applications">
      <div className="space-y-6 max-w-5xl mx-auto">
        
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Back to Applicants List
        </button>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
                {candidate.name ? candidate.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {candidate.name || 'Candidate Name'}
                </h1>
                <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <Mail size={14} className="text-blue-500" />
                  <span>{candidate.email}</span>
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Applying for: <strong className="text-slate-700 dark:text-slate-300 font-extrabold">{internship.title}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ApplicationStatusBadge status={application.status} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {application.status === 'applied' && (
              <button
                onClick={() => setShortlistModalOpen(true)}
                className="px-4 py-2 text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <UserCheck size={14} /> Shortlist Candidate
              </button>
            )}

            {(application.status === 'applied' || application.status === 'shortlisted' || application.status === 'interview_scheduled') && (
              <button
                onClick={() => setInterviewModalOpen(true)}
                className="px-4 py-2 text-xs font-extrabold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Calendar size={14} /> {interview ? 'Manage Interview' : 'Schedule Interview'}
              </button>
            )}

            {(application.status === 'shortlisted' || application.status === 'interview_scheduled') && (
              <button
                onClick={() => setSelectModalOpen(true)}
                className="px-4 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} /> Select Candidate
              </button>
            )}

            {application.status === 'selected' && (
              <button
                onClick={() => setAssignMentorModalOpen(true)}
                className="px-4 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
              >
                <UserCheck size={14} /> Assign Mentor
              </button>
            )}

            {!['rejected', 'withdrawn'].includes(application.status) && (
              <button
                onClick={() => setRejectModalOpen(true)}
                className="px-4 py-2 text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 rounded-xl border border-rose-200 dark:border-rose-800 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <XCircle size={14} /> Reject Candidate
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {interview && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/60 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Calendar size={18} />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">Scheduled Interview</h3>
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
                  <div className="pt-1">
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <Video size={14} /> Open Meeting Link <ExternalLink size={12} />
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
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase block">Notes</span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{interview.notes}</p>
                  </div>
                )}
              </div>
            )}

            {application.status === 'selected' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                <h3 className="font-black text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <UserCheck size={18} className="text-blue-500" /> Mentor Assignment Status
                </h3>

                {mentorAssignment ? (
                  <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2 text-xs">
                    <p className="font-extrabold text-slate-900 dark:text-white">
                      Assigned Mentor: {mentorAssignment.mentor?.name} ({mentorAssignment.mentor?.email})
                    </p>
                    <p className="text-slate-500 font-medium">Status: {mentorAssignment.status}</p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-500 font-medium">No mentor assigned to this candidate yet.</span>
                    <button
                      onClick={() => setAssignMentorModalOpen(true)}
                      className="px-3.5 py-1.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer"
                    >
                      Assign Mentor
                    </button>
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
                Candidate Resume
              </h3>
              {application.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold text-xs flex items-center justify-between border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} /> Open Candidate Resume
                  </span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <p className="text-xs text-slate-400">No resume URL available.</p>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 text-xs">
              <h3 className="font-black text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Application Meta
              </h3>

              <div className="flex justify-between text-slate-500">
                <span>Applied Date:</span>
                <strong className="text-slate-900 dark:text-white font-extrabold">
                  {new Date(application.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </strong>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Internship Title:</span>
                <strong className="text-slate-900 dark:text-white font-extrabold truncate max-w-[150px]">
                  {internship.title || 'N/A'}
                </strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      <ConfirmationModal
        isOpen={shortlistModalOpen}
        onClose={() => setShortlistModalOpen(false)}
        onConfirm={handleShortlist}
        title="Shortlist Candidate?"
        message={`Shortlist ${candidate.name} for this position?`}
        confirmText="Shortlist"
        confirmVariant="primary"
        loading={actionLoading}
      />

      <ConfirmationModal
        isOpen={selectModalOpen}
        onClose={() => setSelectModalOpen(false)}
        onConfirm={handleSelect}
        title="Select Candidate?"
        message={`Mark ${candidate.name} as Selected for this internship?`}
        confirmText="Select Candidate"
        confirmVariant="success"
        loading={actionLoading}
      />

      <InterviewModal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        applicationId={id}
        candidateName={candidate.name}
        initialInterview={interview}
        onSuccess={() => fetchApplicationDetails()}
      />

      <RejectCandidateModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        applicationId={id}
        candidateName={candidate.name}
        onSuccess={() => fetchApplicationDetails()}
      />

      <AssignMentorModal
        isOpen={assignMentorModalOpen}
        onClose={() => setAssignMentorModalOpen(false)}
        internshipId={internship._id || internship.id || internship}
        studentId={candidate._id || candidate.id || candidate}
        studentName={candidate.name || candidate.email}
        internshipTitle={internship.title}
        onSuccess={() => fetchApplicationDetails()}
      />
    </DashboardLayout>
  );
}
