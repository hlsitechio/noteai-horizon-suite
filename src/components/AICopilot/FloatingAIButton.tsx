
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIAssistantButton from './AIAssistantButton';

interface FloatingAIButtonProps {
  onTextInsert?: (text: string) => void;
  className?: string;
}

const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({
  onTextInsert,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const text = selection.toString();
        setSelectedText(text);
        
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        setSelectionPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10
        });
        
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setSelectedText('');
        setSelectionPosition(null);
      }
    };

    const handleClickOutside = () => {
      if (!selectedText) {
        setIsVisible(false);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedText]);

  const handleTextReplace = (newText: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(newText));
      selection.removeAllRanges();
    }
    setIsVisible(false);
    setSelectedText('');
  };

  return (
    <>
      {/* Selection-based AI Assistant */}
      <AnimatePresence>
        {isVisible && selectedText && selectionPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              left: selectionPosition.x,
              top: selectionPosition.y,
              transform: 'translate(-50%, -100%)',
              zIndex: 1000
            }}
          >
            <AIAssistantButton
              selectedText={selectedText}
              onTextReplace={handleTextReplace}
              onTextInsert={onTextInsert}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed floating AI button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        <AIAssistantButton
          onTextInsert={onTextInsert}
          className="shadow-2xl"
        />
      </motion.div>
    </>
  );
};

export default FloatingAIButton;
