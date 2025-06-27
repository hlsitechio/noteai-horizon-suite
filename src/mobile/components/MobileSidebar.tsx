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
const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose
}) => {
  const {
    logout
  } = useAuth();
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
  return <Sheet open={isOpen} onOpenChange={onClose}>
      
    </Sheet>;
};
export default MobileSidebar;