
import React from 'react';
import { Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationsContext';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';

interface SidebarMenuButtonProps {
  onNotificationsClick: () => void;
  isMobile: boolean;
}

export function SidebarMenuButton({ onNotificationsClick, isMobile }: SidebarMenuButtonProps) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const { isCollapsed } = useSidebarCollapse();
  const navigate = useNavigate();

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
        <Tooltip>
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
            <TooltipContent side="right">
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
            <TooltipContent side="right">
              <p>Notifications {unreadCount > 0 && `(${unreadCount})`}</p>
            </TooltipContent>
          )}
        </Tooltip>

        {/* Settings Button */}
        <Tooltip>
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
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
}
