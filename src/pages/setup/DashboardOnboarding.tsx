import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NewUserWelcome } from '@/components/Dashboard/NewUserWelcome';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { usePublicPageTheme } from '@/hooks/usePublicPageTheme';

const DashboardOnboarding: React.FC = () => {
  // Ensure clean theme for dashboard onboarding
  usePublicPageTheme();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardInitialized = () => {
    // After onboarding is complete, redirect to main dashboard
    navigate('/app/dashboard', { replace: true });
  };

  // Show loading state if no user yet
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="p-8 flex items-center space-x-4 border-2 border-purple-500/20 bg-gray-900/80">
          <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full" />
          <div className="flex flex-col">
            <span className="text-white font-medium">Loading onboarding...</span>
            <span className="text-xs text-gray-400">Please wait</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <NewUserWelcome 
          onDashboardInitialized={handleDashboardInitialized}
          className="max-w-4xl mx-auto"
        />
      </div>
    </div>
  );
};

export default DashboardOnboarding;