
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated, authError } = useAuth();

  // Debug log for authentication state
  if (import.meta.env.DEV) {
    console.log('ProtectedRoute auth state:', { 
      hasUser: !!user, 
      isAuthenticated, 
      isLoading,
      userEmail: user?.email,
      authError
    });
  }

  // Show loading state while authentication is being verified
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication state more thoroughly
  if (!isAuthenticated || !user) {
    if (import.meta.env.DEV) {
      console.warn('ProtectedRoute: Authentication failed, redirecting to login', {
        isAuthenticated,
        hasUser: !!user,
        authError
      });
    }
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
