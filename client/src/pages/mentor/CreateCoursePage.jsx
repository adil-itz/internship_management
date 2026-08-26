import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import CourseForm from '../../components/courses/CourseForm';
import { createCourse } from '../../services/course.service';

export default function CreateCoursePage({ darkMode, setDarkMode, user }) {
  const navigate = useNavigate();

  const handleCreateSubmit = async (payload) => {
    const res = await createCourse(payload);
    if (res && res.success) {
      navigate('/mentor/courses');
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      <CourseForm onSubmit={handleCreateSubmit} backPath="/mentor/courses" />
    </DashboardLayout>
  );
}
