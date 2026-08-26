import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ResourceForm from '../../components/resources/ResourceForm';
import { getResourceById, updateResource } from '../../services/resource.service';

export default function EditResourcePage({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getResourceById(id);
        if (res && res.success) {
          setInitialData(res.resource);
        } else {
          setError('Resource not found');
        }
      } catch (err) {
        console.error('Failed to load resource for edit:', err);
        setError(err.message || 'Failed to load resource details');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleEditSubmit = async (payload) => {
    const res = await updateResource(id, payload);
    if (res && res.success) {
      navigate('/mentor/resources');
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      {loading ? (
        <div className="p-8 text-center text-xs font-semibold text-slate-400">Loading resource details...</div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 font-bold text-xs">
          {error}
        </div>
      ) : (
        <ResourceForm initialData={initialData} isEditing={true} onSubmit={handleEditSubmit} backPath="/mentor/resources" />
      )}
    </DashboardLayout>
  );
}
