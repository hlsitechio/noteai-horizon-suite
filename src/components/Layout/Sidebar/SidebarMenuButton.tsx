
import React from 'react';
import { Bell, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationsContext';
import { useNavigate } from 'react-router-dom';

interface SidebarMenuButtonProps {
  onNotificationsClick: () => void;
  isMobile: boolean;
}

export function SidebarMenuButton({ onNotificationsClick, isMobile }: SidebarMenuButtonProps) {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/app/settings');
  };

  return (
    <div className="space-y-2">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">
            {user?.name || 'User'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user?.email || 'user@example.com'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-1">
        {/* Notifications Button */}
        <Button
          variant="ghost"
          onClick={onNotificationsClick}
          className="w-full justify-start h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <div className="relative flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-auto h-5 min-w-5 text-xs bg-red-500 hover:bg-red-600"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
        </Button>

        {/* Settings Button */}
        <Button
          variant="ghost"
          onClick={handleSettingsClick}
          className="w-full justify-start h-10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
