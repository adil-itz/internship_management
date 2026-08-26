import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, RefreshCw, BookOpen, Eye, Edit, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import CourseStatusBadge from '../../components/courses/CourseStatusBadge';
import DeleteCourseModal from '../../components/courses/DeleteCourseModal';
import { getMyCourses, deleteCourse } from '../../services/course.service';

export default function MentorCourses({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedDeleteTitle, setSelectedDeleteTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyCourses();
      if (res && res.success) {
        setCourses(res.courses || []);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Failed to fetch mentor courses:', err);
      setError(err.message || 'Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeletePrompt = (id, title) => {
    setSelectedDeleteId(id);
    setSelectedDeleteTitle(title);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteId) return;
    setIsDeleting(true);
    try {
      await deleteCourse(selectedDeleteId);
      setCourses((prev) => prev.filter((item) => item._id !== selectedDeleteId));
      setToastMessage('Course deleted successfully.');
      setTimeout(() => setToastMessage(null), 4000);
      setDeleteModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to delete course');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalCount = courses.length;
  const publishedCount = courses.filter((c) => c.status === 'published').length;
  const draftCount = courses.filter((c) => c.status === 'draft').length;
  const archivedCount = courses.filter((c) => c.status === 'archived').length;

  const filteredCourses = courses.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDomain = item.domain?.toLowerCase().includes(q);
      if (!matchTitle && !matchDomain) return false;
    }
    return true;
  });

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
                <Sparkles size={14} className="text-amber-300 animate-pulse" />
                <span>Mentor Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Course Management</h1>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Build structured course modules, manage resources inside modules, and publish learning paths.
              </p>
            </div>

            <Link
              to="/mentor/courses/create"
              className="px-5 py-3 text-xs font-extrabold text-slate-900 bg-white hover:bg-blue-50 rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 group hover:scale-105"
            >
              <PlusCircle size={18} className="text-blue-600 group-hover:rotate-90 transition-transform" />
              <span>+ Create Course</span>
            </Link>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <p className="text-xs font-bold text-slate-400">Total Courses</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCount}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Published</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{publishedCount}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Drafts</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{draftCount}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Archived</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{archivedCount}</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses by title or domain..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-8 text-center text-xs font-semibold text-slate-400">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center">
              <BookOpen size={32} />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">You haven't created any courses yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design comprehensive courses with structured modules and multi-format learning resources.
              </p>
            </div>
            <Link
              to="/mentor/courses/create"
              className="inline-block px-5 py-2.5 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              + Create Course
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Title</th>
                    <th className="p-4">Domain</th>
                    <th className="p-4">Level</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredCourses.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 pl-6 font-extrabold text-slate-900 dark:text-white max-w-xs truncate">
                        {item.title}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 font-semibold">{item.domain}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{item.level}</td>
                      <td className="p-4 text-slate-500">{item.duration || 'N/A'}</td>
                      <td className="p-4">
                        <CourseStatusBadge status={item.status} />
                      </td>
                      <td className="p-4 text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/student/courses/${item._id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg cursor-pointer"
                            title="View"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            to={`/mentor/courses/${item._id}/edit`}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg cursor-pointer"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDeletePrompt(item._id, item.title)}
                            className="p-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <DeleteCourseModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          courseTitle={selectedDeleteTitle}
          isDeleting={isDeleting}
        />
      </div>
    </DashboardLayout>
  );
}
