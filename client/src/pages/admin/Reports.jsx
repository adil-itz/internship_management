import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import ReportFilters from '../../components/reports/ReportFilters';
import SummaryCards from '../../components/reports/SummaryCards';
import UserAnalyticsChart from '../../components/reports/UserAnalyticsChart';
import ApplicationStatusChart from '../../components/reports/ApplicationStatusChart';
import InternshipStatusChart from '../../components/reports/InternshipStatusChart';
import AttendanceAnalytics from '../../components/reports/AttendanceAnalytics';
import WorklogAnalytics from '../../components/reports/WorklogAnalytics';
import CompanyReportTable from '../../components/reports/CompanyReportTable';
import MentorReportTable from '../../components/reports/MentorReportTable';
import StudentReportTable from '../../components/reports/StudentReportTable';
import ReportDownload from '../../components/reports/ReportDownload';
import {
  getDashboardReports,
  getMonthlyReports,
  getCompanyReports,
  getMentorReports,
  getStudentReports
} from '../../services/report.service';
import { BarChart3, AlertCircle } from 'lucide-react';

export default function Reports({ darkMode, setDarkMode, user }) {
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboardSummary, setDashboardSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [companyReports, setCompanyReports] = useState([]);
  const [mentorReports, setMentorReports] = useState([]);
  const [studentReports, setStudentReports] = useState([]);

  useEffect(() => {
    fetchAllReportData(filters);
  }, [filters]);

  const fetchAllReportData = async (activeFilters) => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, monthlyRes, companyRes, mentorRes, studentRes] = await Promise.all([
        getDashboardReports(activeFilters),
        getMonthlyReports(activeFilters.year),
        getCompanyReports(activeFilters),
        getMentorReports(activeFilters),
        getStudentReports(activeFilters)
      ]);

      if (dashRes && dashRes.success) {
        setDashboardSummary(dashRes.summary);
      }
      if (monthlyRes && monthlyRes.success) {
        setMonthlyData(monthlyRes.data || []);
      }
      if (companyRes && companyRes.success) {
        setCompanyReports(companyRes.data || []);
      }
      if (mentorRes && mentorRes.success) {
        setMentorReports(mentorRes.data || []);
      }
      if (studentRes && studentRes.success) {
        setStudentReports(studentRes.data || []);
      }
    } catch (err) {
      console.error('Error loading analytics', err);
      setError(err.message || 'Unable to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="reports">
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 size={24} className="text-blue-500" /> Reports & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Platform performance and activity overview
          </p>
        </div>

        <ReportFilters
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-extrabold text-slate-400">Loading system reports & analytics...</p>
          </div>
        ) : (
          <>
            <SummaryCards summary={dashboardSummary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <UserAnalyticsChart data={monthlyData} year={filters.year} />
              </div>
              <div className="space-y-6">
                <ApplicationStatusChart applicationStats={dashboardSummary?.applications} />
                <InternshipStatusChart internshipStats={dashboardSummary?.internships} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AttendanceAnalytics attendance={dashboardSummary?.attendance} />
              <WorklogAnalytics worklog={dashboardSummary?.worklog} />
            </div>

            <CompanyReportTable companies={companyReports} loading={loading} />
            <MentorReportTable mentors={mentorReports} loading={loading} />
            <StudentReportTable students={studentReports} loading={loading} />

            <ReportDownload currentFilters={filters} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
