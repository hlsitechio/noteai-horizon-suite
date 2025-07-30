import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { sidebarAnimations, hoverProps } from './animations';

const SidebarHeader = memo(() => {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  return (
    <motion.div 
      className="flex items-center justify-between px-3 py-3 border-b border-border/50 min-h-[3.5rem] bg-sidebar"
      variants={sidebarAnimations.content}
    >
      {/* Logo and Title */}
      <motion.div 
        className="flex items-center gap-2 flex-1 min-w-0"
        animate={{ opacity: isCollapsed ? 0 : 1 }}
        transition={{ duration: 0.2, delay: isCollapsed ? 0 : 0.1 }}
      >
        <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-sidebar-foreground truncate">ONAI</span>
            <span className="text-xs text-muted-foreground truncate">Workspace</span>
          </div>
        )}
      </motion.div>
      
      {/* Collapse Toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            {...hoverProps}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="h-7 w-7 p-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex-shrink-0"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <p>{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
});

SidebarHeader.displayName = 'SidebarHeader';

export { SidebarHeader };