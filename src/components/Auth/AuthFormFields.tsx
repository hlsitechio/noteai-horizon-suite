
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
          <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Full Name
          </label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your full name"
            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            required
            minLength={2}
            maxLength={50}
            autoComplete="name"
            autoFocus={isSignUp}
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Email Address
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email address"
          className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
          required
          autoComplete={isSignUp ? "email" : "username email"}
          autoFocus={!isSignUp}
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder={isSignUp ? "Create a strong password (min. 6 characters)" : "Enter your password"}
            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 pr-12"
            required
            minLength={6}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            data-lpignore="false"
            data-form-type="password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onTogglePassword}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        {isSignUp && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Password must be at least 6 characters long
          </p>
        )}
      </div>

      {isSignUp && (
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Confirm Password
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Confirm your password"
            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
            required
            autoComplete="new-password"
            data-lpignore="false"
          />
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              Passwords do not match
            </p>
          )}
        </div>
      )}

      {!isSignUp && (
        <div className="text-right">
          <button
            type="button"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
            onClick={() => {
              // This would open a password reset modal or navigate to reset page
              console.log('Password reset requested');
              // For now, we'll just log it - you can implement a reset modal later
            }}
          >
            Forgot your password?
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthFormFields;
