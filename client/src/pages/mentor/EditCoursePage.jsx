import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import CourseForm from '../../components/courses/CourseForm';
import { getCourseById, updateCourse } from '../../services/course.service';

export default function EditCoursePage({ darkMode, setDarkMode, user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCourseById(id);
        if (res && res.success) {
          setInitialData(res.course);
        } else {
          setError('Course not found');
        }
      } catch (err) {
        console.error('Failed to load course for edit:', err);
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleEditSubmit = async (payload) => {
    const res = await updateCourse(id, payload);
    if (res && res.success) {
      navigate('/mentor/courses');
    }
  };

  return (
    <DashboardLayout user={user} darkMode={darkMode} setDarkMode={setDarkMode}>
      {loading ? (
        <div className="p-8 text-center text-xs font-semibold text-slate-400">Loading course details...</div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 text-rose-600 font-bold text-xs">
          {error}
        </div>
      ) : (
        <CourseForm initialData={initialData} isEditing={true} onSubmit={handleEditSubmit} backPath="/mentor/courses" />
      )}
    </DashboardLayout>
  );
}
