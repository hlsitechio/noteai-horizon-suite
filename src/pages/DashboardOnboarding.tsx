import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NewUserWelcome } from '@/components/Dashboard/NewUserWelcome';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const DashboardOnboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardInitialized = () => {
    // After onboarding is complete, redirect to main dashboard
    navigate('/app/dashboard', { replace: true });
  };

  // Show loading state if no user yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 flex items-center space-x-4 border-2 border-primary/20">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
          <div className="flex flex-col">
            <span className="text-foreground font-medium">Loading onboarding...</span>
            <span className="text-xs text-muted-foreground">Please wait</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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