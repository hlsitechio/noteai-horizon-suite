
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import SyncStatusIndicator from '../../components/SyncStatusIndicator';

const MobileHeader: React.FC = () => {
  const { user } = useAuth();
  const { syncStatus } = useNotes();

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold text-foreground truncate">
            NoteAI Suite
          </h1>
          <SyncStatusIndicator status={syncStatus} className="text-xs" />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Search className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bell className="h-4 w-4" />
          </Button>
          
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
