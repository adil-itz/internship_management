import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import ResourceForm from '../../components/resources/ResourceForm';
import { createResource } from '../../services/resource.service';

export default function CreateResourcePage({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const handleCreateSubmit = async (payload) => {
    const res = await createResource(payload);
    if (res && res.success) {
      navigate('/mentor/resources');
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <ResourceForm onSubmit={handleCreateSubmit} backPath="/mentor/resources" />
    </DashboardLayout>
  );
}
