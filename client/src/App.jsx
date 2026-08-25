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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
