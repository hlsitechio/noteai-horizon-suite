
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AuthToggle from './AuthToggle';
import AuthFormFields from './AuthFormFields';
import DemoCredentials from './DemoCredentials';

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    if (!email.trim() || !password.trim()) {
      return false;
    }

    if (isSignUp) {
      if (!name.trim() || name.trim().length < 2) {
        return false;
      }
      if (password.length < 6) {
        return false;
      }
      if (password !== confirmPassword) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isSignUp) {
        const success = await register(name.trim(), email.trim(), password);
        if (success) {
          // Don't navigate immediately for signup - user might need to verify email
          console.log('Registration successful');
        }
      } else {
        const success = await login(email.trim(), password);
        if (success) {
          navigate('/app/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('Auth form error:', error);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-950 dark:from-black dark:via-gray-900 dark:to-slate-900">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Subtle light rays effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent opacity-20"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FileText className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Online Note AI
            </h1>
          </div>

          {/* Toggle Buttons */}
          <AuthToggle isSignUp={isSignUp} onToggle={setIsSignUp} />

          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-300 mt-2">
              {isSignUp 
                ? 'Join thousands of users organizing their thoughts with AI'
                : 'Sign in to access your AI-powered notes'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthFormFields
              isSignUp={isSignUp}
              name={name}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              showPassword={showPassword}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !validateForm()}
            >
              {isLoading 
                ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                : (isSignUp ? 'Create Account' : 'Sign In')
              }
            </Button>
          </form>

          {/* Info section */}
          <DemoCredentials />

          {/* Additional info */}
          <div className="text-center text-xs text-gray-400">
            <p>
              By {isSignUp ? 'creating an account' : 'signing in'}, you agree to our{' '}
              <button className="underline hover:text-gray-300 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 rounded">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="underline hover:text-gray-300 focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-1 rounded">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
