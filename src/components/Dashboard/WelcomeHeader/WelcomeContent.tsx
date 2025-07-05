
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
    <div className="absolute inset-0 flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 text-white">
      <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-0">
        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 ring-2 ring-white/30 shadow-lg hover:ring-white/50 transition-all duration-300">
          <AvatarImage src={user?.avatar} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-white/30 to-white/10 text-white text-sm sm:text-base md:text-lg font-semibold">
            {user?.name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-base sm:text-xl md:text-2xl font-bold mb-1 leading-tight">
            Welcome back, {getFirstName(user?.name || '')}! 👋
          </h1>
          <p className="text-xs sm:text-sm opacity-90 hidden sm:block">
            {formatDate(currentTime)}
          </p>
          <p className="text-xs opacity-90 sm:hidden">
            {formatDate(currentTime).split(',')[0]}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 text-right self-end sm:self-center">
        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
        <div>
          <div className="text-sm sm:text-base md:text-lg font-semibold">
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
