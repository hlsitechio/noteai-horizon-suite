
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="relative h-64 overflow-hidden rounded-xl mb-6 border border-blue-100 dark:border-slate-600">
      {/* Banner Background - Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Banner Placeholder Content */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="text-center text-white">
          <Image className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg font-medium">Banner Image Placeholder</p>
          <p className="text-sm">Upload a banner to personalize your dashboard</p>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-end p-8">
        <div className="text-white flex-1">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {getFirstName(user?.name || '')}! 👋
          </h1>
          <p className="text-xl text-white/90 mb-4">
            {formatDate(currentTime)}
          </p>
        </div>
        
        <div className="flex items-center gap-3 text-right">
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-5 h-5" />
            <div>
              <div className="text-lg font-semibold text-white">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-white/70">
                Local Time
              </div>
            </div>
          </div>
          
          {/* Upload Banner Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 border border-white/30"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Banner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
