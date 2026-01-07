import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../features/auth/services/authService';
import { useSetupStatus } from '../features/setup';
import { LoadingState, ErrorState } from '../components/common';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { needsAdmin, loading, error } = useSetupStatus();

  if (loading) {
    return <LoadingState message="Verificando configuración inicial..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (needsAdmin) {
    return <Navigate to="/setup" replace />;
  }

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
