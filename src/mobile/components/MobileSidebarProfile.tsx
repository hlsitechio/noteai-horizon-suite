
import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import SyncStatusIndicator from '../../components/SyncStatusIndicator';

const MobileSidebarProfile: React.FC = () => {
  const { user } = useAuth();
  const { syncStatus } = useNotes();

  return (
    <div className="p-4 border-b bg-muted/30 flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {user?.email}
          </p>
          <div className="flex items-center space-x-2 mt-1">
            <SyncStatusIndicator status={syncStatus} className="text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebarProfile;
