
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
    <div className="absolute inset-0 flex items-center justify-between p-4 text-white">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 ring-2 ring-white/30 shadow-lg hover:ring-white/50 transition-all duration-300">
          <AvatarImage src={user?.avatar} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-white/30 to-white/10 text-white text-lg font-semibold">
            {user?.name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Welcome back, {getFirstName(user?.name || '')}! 👋
          </h1>
          <p className="text-sm opacity-90">
            {formatDate(currentTime)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-right">
        <Clock className="w-4 h-4" />
        <div>
          <div className="text-lg font-semibold">
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
