import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StarRating from '../../components/feedback/StarRating';
import StudentInternshipRating from '../../components/feedback/StudentInternshipRating';
import StudentCompanyRating from '../../components/feedback/StudentCompanyRating';
import { getStudentFeedback } from '../../services/feedback.service';
import { getMyApplications } from '../../services/application.service';
import { Star, Building2, Briefcase, UserCheck, CheckCircle2, Clock, AlertCircle, Eye, Edit, Award } from 'lucide-react';

export default function StudentFeedback({ darkMode, setDarkMode, user }) {
  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let activeUser = user;
  if (!activeUser && sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
    try {
      activeUser = JSON.parse(sessionUserStr);
    } catch (e) {}
  }

  const studentId = activeUser?.id || activeUser?._id;

  const [applications, setApplications] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rateInternshipModal, setRateInternshipModal] = useState(null);
  const [rateCompanyModal, setRateCompanyModal] = useState(null);
  const [viewEvalModal, setViewEvalModal] = useState(null);

  useEffect(() => {
    if (studentId) {
      fetchData();
    }
  }, [studentId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appRes, fbRes] = await Promise.all([
        getMyApplications(),
        getStudentFeedback(studentId)
      ]);

      if (appRes && appRes.success) {
        setApplications(appRes.applications || []);
      }
      if (fbRes && fbRes.success) {
        setFeedbacks(fbRes.feedbacks || []);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load feedback data.');
    } finally {
      setLoading(false);
    }
  };

  const selectedApplications = applications.filter(a => a.status === 'selected');

  const getSubmittedFeedback = (type, internshipId, companyId) => {
    return feedbacks.find(f => {
      if (f.type !== type) return false;

      const fIntId = f.internshipId?._id ? f.internshipId._id.toString() : f.internshipId?.toString();
      const targetIntId = internshipId?._id ? internshipId._id.toString() : internshipId?.toString();
      const fCompId = f.companyId?._id ? f.companyId._id.toString() : f.companyId?.toString();
      const targetCompId = companyId?._id ? companyId._id.toString() : companyId?.toString();

      if (type === 'company_rating') {
        if (targetCompId && fCompId && targetCompId === fCompId) return true;
        if (targetIntId && fIntId && targetIntId === fIntId) return true;
        return false;
      }

      return targetIntId && fIntId && targetIntId === fIntId;
    });
  };

  const mentorFeedbacks = feedbacks.filter(f => f.reviewerRole === 'mentor');
  const companyFeedbacks = feedbacks.filter(f => f.reviewerRole === 'company');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout user={activeUser} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="feedback">
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Star size={24} className="text-amber-500 fill-amber-400" />
            <span>My Feedback & Evaluations</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Rate your completed internships and view evaluations received from mentors and employers
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading your feedback records...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <Briefcase size={18} className="text-blue-500" />
                <span>My Internship Feedback</span>
              </h2>

              {selectedApplications.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
                  <Briefcase size={28} className="mx-auto text-slate-400" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">No Participated Internships Yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Rating features become available once you have been selected for an internship.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplications.map((app) => {
                    const internship = app.internship || {};
                    const intId = internship._id || internship;
                    const existingRating = getSubmittedFeedback('internship_rating', intId);

                    return (
                      <div
                        key={app._id}
                        className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-black text-sm text-slate-900 dark:text-white">
                              {internship.title || 'Internship'}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              {typeof internship.company === 'object' && internship.company?.name ? internship.company.name : 'Company'}
                            </p>
                          </div>

                          {existingRating ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 size={12} /> Submitted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              <Clock size={12} /> Pending Review
                            </span>
                          )}
                        </div>

                        {existingRating ? (
                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-600 dark:text-slate-400">Your Rating</span>
                              <div className="flex items-center gap-1">
                                <StarRating value={existingRating.ratings?.overall || 5} readOnly size={14} showLabel={false} />
                                <span className="text-amber-500 font-black">{existingRating.ratings?.overall || 5}.0</span>
                              </div>
                            </div>
                            {existingRating.comments && (
                              <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                                "{existingRating.comments}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400">
                            Share your experience with tasks, mentorship, and environment.
                          </p>
                        )}

                        <button
                          onClick={() => setRateInternshipModal({ app, existingFeedback: existingRating })}
                          className={`w-full py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            existingRating
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                          }`}
                        >
                          {existingRating ? <Edit size={14} /> : <Star size={14} />}
                          <span>{existingRating ? 'Edit Review' : 'Rate Internship'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <Building2 size={18} className="text-indigo-500" />
                <span>My Company Feedback</span>
              </h2>

              {selectedApplications.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-2">
                  <Building2 size={28} className="mx-auto text-slate-400" />
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">No Companies to Review</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    You can rate companies after participating in their internships.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplications.map((app) => {
                    const internship = app.internship || {};
                    const intId = internship._id || internship;
                    const compRaw = internship.company;
                    const compObj = typeof compRaw === 'object' && compRaw !== null ? compRaw : null;
                    const companyId = compObj?._id || (typeof compRaw === 'string' ? compRaw : null);
                    
                    const existingRating = getSubmittedFeedback('company_rating', intId, companyId);
                    
                    const companyName = compObj?.name || existingRating?.companyId?.name || 'Company';

                    return (
                      <div
                        key={`company-${app._id}`}
                        className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-black text-sm text-slate-900 dark:text-white">
                              {companyName}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                              Role: {internship.title || 'Intern'}
                            </p>
                          </div>

                          {existingRating ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 size={12} /> Submitted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              <Clock size={12} /> Not Reviewed Yet
                            </span>
                          )}
                        </div>

                        {existingRating ? (
                          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-600 dark:text-slate-400">Your Company Rating</span>
                              <div className="flex items-center gap-1">
                                <StarRating value={existingRating.ratings?.overall || 5} readOnly size={14} showLabel={false} />
                                <span className="text-amber-500 font-black">{existingRating.ratings?.overall || 5}.0</span>
                              </div>
                            </div>
                            {existingRating.comments && (
                              <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                                "{existingRating.comments}"
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400">
                            Rate culture, growth, mentorship, and management at this employer.
                          </p>
                        )}

                        <button
                          onClick={() => setRateCompanyModal({ companyId, companyName, existingFeedback: existingRating })}
                          className={`w-full py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            existingRating
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                          }`}
                        >
                          {existingRating ? <Edit size={14} /> : <Building2 size={14} />}
                          <span>{existingRating ? 'Edit Company Review' : 'Rate Company'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
                <UserCheck size={18} className="text-purple-500" />
                <span>Professional Feedback Received</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <UserCheck size={16} className="text-blue-500" />
                      <span>Mentor Evaluations</span>
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {mentorFeedbacks.length} Received
                    </span>
                  </div>

                  {mentorFeedbacks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No mentor feedback available yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {mentorFeedbacks.map((fb) => (
                        <div key={fb._id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-extrabold capitalize text-slate-900 dark:text-white">
                              {fb.type?.replace('mentor_', '')} Evaluation
                            </span>
                            <p className="text-[10px] text-slate-400">By {fb.reviewerId?.name || 'Mentor'} • {formatDate(fb.createdAt)}</p>
                          </div>
                          <button
                            onClick={() => setViewEvalModal(fb)}
                            className="px-3 py-1 text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 rounded-lg cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Award size={16} className="text-purple-500" />
                      <span>Company Final Evaluations</span>
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                      {companyFeedbacks.length} Received
                    </span>
                  </div>

                  {companyFeedbacks.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No final company evaluation available yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {companyFeedbacks.map((fb) => (
                        <div key={fb._id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white">
                              Final Evaluation
                            </span>
                            <p className="text-[10px] text-slate-400">By {fb.companyId?.name || 'Company'} • {formatDate(fb.createdAt)}</p>
                          </div>
                          <button
                            onClick={() => setViewEvalModal(fb)}
                            className="px-3 py-1 text-[11px] font-extrabold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 rounded-lg cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {rateInternshipModal && (
        <StudentInternshipRating
          isOpen={true}
          onClose={() => setRateInternshipModal(null)}
          internshipId={rateInternshipModal.app?.internship?._id || rateInternshipModal.app?.internship}
          internshipTitle={rateInternshipModal.app?.internship?.title}
          existingFeedback={rateInternshipModal.existingFeedback}
          onSuccess={() => fetchData()}
        />
      )}

      {rateCompanyModal && (
        <StudentCompanyRating
          isOpen={true}
          onClose={() => setRateCompanyModal(null)}
          companyId={rateCompanyModal.companyId}
          companyName={rateCompanyModal.companyName}
          existingFeedback={rateCompanyModal.existingFeedback}
          onSuccess={() => fetchData()}
        />
      )}

      {viewEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white capitalize">
                {viewEvalModal.type?.replace('_', ' ')} Details
              </h3>
              <button
                onClick={() => setViewEvalModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Reviewer:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {viewEvalModal.reviewerId?.name || viewEvalModal.reviewerRole}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Overall Rating:</span>
                <div className="flex items-center gap-1">
                  <StarRating value={viewEvalModal.ratings?.overall || 5} readOnly size={14} showLabel={false} />
                  <span className="font-black text-amber-500">{viewEvalModal.ratings?.overall}.0</span>
                </div>
              </div>

              {viewEvalModal.ratings && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400">Category Breakdown</span>
                  {Object.entries(viewEvalModal.ratings).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px] capitalize">
                      <span className="text-slate-600 dark:text-slate-400">{k}:</span>
                      <strong className="text-slate-900 dark:text-white">{v} / 5</strong>
                    </div>
                  ))}
                </div>
              )}

              {viewEvalModal.comments && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold">Comments:</span>
                  <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    "{viewEvalModal.comments}"
                  </p>
                </div>
              )}

              {viewEvalModal.ppoEligible !== undefined && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-extrabold flex justify-between">
                  <span>PPO Eligibility:</span>
                  <span>{viewEvalModal.ppoEligible ? 'Eligible for PPO' : 'Not Eligible'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
