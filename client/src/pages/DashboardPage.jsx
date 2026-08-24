import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StudentDashboard from './dashboards/StudentDashboard';
import CompanyDashboard from './dashboards/CompanyDashboard';
import MentorDashboard from './dashboards/MentorDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export default function DashboardPage({ darkMode, setDarkMode, roleOverride }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // 1. Check if token and user exist in URL search parameters (Google OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const userFromUrl = urlParams.get('user');

    if (tokenFromUrl && userFromUrl) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userFromUrl));
        localStorage.setItem('token', tokenFromUrl);
        localStorage.setItem('user', JSON.stringify(parsedUser));
        setUser(parsedUser);
        window.history.replaceState({}, document.title, window.location.pathname);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse OAuth URL user data', e);
      }
    }

    // 2. Read user from localStorage or sessionStorage
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    } else {
      // Demo fallback user if none stored
      setUser({
        name: 'Demo User',
        email: 'user@example.com',
        role: roleOverride || params.role || 'student',
      });
    }
    setLoading(false);
  }, [roleOverride, params.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-400">Verifying session credentials...</p>
      </div>
    );
  }

  // Determine active role from route params, prop override, or user object
  const activeRole = roleOverride || params.role || user?.role || 'student';

  // Render role-specific dashboard component
  switch (activeRole) {
    case 'company':
      return <CompanyDashboard darkMode={darkMode} setDarkMode={setDarkMode} user={user} />;
    case 'mentor':
      return <MentorDashboard darkMode={darkMode} setDarkMode={setDarkMode} user={user} />;
    case 'admin':
      return <AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} user={user} />;
    case 'student':
    default:
      return <StudentDashboard darkMode={darkMode} setDarkMode={setDarkMode} user={user} />;
  }
}
