import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { CheckCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    // Automatically logout the user when they visit this page
    const performLogout = async () => {
      if (isAuthenticated) {
        await logout();
      }
    };
    
    performLogout();
  }, [logout, isAuthenticated]);

  const handleReturnHome = () => {
    navigate('/public/landing');
  };

  const handleLoginAgain = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6 border-2 border-primary/10 shadow-lg">
        <div className="flex justify-center">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <Heart className="h-6 w-6 text-primary absolute -top-1 -right-1 animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Thank You!
          </h1>
          
          <div className="space-y-3">
            <p className="text-muted-foreground">
              You have been successfully logged out.
            </p>
            
            <p className="text-foreground font-medium">
              Thank you for using our app! We hope to see you again soon.
            </p>
            
            <p className="text-sm text-muted-foreground">
              Your session has ended securely and all your data remains protected.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <Button 
            onClick={handleLoginAgain}
            className="w-full"
            size="lg"
          >
            Sign In Again
          </Button>
          
          <Button 
            onClick={handleReturnHome}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Return to Home
          </Button>
        </div>
        
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Have a wonderful day! 🌟
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Logout;