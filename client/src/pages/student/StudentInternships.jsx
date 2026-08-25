import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import InternshipCard from '../../components/internship/InternshipCard';
import InternshipFilters from '../../components/internship/InternshipFilters';
import ApplyComingSoonModal from '../../components/internship/ApplyComingSoonModal';
import { getInternships } from '../../services/internship.service';
import { Sparkles, Briefcase, AlertCircle, RefreshCw } from 'lucide-react';

export default function StudentInternships({ darkMode, setDarkMode, user }) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [domain, setDomain] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [internshipType, setInternshipType] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [stipendFilter, setStipendFilter] = useState('all');

  const [comingSoonModalOpen, setComingSoonModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');

  const fetchInternshipsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getInternships();
      if (res && res.success) {
        setInternships(res.internships || []);
      } else {
        setInternships([]);
      }
    } catch (err) {
      console.error('Failed to fetch internships:', err);
      setError(err.message || 'Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternshipsData();
  }, []);

  const handleResetFilters = () => {
    setSearchQuery('');
    setDomain('All');
    setWorkMode('All');
    setInternshipType('All');
    setLocationFilter('');
    setStipendFilter('all');
  };

  const handleApplyClick = (title) => {
    setSelectedTitle(title);
    setComingSoonModalOpen(true);
  };

  const filteredInternships = internships.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const companyName = typeof item.company === 'object' && item.company !== null ? item.company.name : '';
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchCompany = companyName?.toLowerCase().includes(q);
      const matchDomain = item.domain?.toLowerCase().includes(q);
      const matchLocation = item.location?.toLowerCase().includes(q);
      const matchSkills = item.skills?.some((s) => s.toLowerCase().includes(q));

      if (!matchTitle && !matchCompany && !matchDomain && !matchLocation && !matchSkills) {
        return false;
      }
    }

    if (domain !== 'All' && item.domain !== domain) {
      return false;
    }

    if (workMode !== 'All' && item.workMode !== workMode) {
      return false;
    }

    if (internshipType !== 'All' && item.internshipType !== internshipType) {
      return false;
    }

    if (locationFilter && !item.location?.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }

    if (stipendFilter !== 'all') {
      const stipendVal = Number(item.stipend || 0);
      if (stipendFilter === '0-5000' && (stipendVal < 0 || stipendVal > 5000)) return false;
      if (stipendFilter === '5000-10000' && (stipendVal < 5000 || stipendVal > 10000)) return false;
      if (stipendFilter === '10000-20000' && (stipendVal < 10000 || stipendVal > 20000)) return false;
      if (stipendFilter === '20000+' && stipendVal < 20000) return false;
    }

    return true;
  });

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-600/20">
          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20">
              <Sparkles size={14} className="text-amber-300 animate-pulse" />
              <span>Explore Internships</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Available Internship Opportunities
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Browse top tier opportunities posted by partner companies. Filter by domain, skills, stipend, or work preference.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <InternshipFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          domain={domain}
          setDomain={setDomain}
          workMode={workMode}
          setWorkMode={setWorkMode}
          internshipType={internshipType}
          setInternshipType={setInternshipType}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
          stipendFilter={stipendFilter}
          setStipendFilter={setStipendFilter}
          onReset={handleResetFilters}
        />

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchInternshipsData}
              className="px-3 py-1 bg-rose-100 dark:bg-rose-900 rounded-lg hover:bg-rose-200 transition-colors flex items-center gap-1"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
                  <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-xl"></div>
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInternships.map((internship) => (
              <InternshipCard
                key={internship._id}
                internship={internship}
                onApplyNow={() => handleApplyClick(internship.title)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Briefcase size={32} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                No internships available
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                There are currently no published internships matching your search or filter criteria. Please check again later or reset filters.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      <ApplyComingSoonModal
        isOpen={comingSoonModalOpen}
        onClose={() => setComingSoonModalOpen(false)}
        internshipTitle={selectedTitle}
      />
    </DashboardLayout>
  );
}
