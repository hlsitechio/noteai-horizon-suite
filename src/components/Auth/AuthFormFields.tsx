
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthFormFieldsProps {
  isSignUp: boolean;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
}

const AuthFormFields: React.FC<AuthFormFieldsProps> = ({
  isSignUp,
  name,
  email,
  password,
  confirmPassword,
  showPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
}) => {
  return (
    <div className="space-y-4">
      {isSignUp && (
        <div>
          <Label htmlFor="auth-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Full Name
          </Label>
          <Input
            id="auth-name"
            name="fullName"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your full name"
            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            required
            autoComplete="name"
          />
        </div>
      )}

      <div>
        <Label htmlFor="auth-email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Email
        </Label>
        <Input
          id="auth-email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email"
          className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <Label htmlFor="auth-password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Password
        </Label>
        <div className="relative">
          <Input
            id="auth-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder={isSignUp ? "Create a password" : "Enter your password"}
            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 pr-12"
            required
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onTogglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {isSignUp && (
        <div>
          <Label htmlFor="auth-confirm-password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Confirm Password
          </Label>
          <Input
            id="auth-confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Confirm your password"
            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            required
            autoComplete="new-password"
          />
        </div>
      )}

      {!isSignUp && (
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Forgot password?
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthFormFields;
