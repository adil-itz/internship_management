import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ApplicationStatusBadge from '../../components/applications/ApplicationStatusBadge';
import InterviewModal from '../../components/applications/InterviewModal';
import RejectCandidateModal from '../../components/applications/RejectCandidateModal';
import AssignMentorModal from '../../components/mentor/AssignMentorModal';
import ConfirmationModal from '../../components/applications/ConfirmationModal';
import { getAllApplicationsAdmin, updateApplicationStatus } from '../../services/application.service';
import { Users, Search, Filter, FileText, Calendar, ExternalLink, AlertCircle, ShieldAlert } from 'lucide-react';

export default function AdminApplications({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [interviewModal, setInterviewModal] = useState({ open: false, app: null });
  const [rejectModal, setRejectModal] = useState({ open: false, app: null });
  const [assignMentorModal, setAssignMentorModal] = useState({ open: false, app: null });
  const [shortlistModal, setShortlistModal] = useState({ open: false, app: null });
  const [selectModal, setSelectModal] = useState({ open: false, app: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllApplicationsAdmin({ status: statusFilter, limit: 50 });
      if (res && res.success) {
        setApplications(res.applications || []);
      } else {
        setError('Failed to fetch applications.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch applications.');
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
        alert(res.message || 'Failed to shortlist.');
      }
    } catch (err) {
      alert(err.message || 'Failed to shortlist.');
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
    const candidateName = app.candidate?.name?.toLowerCase() || '';
    const candidateEmail = app.candidate?.email?.toLowerCase() || '';
    const internshipTitle = app.internship?.title?.toLowerCase() || '';
    const q = searchQuery.toLowerCase();
    return candidateName.includes(q) || candidateEmail.includes(q) || internshipTitle.includes(q);
  });

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="applications">
      <div className="space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert size={24} className="text-blue-500" /> System Applications Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Admin oversight across all internship applications in the platform
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate, email, internship..."
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
            <p className="text-xs font-bold text-slate-400">Loading system applications...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <Users size={32} className="mx-auto text-slate-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No applications found</h3>
            <p className="text-xs text-slate-500">No applications match your search or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Internship</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredApplications.map((app) => {
                  const candidate = app.candidate || {};
                  const internship = app.internship || {};
                  return (
                    <tr key={app._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <p className="font-black text-slate-900 dark:text-white">{candidate.name || 'Candidate'}</p>
                        <p className="text-slate-400 text-[11px]">{candidate.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white">{internship.title || 'N/A'}</p>
                      </td>
                      <td className="p-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>
                      <td className="p-4 font-bold text-slate-600 dark:text-slate-300">
                        {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/applications/${app._id}`)}
                            className="px-3 py-1.5 text-[11px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl cursor-pointer"
                          >
                            View
                          </button>

                          {app.status === 'applied' && (
                            <button
                              onClick={() => setShortlistModal({ open: true, app })}
                              className="px-3 py-1.5 text-[11px] font-extrabold text-amber-700 bg-amber-50 rounded-xl cursor-pointer"
                            >
                              Shortlist
                            </button>
                          )}

                          {(app.status === 'applied' || app.status === 'shortlisted' || app.status === 'interview_scheduled') && (
                            <button
                              onClick={() => setInterviewModal({ open: true, app })}
                              className="px-3 py-1.5 text-[11px] font-extrabold text-purple-700 bg-purple-50 rounded-xl cursor-pointer"
                            >
                              Interview
                            </button>
                          )}

                          {(app.status === 'shortlisted' || app.status === 'interview_scheduled') && (
                            <button
                              onClick={() => setSelectModal({ open: true, app })}
                              className="px-3 py-1.5 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 rounded-xl cursor-pointer"
                            >
                              Select
                            </button>
                          )}

                          {app.status === 'selected' && (
                            <button
                              onClick={() => setAssignMentorModal({ open: true, app })}
                              className="px-3 py-1.5 text-[11px] font-extrabold text-blue-700 bg-blue-50 rounded-xl cursor-pointer"
                            >
                              Assign Mentor
                            </button>
                          )}

                          {!['rejected', 'withdrawn'].includes(app.status) && (
                            <button
                              onClick={() => setRejectModal({ open: true, app })}
                              className="px-3 py-1.5 text-[11px] font-extrabold text-rose-600 bg-rose-50 rounded-xl cursor-pointer"
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
        )}

      </div>

      <ConfirmationModal
        isOpen={shortlistModal.open}
        onClose={() => setShortlistModal({ open: false, app: null })}
        onConfirm={handleShortlist}
        title="Shortlist Candidate?"
        message={`Shortlist ${shortlistModal.app?.candidate?.name}?`}
        confirmText="Shortlist"
        confirmVariant="primary"
        loading={actionLoading}
      />

      <ConfirmationModal
        isOpen={selectModal.open}
        onClose={() => setSelectModal({ open: false, app: null })}
        onConfirm={handleSelect}
        title="Select Candidate?"
        message={`Select ${selectModal.app?.candidate?.name}?`}
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
        internshipId={assignMentorModal.app?.internship?._id || assignMentorModal.app?.internship?.id || assignMentorModal.app?.internship}
        studentId={assignMentorModal.app?.candidate?._id || assignMentorModal.app?.candidate?.id || assignMentorModal.app?.candidate}
        studentName={assignMentorModal.app?.candidate?.name || assignMentorModal.app?.candidate?.email}
        internshipTitle={assignMentorModal.app?.internship?.title}
        onSuccess={() => fetchApplications()}
      />
    </DashboardLayout>
  );
}
