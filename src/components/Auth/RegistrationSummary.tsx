
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RegistrationData } from './types';

interface RegistrationSummaryProps {
  data: RegistrationData;
  isLoading: boolean;
  onSubmit: () => void;
}

const RegistrationSummary: React.FC<RegistrationSummaryProps> = ({
  data,
  isLoading,
  onSubmit
}) => {
  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
      >
        <Check className="text-white w-8 h-8" />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Almost Ready!</h2>
      
      <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-6 mb-6 space-y-3">
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">You are going to be registered as:</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Email:</span>
            <span className="font-semibold text-gray-800 dark:text-white">{data.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Name:</span>
            <span className="font-semibold text-gray-800 dark:text-white">{data.name}</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <p className="text-lg font-semibold text-gray-800 dark:text-white">
          Thank you and welcome to our app! 🎉
        </p>
        
        <Button
          onClick={onSubmit}
          size="lg"
          className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default RegistrationSummary;
