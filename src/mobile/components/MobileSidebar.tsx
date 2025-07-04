
import React from 'react';
import { FileText, Bell, LogOut, Home, MessageCircle, Folder, BarChart3, Settings } from 'lucide-react';
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

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose
}) => {
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

  const navigationItems = [
    { icon: Home, label: 'Dashboard', path: '/mobile/dashboard' },
    { icon: FileText, label: 'Notes', path: '/mobile/notes' },
    { icon: MessageCircle, label: 'AI Chat', path: '/mobile/chat' },
    { icon: Folder, label: 'Projects', path: '/mobile/projects' },
    { icon: BarChart3, label: 'Analytics', path: '/mobile/analytics' },
    { icon: Settings, label: 'Settings', path: '/mobile/settings' }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 p-0 bg-background">
        <div className="flex flex-col h-full">
          {/* Header */}
          <MobileSidebarHeader onClose={onClose} />
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Profile Section */}
              <MobileSidebarProfile />
              
              <Separator />
              
              {/* Navigation */}
              <div className="space-y-1">
                {navigationItems.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => handleNavigation(item.path)}
                      className="w-full justify-start h-12"
                    >
                      <ItemIcon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
              
              <Separator />
              
              {/* Folders */}
              <MobileSidebarFolders
                expandedFolders={expandedFolders}
                onToggleFolder={toggleFolder}
                onNavigate={handleNavigation}
              />
              
              <Separator />
              
              {/* Settings */}
              <MobileSidebarSettings
                expandedSettings={expandedSettings}
                onToggleSettings={toggleSettings}
                notifications={notifications}
                setNotifications={setNotifications}
                autoSync={autoSync}
                setAutoSync={setAutoSync}
              />
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
