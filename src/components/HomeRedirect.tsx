
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const HomeRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  console.log('HomeRedirect - Auth state:', { user: !!user, isLoading });

  // Show loading state while auth is being determined
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

  // Simple redirect - if we're here, user is authenticated (due to ProtectedRoute)
  console.log('HomeRedirect: Redirecting authenticated user to dashboard');
  return <Navigate to="/app/dashboard" replace />;
};

export default HomeRedirect;
