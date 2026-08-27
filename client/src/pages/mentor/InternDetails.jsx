import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import AssignmentStatusBadge from '../../components/mentor/AssignmentStatusBadge';
import { getAssignmentById, updateAssignmentStatus } from '../../services/mentorAssignment.service';
import {
  ArrowLeft,
  User,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Briefcase
} from 'lucide-react';

export default function InternDetails({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id]);

  const fetchAssignmentDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAssignmentById(id);
      if (res && res.success) {
        setAssignment(res.assignment);
      } else {
        setError('Assignment details not found.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch assignment details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await updateAssignmentStatus(id, { status: newStatus });
      if (res && res.success) {
        setAssignment(res.assignment);
      } else {
        alert(res.message || 'Failed to update assignment status.');
      }
    } catch (err) {
      alert(err.message || 'Failed to update assignment status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="p-12 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">Loading supervision details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !assignment) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="space-y-4 max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/mentor/interns')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Assigned Interns
          </button>
          <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-rose-500" />
            <h3 className="font-extrabold text-base">{error || 'Assignment Not Found'}</h3>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const student = assignment.student || {};
  const internship = assignment.internship || {};
  const companyName = typeof internship.company === 'object' && internship.company !== null ? internship.company.name : 'Company';

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode} activeTab="assigned-interns">
      <div className="space-y-6 max-w-4xl mx-auto">
        
        <button
          onClick={() => navigate('/mentor/interns')}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} /> Back to Assigned Interns
        </button>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {student.name || 'Student Name'}
                </h1>
                <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                  <Mail size={14} className="text-blue-500" />
                  <span>{student.email}</span>
                </p>
              </div>
            </div>

            <AssignmentStatusBadge status={assignment.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                <Briefcase size={16} className="text-blue-500" /> Internship Information
              </h3>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Title</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">{internship.title || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Company</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1">
                  <Building2 size={13} className="text-blue-500" /> {companyName}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                <User size={16} className="text-emerald-500" /> Supervision Meta
              </h3>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Assigned Date</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {new Date(assignment.assignedAt || assignment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Current Status</span>
                <p className="font-extrabold text-slate-900 dark:text-white mt-0.5 capitalize">{assignment.status}</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-black text-xs uppercase tracking-wider text-slate-400">Update Supervision Status</h3>
            <div className="flex flex-wrap gap-3">
              {assignment.status !== 'active' && (
                <button
                  onClick={() => handleStatusChange('active')}
                  disabled={updating}
                  className="px-4 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md cursor-pointer"
                >
                  Mark Active
                </button>
              )}

              {assignment.status !== 'completed' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={updating}
                  className="px-4 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md cursor-pointer"
                >
                  Mark Supervision Completed
                </button>
              )}

              {assignment.status !== 'cancelled' && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  disabled={updating}
                  className="px-4 py-2 text-xs font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 cursor-pointer"
                >
                  Mark Cancelled
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
