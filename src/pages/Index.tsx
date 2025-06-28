
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
    // Add a small delay to prevent rapid redirects
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          console.log('User authenticated, navigating to dashboard');
          navigate('/app/dashboard', { replace: true });
        } else {
          console.log('User not authenticated, navigating to landing');
          navigate('/landing', { replace: true });
        }
      }, 500); // Increase delay to 500ms

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, navigate]);

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

  // Show loading state while redirecting with timeout fallback
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Redirecting...</p>
        <div className="mt-4">
          {!user && (
            <button
              onClick={() => navigate('/landing', { replace: true })}
              className="text-sm text-blue-500 hover:underline"
            >
              Go to Landing Page
            </button>
          )}
          {user && (
            <button
              onClick={() => navigate('/app/dashboard', { replace: true })}
              className="text-sm text-blue-500 hover:underline"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
      <PageAICopilot pageContext="redirecting" />
    </div>
  );
};

export default Index;
