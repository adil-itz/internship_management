import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import CompanyFinalEvaluation from '../../components/feedback/CompanyFinalEvaluation';
import { getCompanyInternships } from '../../services/internship.service';
import { getInternshipApplications } from '../../services/application.service';
import { Building2, Users, Award, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function CompanyFeedback({ darkMode, setDarkMode, user }) {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [finalEvalModal, setFinalEvalModal] = useState(null);

  useEffect(() => {
    fetchCompanyInterns();
  }, []);

  const fetchCompanyInterns = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobsRes = await getCompanyInternships();
      if (jobsRes && jobsRes.success && jobsRes.internships) {
        const appsPromises = jobsRes.internships.map(job => getInternshipApplications(job._id));
        const appsResults = await Promise.all(appsPromises);

        const allInterns = [];
        jobsRes.internships.forEach((job, idx) => {
          const res = appsResults[idx];
          if (res && res.success && res.applications) {
            res.applications.forEach(app => {
              if (app.status === 'selected') {
                allInterns.push({
                  ...app,
                  internship: job
                });
              }
            });
          }
        });
        setInterns(allInterns);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch company interns.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="feedback">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 size={24} className="text-blue-500" />
            <span>Intern Final Evaluation</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Conduct final performance evaluations and record PPO eligibility for completed interns
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading company interns...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : interns.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <Users size={32} className="mx-auto text-slate-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No eligible interns found</h3>
            <p className="text-xs text-slate-500">Only selected/participating interns are eligible for final company evaluations.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interns.map((app) => {
              const candidate = app.candidate || {};
              const internship = app.internship || {};
              const titleText = typeof internship === 'object' ? internship.title : '';

              return (
                <div
                  key={app._id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                      {candidate.name ? candidate.name.charAt(0).toUpperCase() : 'I'}
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900 dark:text-white">
                        {candidate.name || 'Intern Name'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{candidate.email}</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Internship Posting</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{titleText || 'N/A'}</p>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold pt-1">
                      <CheckCircle2 size={12} /> Status: Participating / Selected
                    </div>
                  </div>

                  <button
                    onClick={() => setFinalEvalModal({ studentId: candidate._id, studentName: candidate.name, internshipTitle: titleText })}
                    className="w-full py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Award size={14} />
                    <span>Give Final Evaluation</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {finalEvalModal && (
          <CompanyFinalEvaluation
            isOpen={true}
            onClose={() => setFinalEvalModal(null)}
            studentId={finalEvalModal.studentId}
            studentName={finalEvalModal.studentName}
            internshipTitle={finalEvalModal.internshipTitle}
            onSuccess={() => fetchCompanyInterns()}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
