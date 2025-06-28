
import React from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationsContext';

interface SidebarCollapsedActionsProps {
  onNotificationsClick: () => void;
}

export function SidebarCollapsedActions({ onNotificationsClick }: SidebarCollapsedActionsProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  return (
    <div className="flex flex-col items-center gap-3">
      {/* User Avatar */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className="w-10 h-10 border-2 border-deep-carbon-600 cursor-pointer">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
              {user?.name?.[0] || <User className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="text-sm">
            <p className="font-semibold">{user?.name || 'User'}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Notifications Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationsClick}
            className="relative w-10 h-10 text-deep-carbon-200 hover:text-white hover:bg-deep-carbon-800/50"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 min-w-5 text-xs bg-red-500 hover:bg-red-600 px-1"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Notifications {unreadCount > 0 && `(${unreadCount})`}</p>
        </TooltipContent>
      </Tooltip>

      {/* Sign Out Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="w-10 h-10 text-deep-carbon-200 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Sign Out</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
