import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import InternshipForm from '../../components/internship/InternshipForm';
import { createInternship } from '../../services/internship.service';
import { AlertCircle } from 'lucide-react';

export default function CreateInternship({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await createInternship(formData);
      if (res && res.success) {
        navigate('/company/internships');
      } else {
        setSubmitError('Failed to create internship');
      }
    } catch (err) {
      console.error('Error creating internship:', err);
      setSubmitError(err.message || 'Failed to create internship. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

      </div>
    </DashboardLayout>
  );
}
