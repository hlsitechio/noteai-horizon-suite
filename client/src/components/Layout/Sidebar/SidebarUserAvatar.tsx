
import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '../../../contexts/AuthContext';

export function SidebarUserAvatar() {
  const { user } = useAuth();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }}>
          <Avatar className="w-12 h-12 ring-2 ring-primary/20 cursor-pointer">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
              {user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{user?.name}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </TooltipContent>
    </Tooltip>
  );
}
