
import React from 'react';
import { X, User, Bell, Settings, LogOut, Home, FileText, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';
import { useFolders } from '../../contexts/FoldersContext';
import SyncStatusIndicator from '../../components/SyncStatusIndicator';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { syncStatus, notes } = useNotes();
  const { folders } = useFolders();
  const navigate = useNavigate();
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());

  const handleSignOut = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder: any) => {
    const folderNotes = notes.filter(note => note.folder_id === folder.id);
    const isFolderExpanded = expandedFolders.has(folder.id);

    return (
      <div key={folder.id} className="space-y-1">
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFolder(folder.id)}
            className="p-1 h-8 w-8 flex-shrink-0"
          >
            {isFolderExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => handleNavigation(`/app/folders/${folder.id}`)}
            className="flex-1 justify-start h-10 px-2"
          >
            <div 
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
              style={{ backgroundColor: folder.color }}
            />
            <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate text-sm flex-1">{folder.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {folderNotes.length}
            </span>
          </Button>
        </div>
        
        {/* Folder Notes */}
        {isFolderExpanded && folderNotes.length > 0 && (
          <div className="ml-6 space-y-1">
            {folderNotes.slice(0, 5).map((note) => (
              <Button
                key={note.id}
                variant="ghost"
                onClick={() => handleNavigation(`/mobile/notes?note=${note.id}`)}
                className="w-full justify-start h-8 px-2 text-xs"
              >
                <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{note.title}</span>
              </Button>
            ))}
            {folderNotes.length > 5 && (
              <div className="text-xs text-muted-foreground px-2">
                +{folderNotes.length - 5} more notes
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-[250px] p-0 h-full max-h-screen overflow-hidden border-r-0"
        style={{ 
          position: 'absolute',
          top: 0,
          left: isOpen ? 0 : '-250px',
          height: '100%',
          maxHeight: '100vh',
          zIndex: 40,
          transform: 'none',
          transition: 'left 0.3s ease-out'
        }}
      >
        <div className="flex flex-col h-full max-h-screen overflow-hidden bg-background">
          <SheetHeader className="p-4 border-b flex-shrink-0">
            <SheetTitle className="flex items-center justify-between">
              <span>Menu</span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          
          {/* Profile Section */}
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

          {/* Navigation Menu - Scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 space-y-2">
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/mobile/notes')}
                className="w-full justify-start h-12"
              >
                <FileText className="w-5 h-5 mr-3" />
                Notes
              </Button>

              {/* Folders Section */}
              {folders.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center px-2 py-1">
                    <Folder className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium text-muted-foreground">Folders</span>
                  </div>
                  <div className="space-y-1">
                    {folders.map(renderFolder)}
                  </div>
                </div>
              )}
              
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/mobile/settings')}
                className="w-full justify-start h-12"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => handleNavigation('/app/notes')}
                className="w-full justify-start h-12"
              >
                <Home className="w-5 h-5 mr-3" />
                Desktop View
              </Button>
            </div>

            {/* Notifications Section */}
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start h-12"
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </Button>
            </div>
          </div>

          {/* Sign Out - Fixed at bottom */}
          <div className="p-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
