
import React, { useState } from 'react';
import { Github, Book, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Logo */}
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                <Github className="text-white w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  Online Note AI
                </h1>
                <p className="text-gray-600">
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
                  <label className="text-sm text-gray-600 mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
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
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  className="text-blue-500 font-medium hover:underline"
                  onClick={() => navigate('/register')}
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
