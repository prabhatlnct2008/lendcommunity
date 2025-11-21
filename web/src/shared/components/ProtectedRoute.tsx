/**
 * Protected Route - Requires authentication
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to home page if not authenticated
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
