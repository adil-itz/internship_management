import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import RatingSummary from '../components/feedback/RatingSummary';
import ReviewList from '../components/feedback/ReviewList';
import StudentCompanyRating from '../components/feedback/StudentCompanyRating';
import { getCompanyRatings } from '../services/feedback.service';
import { getMyApplications } from '../services/application.service';
import { Building2, ArrowLeft, Star, ThumbsUp, AlertCircle } from 'lucide-react';

export default function CompanyProfilePage({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const sessionUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  let activeUser = user;
  if (!activeUser && sessionUserStr && sessionUserStr !== 'undefined' && sessionUserStr !== 'null') {
    try {
      activeUser = JSON.parse(sessionUserStr);
    } catch (e) {}
  }

  const role = activeUser?.role || 'student';

  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEligible, setIsEligible] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCompanyRatingsData(1);
      if (role === 'student') {
        checkEligibility();
      }
    }
  }, [id, role]);

  const fetchCompanyRatingsData = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCompanyRatings(id, { page, limit: 10 });
      if (res && res.success) {
        setSummary(res.summary);
        setReviews(res.reviews || []);
        if (res.pagination) setPagination(res.pagination);
      } else {
        setError('Company details or ratings not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load company rating data');
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    try {
      const res = await getMyApplications();
      if (res && res.success && res.applications) {
        const eligibleApp = res.applications.find(app =>
          app.status === 'selected' &&
          app.internship &&
          (app.internship.company?._id === id || app.internship.company === id)
        );
        if (eligibleApp) {
          setIsEligible(true);
        }
      }
    } catch (e) {}
  };

  return (
    <DashboardLayout user={activeUser} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
                <Building2 size={32} />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Company Overview & Ratings
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Verified student reviews and employer experience ratings
                </p>
              </div>
            </div>

            {isEligible && (
              <button
                onClick={() => setRateModalOpen(true)}
                className="px-6 py-3 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Star size={15} />
                <span>Rate This Company</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading company ratings...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <RatingSummary summary={summary} type="company" />

            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Student Reviews</span>
              </h3>
              <ReviewList
                reviews={reviews}
                pagination={pagination}
                onPageChange={(p) => fetchCompanyRatingsData(p)}
              />
            </div>
          </div>
        )}

        {rateModalOpen && (
          <StudentCompanyRating
            isOpen={true}
            onClose={() => setRateModalOpen(false)}
            companyId={id}
            onSuccess={() => fetchCompanyRatingsData(1)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
