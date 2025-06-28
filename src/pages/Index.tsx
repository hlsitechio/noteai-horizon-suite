
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import PageAICopilot from '../components/Global/PageAICopilot';

const Index: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  console.log('Index component - Auth state:', { user: !!user, isLoading });

  useEffect(() => {
    // Only navigate when auth state is resolved
    if (!isLoading) {
      console.log('Index: Auth state resolved, redirecting...');
      if (user) {
        console.log('Index: User authenticated, navigating to dashboard');
        navigate('/app/dashboard', { replace: true });
      } else {
        console.log('Index: User not authenticated, navigating to landing');
        navigate('/landing', { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading state while auth is being determined
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">
          {isLoading ? 'Loading...' : 'Redirecting...'}
        </p>
      </div>
      <PageAICopilot pageContext="loading" />
    </div>
  );
};

export default Index;
