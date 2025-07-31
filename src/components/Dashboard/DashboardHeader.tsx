
import React from 'react';
import { Plus, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/use-mobile';

interface DashboardHeaderProps {
  onCreateNote: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onCreateNote }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className={`flex w-full ${isMobile ? 'flex-col space-y-6' : 'justify-between items-start'}`}>
      <div className={`${isMobile ? 'text-center' : ''} space-y-3`}>
        <div className="flex items-center gap-4 mb-3">
          <Avatar className="w-14 h-14 ring-2 ring-primary/20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg">
              {user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className={`font-bold text-foreground tracking-tight ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
              Intelligence Dashboard
            </h1>
            <p className={`text-muted-foreground font-medium ${isMobile ? 'text-sm' : 'text-lg'}`}>
              Welcome back, {user?.name?.split(' ')[0]}
            </p>
          </div>
        </div>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'} max-w-2xl`}>
          Your AI-powered knowledge management system. Create, organize, and enhance your thoughts with intelligent assistance.
        </p>
      </div>
      <Button 
        size={isMobile ? "default" : "lg"} 
        onClick={onCreateNote} 
        className={`bg-accent hover:bg-accent/90 text-accent-foreground border-0 shadow-premium hover:shadow-large transition-all duration-300 hover:-translate-y-1 hover:scale-105 ${isMobile ? 'w-full py-4' : 'px-8 py-4'} font-semibold rounded-xl`}
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Document
      </Button>
    </div>
  );
};

export default DashboardHeader;
