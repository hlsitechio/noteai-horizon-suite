
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProjectRealms } from '../../contexts/ProjectRealmsContext';
import SyncStatusIndicator from '../SyncStatusIndicator';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { syncStatus } = useNotes();
  const { currentProject } = useProjectRealms();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/notes')) {
      return 'Your Notes';
    }
    if (path.includes('/analytics')) {
      return 'Analytics Dashboard';
    }
    if (path.includes('/projects')) {
      // Check if we're on a specific project detail page
      const projectIdMatch = path.match(/\/projects\/([^\/]+)$/);
      if (projectIdMatch && currentProject) {
        return currentProject.title;
      }
      return 'Project Manager';
    }
    if (path.includes('/dashboard')) {
      return 'Dashboard';
    }
    if (path.includes('/editor')) {
      return 'Note Editor';
    }
    if (path.includes('/calendar')) {
      return 'Calendar';
    }
    if (path.includes('/chat')) {
      return 'AI Chat';
    }
    if (path.includes('/settings')) {
      return 'Settings';
    }
    
    return 'NoteAI Horizon Suite';
  };

  const handleSettingsClick = () => {
    navigate('/app/settings');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <SyncStatusIndicator status={syncStatus} />
          
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleSettingsClick}>
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Avatar className="w-7 h-7">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-xs">
                {user?.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.email || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
