
import React, { useState } from 'react';
import { Github, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const success = await register(name, email, password);
    if (success) {
      // Don't navigate immediately - user needs to verify email
      // The auth context will handle the redirect after verification
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
                  Create Account
                </h1>
                <p className="text-gray-600">
                  Join Online Note AI and start taking smart notes
                </p>
              </div>
            </div>

            {/* Info Alert */}
            <Alert>
              <AlertDescription>
                After creating your account, please check your email to verify your address before signing in.
              </AlertDescription>
            </Alert>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 pl-10 pr-10"
                      required
                      minLength={6}
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

                <div>
                  <label className="text-sm text-gray-600 mb-2 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 pl-10 pr-10"
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  className="text-blue-500 font-medium hover:underline"
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
