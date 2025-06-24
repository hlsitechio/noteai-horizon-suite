
import React from 'react';
import { Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className={`${isMobile ? 'text-center' : ''} space-y-2`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white dark:text-slate-900" />
          </div>
          <div>
            <h1 className={`font-semibold text-slate-900 dark:text-slate-100 tracking-tight ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
              Executive Dashboard
            </h1>
            <p className={`text-slate-600 dark:text-slate-400 font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
              Welcome back, {user?.name?.split(' ')[0]}
            </p>
          </div>
        </div>
        <p className={`text-slate-500 dark:text-slate-500 ${isMobile ? 'text-sm' : 'text-base'} max-w-2xl`}>
          Comprehensive overview of your knowledge management system and productivity metrics.
        </p>
      </div>
      <Button 
        size={isMobile ? "default" : "lg"} 
        onClick={onCreateNote} 
        className={`bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${isMobile ? 'w-full py-4' : 'px-8 py-3'} font-medium`}
      >
        <Plus className="w-5 h-5 mr-2" />
        Create Document
      </Button>
    </div>
  );
};

export default DashboardHeader;
