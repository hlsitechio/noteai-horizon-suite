
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import loginBg from '../../assets/login-gradient-bg.jpg';
import onaiLogo from '../../assets/onai-logo.png';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      const success = await login(data.email.trim(), data.password);

      if (success) {
        navigate('/app/dashboard', { replace: true });
      } else {
        setFormError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setFormError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted to-accent/10">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-primary rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
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
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto overflow-hidden rounded-2xl flex items-center justify-center">
                <img src={onaiLogo} alt="ONAi Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Online Note AI</h1>
                <p className="text-muted-foreground">Sign in to access your AI-powered notes</p>
              </div>
            </div>

            {/* Info Alert */}
            <Alert>
              <AlertDescription>
                Create an account or sign in with your existing credentials. Email verification may be required.
              </AlertDescription>
            </Alert>

            {/* Error Alert */}
            {formError && (
              <Alert variant="destructive">
                <AlertTitle>Login Failed</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm text-muted-foreground mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    placeholder="you@example.com"
                    {...register('email')}
                    className={`rounded-xl ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm text-muted-foreground mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      placeholder="••••••••"
                      {...register('password')}
                      className={`rounded-xl pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
                disabled={isSubmitting}
              >
                Sign up
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
