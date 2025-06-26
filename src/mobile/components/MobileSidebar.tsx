
import React from 'react';
import { X, User, Bell, Settings, LogOut, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../contexts/NotesContext';
import SyncStatusIndicator from '../../components/SyncStatusIndicator';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { syncStatus } = useNotes();
  const navigate = useNavigate();

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center justify-between">
            <span>Menu</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-4 border-b bg-muted/30">
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

          {/* Navigation Menu */}
          <div className="flex-1 p-4 space-y-2">
            <Button
              variant="ghost"
              onClick={() => handleNavigation('/mobile/notes')}
              className="w-full justify-start h-12"
            >
              <FileText className="w-5 h-5 mr-3" />
              Notes
            </Button>
            
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

          {/* Sign Out */}
          <div className="p-4 border-t">
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
