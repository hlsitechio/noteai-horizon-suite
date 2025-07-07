
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import loginBg from '../../assets/login-gradient-bg.jpg';
import onlineNoteAILogo from '../../assets/online-note-ai-logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('User already authenticated, redirecting...');
      navigate('/app/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !email.trim() || !password.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Attempting login for:', email);
      
      const success = await login(email.trim(), password);
      
      if (success) {
        console.log('Login successful, navigating to dashboard');
        navigate('/app/dashboard', { replace: true });
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent/10 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <Card className="max-w-md w-full shadow-2xl bg-card border border-border backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Logo */}
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto overflow-hidden">
                <img src={onlineNoteAILogo} alt="Online Note AI Logo" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Online Note AI
                </h1>
                <p className="text-muted-foreground">
                  Sign in to access your AI-powered notes
                </p>
              </div>
            </div>

            {/* Info Alert */}
            <Alert>
              <AlertDescription>
                Create an account or sign in with your existing credentials. Email verification may be required for new accounts.
              </AlertDescription>
            </Alert>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-sm text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="rounded-xl bg-input border-border focus:bg-background focus:border-ring focus:ring-2 focus:ring-ring"
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-sm text-muted-foreground mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="rounded-xl bg-input border-border focus:bg-background focus:border-ring focus:ring-2 focus:ring-ring pr-10 text-foreground"
                      required
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-xl"
                disabled={isSubmitting || isLoading || !email.trim() || !password.trim()}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                  onClick={() => navigate('/register')}
                  disabled={isSubmitting}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
