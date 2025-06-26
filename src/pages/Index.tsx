
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import PageAICopilot from '../components/Global/PageAICopilot';

const Index: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Index component - Auth state:', { user: !!user, isLoading });
    
    if (!isLoading) {
      if (user) {
        console.log('User authenticated, navigating to dashboard');
        navigate('/app/dashboard', { replace: true });
      } else {
        console.log('User not authenticated, navigating to landing');
        navigate('/landing', { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  console.log('Index component rendering - isLoading:', isLoading);

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <PageAICopilot pageContext="loading" />
      </div>
    );
  }

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
      <PageAICopilot pageContext="redirecting" />
    </div>
  );
};

export default Index;
