
import React from 'react';
import { Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../../contexts/AuthContext';

interface WelcomeContentProps {
  currentTime: Date;
}

const WelcomeContent: React.FC<WelcomeContentProps> = ({ currentTime }) => {
  const { user } = useAuth();

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
    <div className="absolute top-0 left-0 right-0 flex flex-col sm:flex-row items-start justify-between p-4 sm:p-6 text-white z-10">
      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
        <Avatar className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ring-2 ring-white/20 shadow-medium">
          <AvatarImage src={user?.avatar} className="object-cover" />
          <AvatarFallback className="bg-primary/20 text-white text-sm sm:text-base md:text-lg font-semibold">
            {user?.name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 leading-tight">
            Welcome back, {getFirstName(user?.name || '')}
          </h1>
          <p className="text-sm sm:text-base opacity-90">
            {formatDate(currentTime)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-right self-end sm:self-center">
        <Clock className="w-4 h-4 sm:w-5 sm:h-5 opacity-75" />
        <div>
          <div className="text-base sm:text-lg font-medium">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs opacity-75">
            Local Time
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeContent;
