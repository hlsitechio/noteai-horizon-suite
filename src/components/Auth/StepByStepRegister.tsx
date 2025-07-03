
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEmailValidation } from './hooks/useEmailValidation';
import RegistrationStep from './RegistrationStep';
import RegistrationSummary from './RegistrationSummary';
import { Step, StepContent, RegistrationData } from './types';
import registerBg from '../../assets/register-gradient-bg-hq.jpg';

const StepByStepRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const { emailExists, isCheckingEmail, checkEmailExists, resetEmailExists } = useEmailValidation();
  
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 'name':
        return registrationData.name.trim().length >= 2;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registrationData.email) && !emailExists;
      case 'password':
        return registrationData.password.length >= 6;
      case 'confirmPassword':
        return registrationData.confirmPassword === registrationData.password && registrationData.confirmPassword.length >= 6;
      default:
        return false;
    }
  };

  const handleInputChange = async (value: string) => {
    console.log('Input change:', { currentStep, value });
    
    const updatedData = { ...registrationData };
    
    switch (currentStep) {
      case 'name':
        updatedData.name = value;
        break;
      case 'email':
        updatedData.email = value;
        resetEmailExists();
        break;
      case 'password':
        updatedData.password = value;
        break;
      case 'confirmPassword':
        updatedData.confirmPassword = value;
        break;
    }
    
    setRegistrationData(updatedData);
    
    // For email step, check if email exists after validation
    if (currentStep === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      console.log('Valid email format, checking if exists:', value);
      setTimeout(async () => {
        await checkEmailExists(value);
      }, 500); // Slightly longer delay to avoid too many API calls
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    const steps: Step[] = ['name', 'email', 'password', 'confirmPassword', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      setIsValid(false);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ['name', 'email', 'password', 'confirmPassword', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      setIsValid(true); // Since we're going back, the previous step should be valid
    }
  };

  const handleSubmit = async () => {
    const success = await register(registrationData.name, registrationData.email, registrationData.password);
    if (success) {
      // The auth context will handle the redirect after email verification
    }
  };

  const handleTogglePassword = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const getStepContent = (): StepContent | null => {
    switch (currentStep) {
      case 'name':
        return {
          icon: User,
          label: 'Full Name',
          placeholder: 'Enter your full name',
          value: registrationData.name,
          type: 'text',
        };
      case 'email':
        return {
          icon: Mail,
          label: 'Email',
          placeholder: 'Enter your email address',
          value: registrationData.email,
          type: 'email',
        };
      case 'password':
        return {
          icon: Lock,
          label: 'Password',
          placeholder: 'Create a strong password',
          value: registrationData.password,
          type: showPassword ? 'text' : 'password',
          showEye: true,
        };
      case 'confirmPassword':
        return {
          icon: Lock,
          label: 'Confirm Password',
          placeholder: 'Confirm your password',
          value: registrationData.confirmPassword,
          type: showConfirmPassword ? 'text' : 'password',
          showEye: true,
        };
      default:
        return null;
    }
  };

  // Update validation when email check completes
  useEffect(() => {
    console.log('Email validation state changed:', { emailExists, isCheckingEmail, currentStep });
    if (currentStep === 'email') {
      setIsValid(validateCurrentStep());
    }
  }, [emailExists, isCheckingEmail, currentStep]);

  // General validation update
  useEffect(() => {
    setIsValid(validateCurrentStep());
  }, [currentStep, registrationData, emailExists]);

  const stepContent = getStepContent();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${registerBg})` }}
    >
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {currentStep !== 'summary' && stepContent && (
            <RegistrationStep
              currentStep={currentStep}
              stepContent={stepContent}
              isValid={isValid}
              emailExists={emailExists}
              isCheckingEmail={isCheckingEmail}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              password={registrationData.password}
              confirmPassword={registrationData.confirmPassword}
              canGoBack={currentStep !== 'name'}
              onInputChange={handleInputChange}
              onNext={handleNext}
              onBack={handleBack}
              onTogglePassword={handleTogglePassword}
            />
          )}

          {currentStep === 'summary' && (
            <RegistrationSummary
              data={registrationData}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6 space-y-3"
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <button
              className="text-blue-500 dark:text-blue-400 font-medium hover:underline transition-colors"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Forgot your password?{' '}
            <button
              className="text-blue-500 dark:text-blue-400 font-medium hover:underline transition-colors"
              onClick={() => navigate('/reset-password')}
            >
              Reset it here
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StepByStepRegister;
