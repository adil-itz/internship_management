import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ApplicationStatusBadge from '../../components/applications/ApplicationStatusBadge';
import { getCompanyInternships } from '../../services/internship.service';
import { getInternshipApplications } from '../../services/application.service';
import { Briefcase, Users, Search, ChevronRight, FileText, ExternalLink, AlertCircle } from 'lucide-react';

export default function CompanyAllApplications({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [selectedInternshipId, setSelectedInternshipId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanyInternships();
  }, []);

  useEffect(() => {
    if (selectedInternshipId) {
      fetchApplications(selectedInternshipId);
    }
  }, [selectedInternshipId]);

  const fetchCompanyInternships = async () => {
    setLoading(true);
    try {
      const res = await getCompanyInternships();
      if (res && res.success && res.internships) {
        setInternships(res.internships);
        if (res.internships.length > 0) {
          setSelectedInternshipId(res.internships[0]._id);
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load company internships.');
      setLoading(false);
    }
  };

  const fetchApplications = async (internshipId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInternshipApplications(internshipId);
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

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="applications">
      <div className="space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={24} className="text-blue-500" /> Internship Applications
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select an internship to view and manage candidate applications
            </p>
          </div>
        </div>

        {internships.length > 0 && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
            <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-300">
              Select Internship Posting:
            </label>
            <select
              value={selectedInternshipId}
              onChange={(e) => setSelectedInternshipId(e.target.value)}
              className="w-full sm:w-96 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              {internships.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.status})
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <Briefcase size={32} className="mx-auto text-slate-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No internships posted yet</h3>
            <p className="text-xs text-slate-500">Post an internship to start receiving candidate applications.</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <Users size={32} className="mx-auto text-slate-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No applications received yet</h3>
            <p className="text-xs text-slate-500">Applications submitted for this internship will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => {
              const candidate = app.candidate || {};
              return (
                <div
                  key={app._id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                        {candidate.name ? candidate.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <h3 className="font-black text-base text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {candidate.name || 'Candidate Name'}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{candidate.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 pt-1">
                      <span>Applied: {new Date(app.appliedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-extrabold flex items-center gap-1">
                          <FileText size={12} /> Resume <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                    <ApplicationStatusBadge status={app.status} />

                    <button
                      onClick={() => navigate(`/company/applications/${app._id}`)}
                      className="px-4 py-2 text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Application</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
