import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAssistantMode } from '../types/ai';

interface AIAssistantLayoutProps {
  isVisible: boolean;
  mode: AIAssistantMode;
  position?: { x: number; y: number };
  onClose: () => void;
  children: React.ReactNode;
}

const AIAssistantLayout: React.FC<AIAssistantLayoutProps> = ({
  isVisible,
  mode,
  position,
  onClose,
  children,
}) => {
  const getAssistantPosition = () => {
    if (mode === 'contextmenu' && position) {
      return {
        position: 'fixed' as const,
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999
      };
    }
    
    if (mode === 'sidebar') {
      return {
        position: 'relative' as const,
        width: '100%',
        height: '100%'
      };
    }
    
    // Command palette - center of screen
    return {
      position: 'fixed' as const,
      left: '50%',
      top: '30%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999
    };
  };

  const getAssistantSize = () => {
    switch (mode) {
      case 'contextmenu':
        return 'w-80';
      case 'sidebar':
        return 'w-full h-full';
      case 'command':
        return 'w-[600px] max-h-[80vh]';
      default:
        return 'w-96 max-h-[600px]';
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop for command palette */}
      {mode === 'command' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          onClick={onClose}
        />
      )}

      <AnimatePresence>
        <motion.div
          style={getAssistantPosition()}
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={getAssistantSize()}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default React.memo(AIAssistantLayout);