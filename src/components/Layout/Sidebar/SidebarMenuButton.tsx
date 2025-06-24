
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '../../../contexts/NotificationsContext';
import { SidebarProfile } from './SidebarProfile';
import { SidebarActions } from './SidebarActions';

interface SidebarMenuButtonProps {
  isCollapsed: boolean;
  onNotificationsClick: () => void;
}

export function SidebarMenuButton({ isCollapsed, onNotificationsClick }: SidebarMenuButtonProps) {
  const { unreadCount } = useNotifications();

  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-11 h-11 rounded-xl hover:bg-accent/10 relative"
              >
                <MoreVertical className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" as const }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="h-4 min-w-4 p-0 bg-red-500 border-0 text-xs">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Menu</p>
            </TooltipContent>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="w-56">
          <SidebarProfile />
          <DropdownMenuSeparator />
          <SidebarActions onNotificationsClick={onNotificationsClick} />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start h-9 rounded-lg hover:bg-accent/10 transition-colors relative"
          >
            <MoreVertical className="w-4 h-4 mr-2" />
            Menu
            {unreadCount > 0 && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" as const }}
                className="ml-auto"
              >
                <Badge className="h-4 min-w-4 p-0 bg-red-500 border-0 text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <SidebarProfile />
        <DropdownMenuSeparator />
        <SidebarActions onNotificationsClick={onNotificationsClick} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
