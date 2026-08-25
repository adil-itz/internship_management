import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import InternshipCard from '../../components/internship/InternshipCard';
import DeleteInternshipModal from '../../components/internship/DeleteInternshipModal';
import { getCompanyInternships, deleteInternship } from '../../services/internship.service';
import {
  PlusCircle,
  Briefcase,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

export default function CompanyInternships({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedDeleteTitle, setSelectedDeleteTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Success message toast state
  const [toastMessage, setToastMessage] = useState(null);

  const fetchMyInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCompanyInternships();
      if (res && res.success) {
        setInternships(res.internships || []);
      } else {
        setInternships([]);
      }
    } catch (err) {
      console.error('Failed to fetch company internships:', err);
      setError(err.message || 'Failed to load your internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyInternships();
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
      await deleteInternship(selectedDeleteId);
      setInternships((prev) => prev.filter((item) => item._id !== selectedDeleteId));
      setToastMessage('Internship deleted successfully.');
      setTimeout(() => setToastMessage(null), 4000);
      setDeleteModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to delete internship');
    } finally {
      setIsDeleting(false);
    }
  };

  // Metrics
  const totalCount = internships.length;
  const publishedCount = internships.filter((i) => i.status === 'published').length;
  const draftCount = internships.filter((i) => i.status === 'draft').length;
  const closedCount = internships.filter((i) => i.status === 'closed').length;

  // Filtered internships list
  const filteredList = internships.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchDomain = item.domain?.toLowerCase().includes(q);
      const matchLocation = item.location?.toLowerCase().includes(q);
      if (!matchTitle && !matchDomain && !matchLocation) return false;
    }
    return true;
  });

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-6">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
                <Sparkles size={14} className="text-amber-300 animate-pulse" />
                <span>Employer Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                My Posted Internships
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                Create, edit, manage status, and oversee all internship postings created by your organization.
              </p>
            </div>

            <Link
              to="/company/internships/create"
              className="px-5 py-3 text-xs font-extrabold text-slate-900 bg-white hover:bg-blue-50 rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 group hover:scale-105"
            >
              <PlusCircle size={18} className="text-blue-600 group-hover:rotate-90 transition-transform" />
              <span>+ Create Internship</span>
            </Link>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Stats Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Created</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">{totalCount}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500">Published</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{publishedCount}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500">Drafts</span>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{draftCount}</p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Closed</span>
            <p className="text-2xl sm:text-3xl font-black text-slate-500 mt-1">{closedCount}</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, domain, or location..."
              className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={14} className="text-slate-400 shrink-0" />
            {['all', 'published', 'draft', 'closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-[11px] font-extrabold rounded-xl capitalize cursor-pointer transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchMyInternships}
              className="px-3 py-1 bg-rose-100 dark:bg-rose-900 rounded-lg hover:bg-rose-200 transition-colors flex items-center gap-1"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* List Grid View */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 animate-pulse">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredList.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                isCompanyView={true}
                onEdit={(id) => navigate(`/company/internships/${id}/edit`)}
                onDelete={(id, title) => handleDeletePrompt(id, title)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Briefcase size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                You haven't created any internships yet.
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Create your first internship listing and start finding top tier student candidates.
              </p>
            </div>
            <Link
              to="/company/internships/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all"
            >
              <PlusCircle size={16} />
              <span>+ Create Internship</span>
            </Link>
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteInternshipModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        internshipTitle={selectedDeleteTitle}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}
