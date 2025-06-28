
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StepContent, Step } from './types';

interface RegistrationStepProps {
  currentStep: Step;
  stepContent: StepContent;
  isValid: boolean;
  emailExists: boolean;
  isCheckingEmail: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  password: string;
  confirmPassword: string;
  canGoBack: boolean;
  onInputChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onTogglePassword: (field: 'password' | 'confirmPassword') => void;
}

const RegistrationStep: React.FC<RegistrationStepProps> = ({
  currentStep,
  stepContent,
  isValid,
  emailExists,
  isCheckingEmail,
  showPassword,
  showConfirmPassword,
  password,
  confirmPassword,
  canGoBack,
  onInputChange,
  onNext,
  onBack,
  onTogglePassword
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      key={currentStep}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8"
      role="dialog"
      aria-labelledby="registration-title"
      aria-describedby="registration-description"
    >
      {/* Back button */}
      {canGoBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>
      )}

      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <stepContent.icon className="text-white w-8 h-8" />
        </motion.div>
        <h2 id="registration-title" className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h2>
        <p id="registration-description" className="text-gray-600 dark:text-gray-300">{stepContent.label}</p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <Input
            type={stepContent.type}
            value={stepContent.value}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={stepContent.placeholder}
            className="h-14 rounded-xl text-lg pr-20 bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:bg-white dark:focus:bg-slate-600 focus:border-blue-300 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/20"
            autoFocus
            disabled={isCheckingEmail}
            aria-describedby={emailExists ? "email-error" : undefined}
          />
          
          {stepContent.showEye && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => onTogglePassword(currentStep as 'password' | 'confirmPassword')}
              aria-label={`${(currentStep === 'password' ? showPassword : showConfirmPassword) ? 'Hide' : 'Show'} password`}
            >
              {(currentStep === 'password' ? showPassword : showConfirmPassword) ? 
                <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />
              }
            </Button>
          )}

          {isCheckingEmail && currentStep === 'email' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-label="Checking email availability">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}

          <AnimatePresence>
            {/* Show red X when email exists */}
            {emailExists && currentStep === 'email' && !isCheckingEmail && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg"
                aria-label="Email already exists"
              >
                <X className="w-4 h-4" />
              </motion.div>
            )}

            {/* Show green checkmark when valid and email doesn't exist */}
            {isValid && !isCheckingEmail && !emailExists && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={onNext}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200"
                aria-label="Continue to next step"
              >
                <Check className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Email exists message below input */}
        {emailExists && currentStep === 'email' && !isCheckingEmail && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            id="email-error"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              This email is already registered.{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Sign in instead
              </button>
            </p>
          </motion.div>
        )}

        {currentStep === 'confirmPassword' && password !== confirmPassword && confirmPassword.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 dark:text-red-400 text-sm text-center"
          >
            Passwords do not match
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default RegistrationStep;
