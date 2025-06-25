
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock } from 'lucide-react';

const WelcomeHeader: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFirstName = (name: string) => {
    return name?.split(' ')[0] || 'User';
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 mb-6 border border-blue-100 dark:border-slate-600">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {getFirstName(user?.name || '')}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {formatDate(currentTime)}
          </p>
        </div>
        <div className="flex items-center gap-3 text-right">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Clock className="w-5 h-5" />
            <div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Local Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
