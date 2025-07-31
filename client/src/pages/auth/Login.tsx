import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { usePublicPageTheme } from '@/hooks/usePublicPageTheme';
import { useAuth } from '@/contexts/AuthContext';

const Login: React.FC = () => {
  // Ensure clean theme for public auth page
  usePublicPageTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated - disable automatic redirect to allow onboarding check
  useEffect(() => {
    // Disable automatic redirect to allow post-login onboarding status check
    // Navigation will be handled in the handleLogin function
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        toast.success('Login successful!');
        
        // Wait a moment for the user context to update, then check onboarding status
        setTimeout(async () => {
          try {
            // Get user data from context (should be available after successful login)
            if (user?.id) {
              // Check onboarding status
              const onboardingResponse = await fetch(`/api/auth/onboarding-status/${user.id}`);
              if (onboardingResponse.ok) {
                const onboardingData = await onboardingResponse.json();
                
                // Route based on onboarding status
                if (onboardingData.onboarding_completed) {
                  // Existing user - go to dashboard
                  navigate('/app/dashboard', { replace: true });
                } else {
                  // New user - go to onboarding
                  navigate('/setup/onboarding', { replace: true });
                }
              } else {
                // Fallback to onboarding for new users if status check fails
                navigate('/setup/onboarding', { replace: true });
              }
            } else {
              // If no user context yet, fallback to dashboard
              navigate('/app/dashboard', { replace: true });
            }
          } catch (error) {
            console.log('Onboarding status check failed, defaulting to dashboard:', error);
            navigate('/app/dashboard', { replace: true });
          }
        }, 100); // Small delay to ensure user context is updated
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-700 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
            <p className="text-gray-400">Sign in to your account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/auth/reset-password"
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {authLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/auth/register" className="text-purple-400 hover:text-purple-300">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-4">
              <Link
                to="/public/landing"
                className="flex items-center justify-center text-sm text-gray-400 hover:text-gray-300"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
