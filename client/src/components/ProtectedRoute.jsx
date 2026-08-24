import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');


  if (!savedUser && !token) {
    return <Navigate to="/login" replace />;
  }

  let user = null;
  try {
    user = savedUser ? JSON.parse(savedUser) : null;
  } catch (e) {
    console.error('Failed to parse stored user in ProtectedRoute', e);
  }

  const userRole = user?.role || 'student';


  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to user's assigned dashboard
    return <Navigate to={`/dashboard/${userRole}`} replace />;
  }

  return children;
}
