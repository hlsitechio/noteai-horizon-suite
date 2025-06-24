
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useAccentColor } from '../../../contexts/AccentColorContext';

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
  const { accentColor } = useAccentColor();
  const isCollapsed = state === 'collapsed';

  return (
    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} relative px-2`}>
      {/* Logo and Title Section */}
      <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-premium border"
          style={{
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
            borderColor: `${accentColor}30`
          }}
        >
          <Sparkles className="w-5 h-5 text-deep-carbon-900" />
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="flex flex-col"
            >
              <span className="text-lg font-bold text-professional-grey-200">AI Notes</span>
              <span 
                className="text-xs -mt-1"
                style={{ color: accentColor }}
              >
                Smart Writing
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={isCollapsed ? 'absolute -right-3 top-1/2 -translate-y-1/2 z-10' : ''}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 rounded-lg hover:text-professional-grey-400 text-professional-grey-400 transition-colors"
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
