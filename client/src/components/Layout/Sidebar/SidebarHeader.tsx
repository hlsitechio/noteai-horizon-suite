
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, Zap } from 'lucide-react';
import { useSidebarCollapse } from '@/contexts/SidebarContext';

export const SidebarHeader: React.FC = () => {
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();

  return (
    <div className="flex items-center justify-between px-3 py-4 border-b border-border/50 min-h-[60px]">
      <motion.div 
        className="flex items-center gap-3 flex-1"
        animate={{ opacity: isCollapsed ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">ONAI</span>
            <span className="text-xs text-muted-foreground">Workspace</span>
          </div>
        )}
      </motion.div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleCollapse}
        className="h-8 w-8 p-0 hover:bg-muted/50 flex-shrink-0 z-10"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};
