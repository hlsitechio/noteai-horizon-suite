
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '../../../contexts/AuthContext';
import { SidebarUserAvatar } from './SidebarUserAvatar';
import { SidebarMenuButton } from './SidebarMenuButton';

interface SidebarCollapsedActionsProps {
  onNotificationsClick: () => void;
}

export function SidebarCollapsedActions({ onNotificationsClick }: SidebarCollapsedActionsProps) {
  const { logout } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center space-y-4"
    >
      <SidebarUserAvatar />
      
      <div className="flex flex-col items-center space-y-2">
        <SidebarMenuButton isCollapsed={true} onNotificationsClick={onNotificationsClick} />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-11 h-11 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Sign Out</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
}
