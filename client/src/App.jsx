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
import StudentApplications from './pages/student/StudentApplications';
import StudentApplicationDetails from './pages/student/StudentApplicationDetails';
import StudentMentorAssignment from './pages/student/StudentMentorAssignment';
import StudentTasks from './pages/student/StudentTasks';
import StudentTaskDetails from './pages/student/StudentTaskDetails';
import StudentWorkLogs from './pages/student/StudentWorkLogs';
import CreateWorkLog from './pages/student/CreateWorkLog';
import WorkLogDetails from './pages/student/WorkLogDetails';
import StudentAttendance from './pages/student/StudentAttendance';
import MentorAttendance from './pages/mentor/MentorAttendance';
import AdminAttendance from './pages/admin/AdminAttendance';
import MentorWorkLogs from './pages/mentor/MentorWorkLogs';
import AdminWorkLogs from './pages/admin/AdminWorkLogs';
import ChatPage from './pages/ChatPage';

import CompanyInternships from './pages/company/CompanyInternships';
import CreateInternship from './pages/company/CreateInternship';
import EditInternship from './pages/company/EditInternship';
import CompanyInternshipApplications from './pages/company/CompanyInternshipApplications';
import CompanyAllApplications from './pages/company/CompanyAllApplications';
import CompanyApplicationDetails from './pages/company/CompanyApplicationDetails';
import CompanyMentorAssignments from './pages/company/CompanyMentorAssignments';
import CompanyAttendance from './pages/company/CompanyAttendance';

import AssignedInterns from './pages/mentor/AssignedInterns';
import InternDetails from './pages/mentor/InternDetails';
import MentorResources from './pages/mentor/MentorResources';
import CreateResourcePage from './pages/mentor/CreateResourcePage';
import EditResourcePage from './pages/mentor/EditResourcePage';
import MentorCourses from './pages/mentor/MentorCourses';
import CreateCoursePage from './pages/mentor/CreateCoursePage';
import EditCoursePage from './pages/mentor/EditCoursePage';

import AdminInternships from './pages/admin/AdminInternships';
import AdminApplications from './pages/admin/AdminApplications';
import AdminMentorAssignments from './pages/admin/AdminMentorAssignments';
import AdminTasks from './pages/admin/AdminTasks';
import AdminResources from './pages/admin/AdminResources';
import AdminCreateResource from './pages/admin/AdminCreateResource';
import AdminEditResource from './pages/admin/AdminEditResource';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCreateCourse from './pages/admin/AdminCreateCourse';
import AdminEditCourse from './pages/admin/AdminEditCourse';

import ResourceExploration from './pages/student/ResourceExploration';
import ResourceDetails from './pages/student/ResourceDetails';
import CourseExploration from './pages/student/CourseExploration';
import CourseDetails from './pages/student/CourseDetails';
import StudentFeedback from './pages/student/StudentFeedback';
import MentorFeedback from './pages/mentor/MentorFeedback';
import CompanyFeedback from './pages/company/CompanyFeedback';
import AdminFeedback from './pages/admin/AdminFeedback';
import CompanyProfilePage from './pages/CompanyProfilePage';

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

        <Route
          path="/student/internships"
          element={
            <ProtectedRoute allowedRoles={['student', 'admin']}>
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
        <Route
          path="/student/applications"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentApplications darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/applications/:id"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentApplicationDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/mentor"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentMentorAssignment darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/tasks"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentTasks darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/tasks/:taskId"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentTaskDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/messages"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ChatPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAttendance darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/worklogs"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentWorkLogs darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/worklogs/create"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CreateWorkLog darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/worklogs/:id"
          element={
            <ProtectedRoute allowedRoles={['student', 'mentor', 'admin']}>
              <WorkLogDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/worklogs/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <CreateWorkLog darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

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
        <Route
          path="/student/feedback"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentFeedback darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/:id"
          element={
            <ProtectedRoute>
              <CompanyProfilePage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

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
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <EditInternship darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/internships/:internshipId/applications"
          element={
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <CompanyInternshipApplications darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/applications"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyAllApplications darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/applications/:id"
          element={
            <ProtectedRoute allowedRoles={['company', 'admin']}>
              <CompanyApplicationDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/mentor-assignments"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyMentorAssignments darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/attendance"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyAttendance darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/feedback"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <CompanyFeedback darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/interns"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <AssignedInterns darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/interns/:id"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <InternDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/attendance"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <MentorAttendance darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/worklogs"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <MentorWorkLogs darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/feedback"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <MentorFeedback darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/worklogs/:id"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <WorkLogDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentor/messages"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <ChatPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute allowedRoles={['student', 'mentor', 'admin']}>
              <ChatPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
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

        <Route
          path="/admin/internships"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminInternships darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminApplications darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <CompanyApplicationDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/mentor-assignments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminMentorAssignments darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tasks"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTasks darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAttendance darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/worklogs"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminWorkLogs darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/worklogs/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <WorkLogDetails darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ChatPage darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />
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
        <Route
          path="/admin/feedback"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminFeedback darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
