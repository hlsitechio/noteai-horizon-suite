// Shared sidebar actions hook
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useTheme } from '@/providers/ThemeProvider';
import { toggleTheme, isDarkMode } from '@/utils/themeUtils';
import { SidebarActionItem } from '../types';
import { Bell, LogOut, Settings, Sun, Moon, User } from 'lucide-react';

export function useSidebarActions() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { theme, setTheme } = useTheme();
  const isCurrentlyDark = isDarkMode(theme);

  const handleThemeToggle = useCallback(() => {
    const newTheme = toggleTheme(theme);
    setTheme(newTheme);
  }, [theme, setTheme]);

  const handleSettingsClick = useCallback(() => {
    navigate('/app/settings');
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    navigate('/app/profile');
  }, [navigate]);

  const handleNotificationsClick = useCallback(() => {
    // This would typically open a notifications panel
    console.log('Notifications clicked');
  }, []);

  // Standard action items that can be used across different sidebar implementations
  const getStandardActions = useCallback((): SidebarActionItem[] => [
    {
      icon: User,
      label: 'Profile',
      onClick: handleProfileClick
    },
    {
      icon: Bell,
      label: 'Notifications',
      onClick: handleNotificationsClick,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    {
      icon: isCurrentlyDark ? Sun : Moon,
      label: isCurrentlyDark ? 'Light Mode' : 'Dark Mode',
      onClick: handleThemeToggle
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: handleSettingsClick
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      onClick: logout
    }
  ], [
    handleProfileClick,
    handleNotificationsClick,
    handleThemeToggle,
    handleSettingsClick,
    logout,
    unreadCount,
    isCurrentlyDark
  ]);

  return {
    // Individual actions
    handleThemeToggle,
    handleSettingsClick,
    handleProfileClick,
    handleNotificationsClick,
    logout,
    
    // Grouped actions
    getStandardActions,
    
    // State
    unreadCount,
    isCurrentlyDark
  };
}