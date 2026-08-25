import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  const savedUserStr = sessionStorage.getItem('user') || localStorage.getItem('user');

  if (!token && !savedUserStr) {
    return <Navigate to="/login" replace />;
  }

  let user = null;
  if (savedUserStr && savedUserStr !== 'undefined' && savedUserStr !== 'null') {
    try {
      user = JSON.parse(savedUserStr);
    } catch (e) {
      console.error('Failed to parse stored user in ProtectedRoute', e);
    }
  }

  const userRole = user?.role || 'student';

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={`/dashboard/${userRole}`} replace />;
  }

  return children;
}
