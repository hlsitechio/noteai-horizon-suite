
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import WritingSuggestions from './WritingSuggestions';
import AssistantHeader from './AssistantHeader';
import AssistantToolsGrid from './AssistantToolsGrid';
import AssistantPowerTools from './AssistantPowerTools';
import AssistantAnalytics from './AssistantAnalytics';

interface CollapsibleAssistantProps {
  content: string;
  onSuggestionApply: (original: string, suggestion: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  collapseRef?: React.MutableRefObject<(() => void) | undefined>;
  expandRef?: React.MutableRefObject<(() => void) | undefined>;
  isCollapsed?: boolean;
  onCollapseToggle?: (collapsed: boolean) => void;
}

const sidebarVariants: Variants = {
  expanded: {
    width: "20rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  },
  collapsed: {
    width: "4rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  }
};

const contentVariants: Variants = {
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
    x: 20,
    transition: {
      duration: 0.15
    }
  }
};

const CollapsibleAssistant: React.FC<CollapsibleAssistantProps> = ({
  content,
  onSuggestionApply,
  onCollapseChange,
  collapseRef,
  expandRef,
  isCollapsed: controlledCollapsed,
  onCollapseToggle
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setIsCollapsed = onCollapseToggle || setInternalCollapsed;

  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  // Update the refs whenever they change
  useEffect(() => {
    if (collapseRef) {
      collapseRef.current = () => setIsCollapsed(true);
    }
    if (expandRef) {
      expandRef.current = () => setIsCollapsed(false);
    }
  }, [collapseRef, expandRef, setIsCollapsed]);

  const handleToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <TooltipProvider>
      <motion.div
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="h-full flex flex-col bg-sidebar border-l border-border/50 backdrop-blur-md overflow-hidden"
      >
        <AssistantHeader isCollapsed={isCollapsed} onToggle={handleToggle} />

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <AnimatePresence>
            {isCollapsed ? (
              <AssistantToolsGrid content={content} />
            ) : (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="space-y-4"
              >
                <WritingSuggestions
                  content={content}
                  onSuggestionApply={onSuggestionApply}
                />

                <AssistantPowerTools />

                {content.length > 0 && (
                  <AssistantAnalytics content={content} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default CollapsibleAssistant;
