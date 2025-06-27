
import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import { useLocation } from 'react-router-dom';
import { useProjectRealms } from '../../contexts/ProjectRealmsContext';
import SyncStatusIndicator from '../SyncStatusIndicator';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { syncStatus } = useNotes();
  const { currentProject } = useProjectRealms();
  const location = useLocation();

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

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <SyncStatusIndicator status={syncStatus} />
          
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
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
