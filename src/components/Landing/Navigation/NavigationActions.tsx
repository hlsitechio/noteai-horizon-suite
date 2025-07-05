import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NavigationActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={() => navigate('/login')}
        variant="ghost"
        className="hidden md:inline-flex text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
      >
        Sign In
      </Button>
      <div className="relative group">
        <Button
          onClick={() => {
            console.log('Navigation: Get Started clicked');
            navigate('/register');
          }}
          className="hidden md:inline-flex bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </Button>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default NavigationActions;