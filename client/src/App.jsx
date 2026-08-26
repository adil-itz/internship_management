import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import StudentProfile from './pages/StudentProfile';
import StudentInternships from './pages/student/StudentInternships';
import InternshipDetailsPage from './pages/student/InternshipDetailsPage';
import CompanyInternships from './pages/company/CompanyInternships';
import CreateInternship from './pages/company/CreateInternship';
import EditInternship from './pages/company/EditInternship';

import ResourceExploration from './pages/student/ResourceExploration';
import ResourceDetails from './pages/student/ResourceDetails';
import CourseExploration from './pages/student/CourseExploration';
import CourseDetails from './pages/student/CourseDetails';

import MentorResources from './pages/mentor/MentorResources';
import CreateResourcePage from './pages/mentor/CreateResourcePage';
import EditResourcePage from './pages/mentor/EditResourcePage';
import MentorCourses from './pages/mentor/MentorCourses';
import CreateCoursePage from './pages/mentor/CreateCoursePage';
import EditCoursePage from './pages/mentor/EditCoursePage';

import AdminResources from './pages/admin/AdminResources';
import AdminCreateResource from './pages/admin/AdminCreateResource';
import AdminEditResource from './pages/admin/AdminEditResource';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCreateCourse from './pages/admin/AdminCreateCourse';
import AdminEditCourse from './pages/admin/AdminEditCourse';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/login" element={<LoginPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/register" element={<RegisterPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
        
        {/* Dynamic Role Dashboard Routing */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:role"
          element={
            <ProtectedRoute>
              <DashboardPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/dashboard/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

        {/* Student Internship Routes */}
        <Route
          path="/student/internships"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentInternships darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/internships/:id"
          element={
            <ProtectedRoute>
              <InternshipDetailsPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

        {/* Student Learning Hub Routes */}
        <Route
          path="/student/resources"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ResourceExploration darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/resources/:id"
          element={
            <ProtectedRoute allowedRoles={['student', 'mentor', 'admin']}>
              <ResourceDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CourseExploration darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses/:id"
          element={
            <ProtectedRoute allowedRoles={['student', 'mentor', 'admin']}>
              <CourseDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

        {/* Company Internship Routes */}
        <Route
          path="/company/internships"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyInternships darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/internships/create"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CreateInternship darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/internships/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <EditInternship darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

        {/* Mentor Learning Hub Routes */}
        <Route
          path="/mentor/resources"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <MentorResources darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/resources/create"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <CreateResourcePage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/resources/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <EditResourcePage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/courses"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <MentorCourses darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/courses/create"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <CreateCoursePage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/courses/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <EditCoursePage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

        {/* Admin Learning Hub Routes */}
        <Route
          path="/admin/resources"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminResources darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/resources/create"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCreateResource darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/resources/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEditResource darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCourses darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/create"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCreateCourse darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEditCourse darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
