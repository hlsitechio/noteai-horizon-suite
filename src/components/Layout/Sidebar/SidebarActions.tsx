
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bell, Moon, Sun, Settings, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationsContext';
import { useTheme } from '@/providers/ThemeProvider';
import { toggleTheme, isDarkMode } from '@/utils/themeUtils';
import { useNavigate } from 'react-router-dom';

interface SidebarActionsProps {
  onNotificationsClick: () => void;
  isExpanded?: boolean;
}

export function SidebarActions({ onNotificationsClick, isExpanded = true }: SidebarActionsProps) {
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isCurrentlyDark = isDarkMode(theme);

  const handleThemeToggle = () => {
    const newTheme = toggleTheme(theme);
    setTheme(newTheme);
  };

  const handleSettingsClick = () => {
    navigate('/app/settings');
  };

  if (!isExpanded) {
    return null;
  }

  return (
    <>
      <DropdownMenuItem onClick={onNotificationsClick}>
        <Bell className="w-4 h-4 mr-2" />
        Notifications
        {unreadCount > 0 && (
          <Badge className="h-4 min-w-4 p-0 bg-red-500 border-0 text-xs ml-auto">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleThemeToggle}>
        {isCurrentlyDark ? (
          <>
            <Sun className="w-4 h-4 mr-2" />
            Light Mode
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 mr-2" />
            Dark Mode
          </>
        )}
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleSettingsClick}>
        <Settings className="w-4 h-4 mr-2" />
        Settings
      </DropdownMenuItem>
    </>
  );
}

export function SidebarSignOutButton({ isExpanded = true, isMobile = false }: { isExpanded?: boolean; isMobile?: boolean }) {
  const { logout } = useAuth();

  if (!isExpanded) {
    return null;
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="ghost"
        onClick={logout}
        className="w-full justify-start h-10 text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        <div className="flex items-center gap-3">
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </div>
      </Button>
    </motion.div>
  );
}
