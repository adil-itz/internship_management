import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StarRating from '../../components/feedback/StarRating';
import { getAdminFeedback, deleteFeedback } from '../../services/feedback.service';
import {
  ShieldAlert,
  Star,
  Building2,
  Briefcase,
  UserCheck,
  Award,
  Filter,
  Trash2,
  Eye,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export default function AdminFeedback({ darkMode, setDarkMode, user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [viewModalItem, setViewModalItem] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchAdminFeedbacks();
  }, [typeFilter, currentPage]);

  const fetchAdminFeedbacks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminFeedback({
        page: currentPage,
        limit: 10,
        type: typeFilter || undefined
      });

      if (res && res.success) {
        setFeedbacks(res.feedbacks || []);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      } else {
        setError('Failed to fetch admin feedback records.');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch feedback records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalItem) return;
    setIsDeleting(true);
    try {
      const res = await deleteFeedback(deleteModalItem._id);
      if (res && res.success) {
        showNotification('Review deleted successfully.');
        setDeleteModalItem(null);
        fetchAdminFeedbacks();
      } else {
        setError(res?.message || 'Failed to delete review');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalReviewsCount = pagination.total || feedbacks.length;
  const internshipCount = feedbacks.filter(f => f.type === 'internship_rating').length;
  const companyCount = feedbacks.filter(f => f.type === 'company_rating').length;
  const mentorCount = feedbacks.filter(f => f.reviewerRole === 'mentor').length;
  const companyEvalCount = feedbacks.filter(f => f.type === 'company_final').length;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="feedback">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert size={24} className="text-blue-500" />
            <span>Feedback & Rating Moderation</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor, inspect, and moderate student ratings, company reviews, and mentor evaluations platform-wide
          </p>
        </div>

        {notification && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 animate-in fade-in">
            <Check size={16} />
            <span>{notification}</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MessageSquare size={12} /> Total Reviews
            </span>
            <p className="font-black text-xl text-slate-900 dark:text-white">{totalReviewsCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 flex items-center gap-1">
              <Star size={12} /> Internship Reviews
            </span>
            <p className="font-black text-xl text-amber-500">{internshipCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-1">
              <Building2 size={12} /> Company Reviews
            </span>
            <p className="font-black text-xl text-blue-500">{companyCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500 flex items-center gap-1">
              <UserCheck size={12} /> Mentor Evaluations
            </span>
            <p className="font-black text-xl text-indigo-500">{mentorCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-500 flex items-center gap-1">
              <Award size={12} /> Company Evaluations
            </span>
            <p className="font-black text-xl text-purple-500">{companyEvalCount}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Filter size={16} className="text-slate-400" />
            <label className="font-bold text-slate-700 dark:text-slate-300">Filter Feedback Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-extrabold focus:outline-none"
            >
              <option value="">All Feedback Types</option>
              <option value="internship_rating">Internship Ratings</option>
              <option value="company_rating">Company Ratings</option>
              <option value="mentor_ongoing">Mentor Ongoing</option>
              <option value="mentor_midterm">Mentor Midterm</option>
              <option value="mentor_final">Mentor Final</option>
              <option value="company_final">Company Final</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-400">Loading feedback data...</p>
          </div>
        ) : error ? (
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <p className="font-extrabold text-sm">{error}</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <MessageSquare size={32} className="mx-auto text-slate-400" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">No feedback records found</h3>
            <p className="text-xs text-slate-500">Feedback entries submitted by students, mentors, or companies will appear here.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Reviewer</th>
                    <th className="py-4 px-5">Type</th>
                    <th className="py-4 px-5">Company / Internship</th>
                    <th className="py-4 px-5">Rating</th>
                    <th className="py-4 px-5">Recommendation</th>
                    <th className="py-4 px-5">Date</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {feedbacks.map((item) => {
                    const reviewerName = item.reviewerId?.name || item.reviewerRole || 'User';
                    const companyName = item.companyId?.name || 'N/A';
                    const internshipTitle = item.internshipId?.title || 'N/A';
                    const score = item.ratings?.overall || 'N/A';

                    return (
                      <tr key={item._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors">
                        <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                          <div>{reviewerName}</div>
                          <span className="text-[10px] text-slate-400 capitalize font-semibold">{item.reviewerRole}</span>
                        </td>

                        <td className="py-4 px-5 capitalize font-extrabold text-blue-600 dark:text-blue-400">
                          {item.type?.replace('_', ' ')}
                        </td>

                        <td className="py-4 px-5 max-w-xs">
                          <div className="font-extrabold text-slate-900 dark:text-white line-clamp-1">{internshipTitle}</div>
                          <div className="text-slate-400 text-[11px] font-medium">{companyName}</div>
                        </td>

                        <td className="py-4 px-5">
                          {score !== 'N/A' ? (
                            <div className="flex items-center gap-1">
                              <StarRating value={score} readOnly size={14} showLabel={false} />
                              <span className="font-black text-amber-500">{score}.0</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">N/A</span>
                          )}
                        </td>

                        <td className="py-4 px-5 font-bold">
                          {item.recommendation !== undefined ? (
                            item.recommendation ? (
                              <span className="text-emerald-600 dark:text-emerald-400">Yes</span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400">No</span>
                            )
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        <td className="py-4 px-5 font-semibold text-slate-500">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => setViewModalItem(item)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-all cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteModalItem(item)}
                            className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500">
                  Showing page <strong className="text-slate-900 dark:text-white">{pagination.page}</strong> of <strong className="text-slate-900 dark:text-white">{pagination.totalPages}</strong>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>

                  <button
                    disabled={currentPage >= pagination.totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-3 py-1.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {deleteModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <HelpCircle size={28} />
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Delete Feedback Entry?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Are you sure you want to delete this review? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeleteModalItem(null)}
                  className="px-4 py-2.5 text-xs font-extrabold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isDeleting}
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Review'}
                </button>
              </div>
            </div>
          </div>
        )}

        {viewModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-black text-base text-slate-900 dark:text-white capitalize">
                  {viewModalItem.type?.replace('_', ' ')}
                </h3>
                <button onClick={() => setViewModalItem(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Reviewer:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewModalItem.reviewerId?.name || 'User'} ({viewModalItem.reviewerRole})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewModalItem.studentId?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Company:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewModalItem.companyId?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Internship:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewModalItem.internshipId?.title || 'N/A'}</span>
                </div>

                {viewModalItem.ratings && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400">Category Ratings</span>
                    {Object.entries(viewModalItem.ratings).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[11px] capitalize">
                        <span className="text-slate-600 dark:text-slate-400">{k}:</span>
                        <strong className="text-slate-900 dark:text-white">{v} / 5</strong>
                      </div>
                    ))}
                  </div>
                )}

                {viewModalItem.comments && (
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold">Comments:</span>
                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                      "{viewModalItem.comments}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
