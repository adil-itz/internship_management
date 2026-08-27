import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ApplicationStatusBadge from '../../components/applications/ApplicationStatusBadge';
import InterviewModal from '../../components/applications/InterviewModal';
import RejectCandidateModal from '../../components/applications/RejectCandidateModal';
import AssignMentorModal from '../../components/mentor/AssignMentorModal';
import ConfirmationModal from '../../components/applications/ConfirmationModal';
import { getInternshipApplications, updateApplicationStatus } from '../../services/application.service';
import { getInternshipById } from '../../services/internship.service';
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  FileText,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function CompanyInternshipApplications({ darkMode, setDarkMode, user }) {
  const { internshipId } = useParams();
  const navigate = useNavigate();

  const [internship, setInternship] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [interviewModal, setInterviewModal] = useState({ open: false, app: null });
  const [rejectModal, setRejectModal] = useState({ open: false, app: null });
  const [assignMentorModal, setAssignMentorModal] = useState({ open: false, app: null });
  const [shortlistModal, setShortlistModal] = useState({ open: false, app: null });
  const [selectModal, setSelectModal] = useState({ open: false, app: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (internshipId) {
      fetchInternshipDetails();
      fetchApplications();
    }
  }, [internshipId, statusFilter]);

  const fetchInternshipDetails = async () => {
    try {
      const res = await getInternshipById(internshipId);
      if (res && res.success) setInternship(res.internship);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInternshipApplications(internshipId, { status: statusFilter });
      if (res && res.success) {
        setApplications(res.applications || []);
      } else {
        setError('Failed to fetch applicants.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch applicants.');
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async () => {
    if (!shortlistModal.app) return;
    setActionLoading(true);
    try {
      const res = await updateApplicationStatus(shortlistModal.app._id, { status: 'shortlisted' });
      if (res && res.success) {
        fetchApplications();
        setShortlistModal({ open: false, app: null });
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
    if (!selectModal.app) return;
    setActionLoading(true);
    try {
      const res = await updateApplicationStatus(selectModal.app._id, { status: 'selected' });
      if (res && res.success) {
        fetchApplications();
        setSelectModal({ open: false, app: null });
      } else {
        alert(res.message || 'Failed to select candidate.');
      }
    } catch (err) {
      alert(err.message || 'Failed to select candidate.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const candidate = app.candidate || {};
    const name = candidate.name?.toLowerCase() || '';
    const email = candidate.email?.toLowerCase() || '';
    const search = debouncedSearch.toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="manage-internships">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={() => navigate('/company/internships')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to My Internships
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={24} className="text-blue-500" />
              <span>Applicants for {internship?.title || 'Internship'}</span>
            </h1>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-extrabold text-slate-400 flex items-center gap-1 shrink-0">
              <Filter size={14} /> Filter:
            </span>
            {[
              { id: '', label: 'All' },
              { id: 'applied', label: 'Applied' },
              { id: 'shortlisted', label: 'Shortlisted' },
              { id: 'interview_scheduled', label: 'Interview Scheduled' },
              { id: 'selected', label: 'Selected' },
              { id: 'rejected', label: 'Rejected' },
              { id: 'withdrawn', label: 'Withdrawn' }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  statusFilter === st.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading applicants list...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Users size={32} />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No applicants found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {statusFilter || searchQuery ? 'No applicants match the current search or status filter.' : 'No candidates have applied for this internship posting yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="hidden lg:block overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Resume</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredApplications.map((app) => {
                    const candidate = app.candidate || {};
                    return (
                      <tr key={app._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                              {candidate.name ? candidate.name.charAt(0).toUpperCase() : 'C'}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 dark:text-white text-xs">{candidate.name || 'Candidate'}</p>
                              <p className="text-slate-400 text-[11px]">{candidate.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-600 dark:text-slate-300">
                          {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-4">
                          <ApplicationStatusBadge status={app.status} />
                        </td>
                        <td className="p-4">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 font-extrabold inline-flex items-center gap-1 hover:underline text-xs"
                            >
                              <FileText size={14} /> Resume <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">N/A</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/company/applications/${app._id}`)}
                              className="px-3 py-1.5 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl cursor-pointer"
                            >
                              View
                            </button>

                            {app.status === 'applied' && (
                              <button
                                onClick={() => setShortlistModal({ open: true, app })}
                                className="px-3 py-1.5 text-[11px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-xl border border-amber-200 dark:border-amber-800 cursor-pointer"
                              >
                                Shortlist
                              </button>
                            )}

                            {(app.status === 'applied' || app.status === 'shortlisted' || app.status === 'interview_scheduled') && (
                              <button
                                onClick={() => setInterviewModal({ open: true, app })}
                                className="px-3 py-1.5 text-[11px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 rounded-xl border border-purple-200 dark:border-purple-800 cursor-pointer"
                              >
                                Interview
                              </button>
                            )}

                            {(app.status === 'shortlisted' || app.status === 'interview_scheduled') && (
                              <button
                                onClick={() => setSelectModal({ open: true, app })}
                                className="px-3 py-1.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-xl border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                              >
                                Select
                              </button>
                            )}

                            {app.status === 'selected' && (
                              <button
                                onClick={() => setAssignMentorModal({ open: true, app })}
                                className="px-3 py-1.5 text-[11px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl border border-blue-200 dark:border-blue-800 cursor-pointer"
                              >
                                Assign Mentor
                              </button>
                            )}

                            {!['rejected', 'withdrawn'].includes(app.status) && (
                              <button
                                onClick={() => setRejectModal({ open: true, app })}
                                className="px-3 py-1.5 text-[11px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 rounded-xl border border-rose-200 dark:border-rose-800 cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4">
              {filteredApplications.map((app) => {
                const candidate = app.candidate || {};
                return (
                  <div key={app._id} className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0">
                          {candidate.name ? candidate.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-xs">{candidate.name || 'Candidate'}</p>
                          <p className="text-slate-400 text-[11px]">{candidate.email}</p>
                        </div>
                      </div>
                      <ApplicationStatusBadge status={app.status} />
                    </div>

                    <div className="flex items-center justify-between text-xs border-t border-b border-slate-100 dark:border-slate-800 py-2">
                      <span className="text-slate-400 font-medium">Applied: {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-extrabold flex items-center gap-1">
                          Resume <ExternalLink size={12} />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end pt-1">
                      <button
                        onClick={() => navigate(`/company/applications/${app._id}`)}
                        className="px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                      >
                        View
                      </button>

                      {app.status === 'applied' && (
                        <button
                          onClick={() => setShortlistModal({ open: true, app })}
                          className="px-3 py-1.5 text-xs font-extrabold text-amber-700 bg-amber-50 rounded-xl"
                        >
                          Shortlist
                        </button>
                      )}

                      {(app.status === 'applied' || app.status === 'shortlisted' || app.status === 'interview_scheduled') && (
                        <button
                          onClick={() => setInterviewModal({ open: true, app })}
                          className="px-3 py-1.5 text-xs font-extrabold text-purple-700 bg-purple-50 rounded-xl"
                        >
                          Interview
                        </button>
                      )}

                      {(app.status === 'shortlisted' || app.status === 'interview_scheduled') && (
                        <button
                          onClick={() => setSelectModal({ open: true, app })}
                          className="px-3 py-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 rounded-xl"
                        >
                          Select
                        </button>
                      )}

                      {app.status === 'selected' && (
                        <button
                          onClick={() => setAssignMentorModal({ open: true, app })}
                          className="px-3 py-1.5 text-xs font-extrabold text-blue-700 bg-blue-50 rounded-xl"
                        >
                          Assign Mentor
                        </button>
                      )}

                      {!['rejected', 'withdrawn'].includes(app.status) && (
                        <button
                          onClick={() => setRejectModal({ open: true, app })}
                          className="px-3 py-1.5 text-xs font-extrabold text-rose-600 bg-rose-50 rounded-xl"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      <ConfirmationModal
        isOpen={shortlistModal.open}
        onClose={() => setShortlistModal({ open: false, app: null })}
        onConfirm={handleShortlist}
        title="Shortlist Candidate?"
        message={`Shortlist ${shortlistModal.app?.candidate?.name || 'this candidate'} for the next stage?`}
        confirmText="Shortlist Candidate"
        confirmVariant="primary"
        loading={actionLoading}
      />

      <ConfirmationModal
        isOpen={selectModal.open}
        onClose={() => setSelectModal({ open: false, app: null })}
        onConfirm={handleSelect}
        title="Select Candidate?"
        message={`Mark ${selectModal.app?.candidate?.name || 'this candidate'} as Selected for this internship?`}
        confirmText="Select Candidate"
        confirmVariant="success"
        loading={actionLoading}
      />

      <InterviewModal
        isOpen={interviewModal.open}
        onClose={() => setInterviewModal({ open: false, app: null })}
        applicationId={interviewModal.app?._id}
        candidateName={interviewModal.app?.candidate?.name}
        initialInterview={interviewModal.app?.interview}
        onSuccess={() => fetchApplications()}
      />

      <RejectCandidateModal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, app: null })}
        applicationId={rejectModal.app?._id}
        candidateName={rejectModal.app?.candidate?.name}
        onSuccess={() => fetchApplications()}
      />

      <AssignMentorModal
        isOpen={assignMentorModal.open}
        onClose={() => setAssignMentorModal({ open: false, app: null })}
        internshipId={internshipId}
        studentId={assignMentorModal.app?.candidate?._id || assignMentorModal.app?.candidate?.id || assignMentorModal.app?.candidate}
        studentName={assignMentorModal.app?.candidate?.name || assignMentorModal.app?.candidate?.email}
        internshipTitle={internship?.title}
        onSuccess={() => fetchApplications()}
      />
    </DashboardLayout>
  );
}
