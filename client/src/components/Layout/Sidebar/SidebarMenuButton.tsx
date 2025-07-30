
import React from 'react';
import { Bell, User, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationsContext';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useTheme } from '@/providers/ThemeProvider';

import { toggleTheme, isDarkMode } from '@/utils/themeUtils';
import { useNavigate } from 'react-router-dom';

interface SidebarMenuButtonProps {
  onNotificationsClick: () => void;
  isMobile: boolean;
}

export function SidebarMenuButton({ onNotificationsClick, isMobile }: SidebarMenuButtonProps) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { isCollapsed } = useSidebarCollapse();
  const { theme, setTheme } = useTheme();
  
  const navigate = useNavigate();
  const isCurrentlyDark = isDarkMode(theme);

  // Enhanced hover styles with sidebar theme colors
  const getButtonHoverStyles = () => {
    return `w-full h-8 text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm group relative overflow-hidden ${
      isCollapsed || isMobile ? 'justify-center px-0' : 'justify-start px-2'
    }`;
  };

  const handleThemeToggle = () => {
    console.log('Theme toggle clicked. Current theme:', theme);
    const newTheme = toggleTheme(theme);
    console.log('New theme will be:', newTheme);
    console.log('Calling setTheme with:', newTheme);
    setTheme(newTheme);
    
    // Force verify after a short delay
    setTimeout(() => {
      const stored = localStorage.getItem('online-note-ai-theme');
      console.log('Theme after toggle - stored:', stored, 'current:', theme);
    }, 100);
  };

  const handleSettingsClick = () => {
    navigate('/app/settings');
  };

  const handleProfileClick = () => {
    navigate('/app/settings?tab=profile');
  };

  return (
    <div className="space-y-0.5">
      {/* Action Buttons */}
      <div className="space-y-0.5">
        {/* Profile Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleProfileClick}
              className={getButtonHoverStyles()}
            >
              <div className={`flex items-center ${isCollapsed || isMobile ? 'justify-center' : 'gap-2'} relative z-10`}>
                <User className="w-5 h-5" />
                {!isCollapsed && !isMobile && <span>Profile</span>}
              </div>
            </Button>
          </TooltipTrigger>
          {(isCollapsed || isMobile) && (
            <TooltipContent side="right" sideOffset={8}>
              <p>Profile</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Notifications Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={onNotificationsClick}
              className={getButtonHoverStyles()}
            >
              <div className={`relative flex items-center ${isCollapsed || isMobile ? 'justify-center' : 'gap-2'} relative z-10`}>
                <Bell className="w-5 h-5" />
                {!isCollapsed && !isMobile && <span>Notifications</span>}
                {unreadCount > 0 && !isCollapsed && !isMobile && (
                  <Badge 
                    variant="destructive" 
                    className="ml-auto h-5 min-w-5 text-xs bg-red-500 hover:bg-red-600"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
                {unreadCount > 0 && (isCollapsed || isMobile) && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                )}
              </div>
            </Button>
          </TooltipTrigger>
          {(isCollapsed || isMobile) && (
            <TooltipContent side="right" sideOffset={8}>
              <p>Notifications {unreadCount > 0 && `(${unreadCount})`}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Separator */}
        {!isCollapsed && !isMobile && (
          <div className="px-2 py-1">
            <Separator />
          </div>
        )}

        {/* Theme Toggle Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleThemeToggle}
              className={getButtonHoverStyles()}
            >
              <div className={`flex items-center ${isCollapsed || isMobile ? 'justify-center' : 'gap-2'} relative z-10`}>
                {isCurrentlyDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                {!isCollapsed && !isMobile && (
                  <span>{isCurrentlyDark ? 'Light Mode' : 'Dark Mode'}</span>
                )}
              </div>
            </Button>
          </TooltipTrigger>
          {(isCollapsed || isMobile) && (
            <TooltipContent side="right" sideOffset={8}>
              <p>{isCurrentlyDark ? 'Light Mode' : 'Dark Mode'}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Settings Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleSettingsClick}
              className={getButtonHoverStyles()}
            >
              <div className={`flex items-center ${isCollapsed || isMobile ? 'justify-center' : 'gap-2'} relative z-10`}>
                <Settings className="w-5 h-5" />
                {!isCollapsed && !isMobile && <span>Settings</span>}
              </div>
            </Button>
          </TooltipTrigger>
          {(isCollapsed || isMobile) && (
            <TooltipContent side="right" sideOffset={8}>
              <p>Settings</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
