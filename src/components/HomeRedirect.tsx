
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDashboardStatus } from './Dashboard/hooks/useDashboardStatus';
import { useInitialOnboarding } from '@/hooks/useInitialOnboarding';
import { Loader2 } from 'lucide-react';

const HomeRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { isDashboardInitialized, isLoading: isDashboardLoading } = useDashboardStatus();
  const { needsOnboarding, isLoading: onboardingLoading } = useInitialOnboarding();
  const [isHydrated, setIsHydrated] = useState(false);

  // Debug logging (development only)
  if (import.meta.env.DEV) {
    console.log('HomeRedirect Debug:', {
      user: user ? 'authenticated' : 'not authenticated',
      isLoading,
      isDashboardInitialized,
      isDashboardLoading,
      needsOnboarding,
      onboardingLoading,
      isHydrated
    });
  }

  // Ensure hydration is complete before rendering navigation
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Always show loading during initial hydration or auth/dashboard/onboarding loading
  if (!isHydrated || isLoading || isDashboardLoading || onboardingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect based on authentication status after hydration
  if (user) {
    // Always redirect to dashboard setup first (since we reset it on every login)
    // This ensures the flow: /setup -> /onboarding -> /app/dashboard
    if (!isDashboardInitialized) {
      return <Navigate to="/setup" replace />;
    }
    // If user needs initial onboarding (role selection + profile setup)
    if (needsOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
    // Otherwise, redirect to main dashboard
    return <Navigate to="/app/dashboard" replace />;
  } else {
    return <Navigate to="/landing" replace />;
  }
};

export default HomeRedirect;
