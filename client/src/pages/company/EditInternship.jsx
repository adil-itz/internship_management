import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import InternshipForm from '../../components/internship/InternshipForm';
import { getInternshipById, updateInternship } from '../../services/internship.service';
import { AlertCircle } from 'lucide-react';

export default function EditInternship({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchInternship = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await getInternshipById(id);
        if (res && res.success) {
          setInitialData(res.internship);
        } else {
          setFetchError('Internship not found');
        }
      } catch (err) {
        console.error('Error fetching internship for edit:', err);
        setFetchError(err.message || 'Failed to fetch internship details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInternship();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await updateInternship(id, formData);
      if (res && res.success) {
        navigate('/company/internships');
      } else {
        setSubmitError('Failed to update internship');
      }
    } catch (err) {
      console.error('Error updating internship:', err);
      setSubmitError(err.message || 'Failed to update internship. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="p-12 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-400">Loading internship data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (fetchError || !initialData) {
    return (
      <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
        <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-center space-y-3">
          <AlertCircle size={32} className="mx-auto text-rose-500" />
          <h3 className="font-extrabold text-base">{fetchError || 'Internship Not Found'}</h3>
          <button
            onClick={() => navigate('/company/internships')}
            className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl"
          >
            Back to My Internships
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {submitError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{submitError}</span>
          </div>
        )}

        <InternshipForm
          mode="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

      </div>
    </DashboardLayout>
  );
}
