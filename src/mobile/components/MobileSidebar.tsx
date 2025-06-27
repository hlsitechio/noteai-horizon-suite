
import React from 'react';
import { FileText, Bell, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MobileSidebarHeader from './MobileSidebarHeader';
import MobileSidebarProfile from './MobileSidebarProfile';
import MobileSidebarFolders from './MobileSidebarFolders';
import MobileSidebarSettings from './MobileSidebarSettings';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());
  const [expandedSettings, setExpandedSettings] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [autoSync, setAutoSync] = React.useState(true);

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

  const toggleSettings = () => {
    setExpandedSettings(!expandedSettings);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-[280px] p-0 h-full max-h-screen overflow-hidden border-r-0 fixed inset-y-0 left-0 z-50 bg-background"
      >
        <div className="flex flex-col h-full max-h-screen overflow-hidden bg-background">
          <MobileSidebarHeader onClose={onClose} />
          
          <MobileSidebarProfile />

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
              <MobileSidebarFolders
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
                onNavigate={handleNavigation}
              />

              <Separator className="my-4" />

              {/* Integrated Settings Section */}
              <MobileSidebarSettings
                expandedSettings={expandedSettings}
                onToggleSettings={toggleSettings}
                notifications={notifications}
                setNotifications={setNotifications}
                autoSync={autoSync}
                setAutoSync={setAutoSync}
              />
              
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
