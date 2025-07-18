import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarHeader } from './SidebarHeader';
import { SidebarNavigation } from './SidebarNavigation';
import { SidebarActions } from './SidebarActions';
import { SidebarFooter } from './SidebarFooter';
import { sidebarAnimations } from './animations';
import { useSidebarOptimization } from './useSidebarOptimization';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

const SidebarOptimized = memo(() => {
  const { sidebarState } = useSidebarOptimization();
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={100}>
      <motion.div
        className="h-full bg-sidebar flex flex-col border-r border-border"
        variants={sidebarAnimations.container}
        initial="collapsed"
        animate={sidebarState.isCollapsed ? "collapsed" : "expanded"}
        style={{
          width: sidebarState.isCollapsed ? '3.5rem' : sidebarState.isMobile ? '16rem' : '18rem'
        }}
      >
        {/* Header */}
        <SidebarHeader />

        {/* Navigation */}
        <motion.div
          className="flex-1 overflow-y-auto px-2 py-2"
          variants={sidebarAnimations.content}
        >
          <SidebarNavigation />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="flex-shrink-0 px-2 py-2"
          variants={sidebarAnimations.content}
        >
          <SidebarActions />
        </motion.div>

        {/* Footer */}
        <motion.div
          className="flex-shrink-0 px-2 py-2 border-t border-border/50"
          variants={sidebarAnimations.content}
        >
          <SidebarFooter />
        </motion.div>
      </motion.div>
    </TooltipProvider>
  );
});

SidebarOptimized.displayName = 'SidebarOptimized';

export { SidebarOptimized };