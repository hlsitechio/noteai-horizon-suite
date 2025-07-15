
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

  const handleThemeToggle = () => {
    const newTheme = toggleTheme(theme);
    setTheme(newTheme);
  };

  const handleSettingsClick = () => {
    navigate('/app/settings');
  };

  const handleProfileClick = () => {
    navigate('/app/settings?tab=profile');
  };

  return (
    <div className="space-y-2">
      {/* Action Buttons */}
      <div className="space-y-1">
        {/* Profile Button */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleProfileClick}
              className={`w-full h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ${
                isCollapsed || isMobile ? 'justify-center px-0' : 'justify-start px-3'
              }`}
            >
              <div className={`flex items-center ${isCollapsed || isMobile ? 'justify-center' : 'gap-3'}`}>
                <User className="w-5 h-5" />
                {!isCollapsed && !isMobile && <span>Profile</span>}
              </div>
            </Button>
          </TooltipTrigger>
          {(isCollapsed || isMobile) && (
            <TooltipContent 
              side="right" 
              className="bg-popover border border-border shadow-md z-50"
              sideOffset={12}
            >
              <p className="text-sm font-medium">Profile</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Notifications Button */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={onNotificationsClick}
              className={`w-full h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ${
                isCollapsed || isMobile ? 'justify-center px-0' : 'justify-start px-3'
              }`}
            >
              <div className={`relative flex items-center ${isCollapsed || isMobile ? 'justify-center' : 'gap-3'}`}>
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
            <TooltipContent 
              side="right" 
              className="bg-popover border border-border shadow-md z-50"
              sideOffset={12}
            >
              <p className="text-sm font-medium">Notifications {unreadCount > 0 && `(${unreadCount})`}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Separator */}
        {!isCollapsed && !isMobile && (
          <div className="px-3 py-2">
            <Separator />
          </div>
        )}

        {/* Theme Toggle Button */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleThemeToggle}
              className={`w-full h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ${
                isCollapsed || isMobile ? 'justify-center px-0' : 'justify-start px-3'
              }`}
            >
              <div className={`flex items-center ${isCollapsed || isMobile ? 'justify-center' : 'gap-3'}`}>
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
            <TooltipContent 
              side="right" 
              className="bg-popover border border-border shadow-md z-50"
              sideOffset={12}
            >
              <p className="text-sm font-medium">{isCurrentlyDark ? 'Light Mode' : 'Dark Mode'}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Settings Button */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleSettingsClick}
              className={`w-full h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors ${
                isCollapsed || isMobile ? 'justify-center px-0' : 'justify-start px-3'
              }`}
            >
              <div className={`flex items-center ${isCollapsed || isMobile ? 'justify-center' : 'gap-3'}`}>
                <Settings className="w-5 h-5" />
                {!isCollapsed && !isMobile && <span>Settings</span>}
              </div>
            </Button>
          </TooltipTrigger>
          {(isCollapsed || isMobile) && (
            <TooltipContent 
              side="right" 
              className="bg-popover border border-border shadow-md z-50"
              sideOffset={12}
            >
              <p className="text-sm font-medium">Settings</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
