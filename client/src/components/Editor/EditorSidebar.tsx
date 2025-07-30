
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CollapsibleAssistant from './CollapsibleAssistant';

interface EditorSidebarProps {
  content: string;
  onSuggestionApply: (original: string, suggestion: string) => void;
  onCollapseChange: (collapsed: boolean) => void;
  isCollapsed: boolean;
  onCollapseToggle: (collapsed: boolean) => void;
  isDistractionFree: boolean;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  content,
  onSuggestionApply,
  onCollapseChange,
  isCollapsed,
  onCollapseToggle,
  isDistractionFree,
}) => {
  return (
    <AnimatePresence>
      {(!isDistractionFree || !isCollapsed) && (
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.3 }}
        >
          <CollapsibleAssistant
            content={content}
            onSuggestionApply={onSuggestionApply}
            onCollapseChange={onCollapseChange}
            isCollapsed={isCollapsed}
            onCollapseToggle={onCollapseToggle}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditorSidebar;
