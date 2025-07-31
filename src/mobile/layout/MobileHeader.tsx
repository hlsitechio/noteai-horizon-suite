
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotes } from '../../contexts/NotesContext';
import SyncStatusIndicator from '../../components/SyncStatusIndicator';
import MobileSidebar from '../components/MobileSidebar';

const MobileHeader: React.FC = () => {
  const { syncStatus } = useNotes();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <header className="bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-semibold text-foreground truncate">
              NoteAI Suite
            </h1>
            <SyncStatusIndicator status={syncStatus} className="text-xs" />
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <MobileSidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
};

export default MobileHeader;
