import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingState } from './LoadingState';

export default function ProtectedRoute({
  children,
  requiredRoles = null,
  fallback = '/login',
}) {
  const { isAuthenticated, isCheckingSession, user } = useAuth();

  if (isCheckingSession) {
    return <LoadingState message="Verificando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={fallback} replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user?.accessLevel)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
