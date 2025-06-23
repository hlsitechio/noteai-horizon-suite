
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

const contentVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
      duration: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.15
    }
  }
};

const iconVariants = {
  expanded: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  collapsed: {
    scale: 1.1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  }
};

export function SidebarHeader() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative`}>
      {/* Logo and Title Section */}
      <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <motion.div 
          variants={iconVariants}
          animate={isCollapsed ? 'collapsed' : 'expanded'}
          className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
        >
          <span className="text-white font-bold text-sm">AI</span>
        </motion.div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="text-xl font-bold text-foreground"
            >
              Online Note AI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button - Better positioned */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={isCollapsed ? 'absolute -right-3 top-1/2 -translate-y-1/2 z-10' : ''}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30 flex-shrink-0"
          title={state === 'expanded' ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {state === 'expanded' ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );
}
