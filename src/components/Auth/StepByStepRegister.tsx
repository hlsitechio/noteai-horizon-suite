
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, User, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Step = 'name' | 'email' | 'password' | 'confirmPassword' | 'summary';

const StepByStepRegister: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 'name':
        return name.trim().length >= 2;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      case 'password':
        return password.length >= 6;
      case 'confirmPassword':
        return confirmPassword === password && confirmPassword.length >= 6;
      default:
        return false;
    }
  };

  const handleInputChange = (value: string) => {
    switch (currentStep) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
    setIsValid(false);
    
    // Check validation after a short delay
    setTimeout(() => {
      setIsValid(validateCurrentStep());
    }, 300);
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

  const handleSubmit = async () => {
    if (currentStep === 'summary') {
      const success = await register(name, email, password);
      if (success) {
        // The auth context will handle the redirect after email verification
      }
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'name':
        return {
          icon: User,
          label: 'Full Name',
          placeholder: 'Enter your full name',
          value: name,
          type: 'text' as const,
        };
      case 'email':
        return {
          icon: Mail,
          label: 'Email',
          placeholder: 'Enter your email address',
          value: email,
          type: 'email' as const,
        };
      case 'password':
        return {
          icon: Lock,
          label: 'Password',
          placeholder: 'Create a strong password',
          value: password,
          type: showPassword ? 'text' : 'password' as const,
          showEye: true,
        };
      case 'confirmPassword':
        return {
          icon: Lock,
          label: 'Confirm Password',
          placeholder: 'Confirm your password',
          value: confirmPassword,
          type: showConfirmPassword ? 'text' : 'password' as const,
          showEye: true,
        };
      default:
        return null;
    }
  };

  React.useEffect(() => {
    setIsValid(validateCurrentStep());
  }, [currentStep, name, email, password, confirmPassword]);

  const stepContent = getStepContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {currentStep !== 'summary' && stepContent && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <stepContent.icon className="text-white w-8 h-8" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p className="text-gray-600">{stepContent.label}</p>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Input
                    type={stepContent.type}
                    value={stepContent.value}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={stepContent.placeholder}
                    className="h-14 rounded-xl text-lg pr-20 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    autoFocus
                  />
                  
                  {stepContent.showEye && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-12 top-1/2 transform -translate-y-1/2"
                      onClick={() => {
                        if (currentStep === 'password') setShowPassword(!showPassword);
                        if (currentStep === 'confirmPassword') setShowConfirmPassword(!showConfirmPassword);
                      }}
                    >
                      {(currentStep === 'password' ? showPassword : showConfirmPassword) ? 
                        <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />
                      }
                    </Button>
                  )}

                  <AnimatePresence>
                    {isValid && (
                      <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onClick={handleNext}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Check className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {currentStep === 'confirmPassword' && password !== confirmPassword && confirmPassword.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center"
                  >
                    Passwords do not match
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}

          {currentStep === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <Check className="text-white w-8 h-8" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">Almost Ready!</h2>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6 space-y-3">
                <p className="text-gray-600 text-sm font-medium">You are going to be registered as:</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-800">{email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-800">{name}</span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-lg font-semibold text-gray-800">
                  Thank you and welcome to our app! 🎉
                </p>
                
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              className="text-blue-500 font-medium hover:underline"
              onClick={() => navigate('/login')}
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StepByStepRegister;
