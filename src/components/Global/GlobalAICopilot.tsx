
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuantumAI } from '@/contexts/QuantumAIContext';
import { CopilotButton } from '@/components/AICopilot';
import EnhancedAICopilot from '@/components/Editor/EnhancedAICopilot';

const GlobalAICopilot: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number } | undefined>();
  const location = useLocation();
  const { state } = useQuantumAI();

  // Update selected text when user makes a selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0) {
        setSelectedText(text);
        
        // Get selection position
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          });
        }
      } else {
        setSelectedText('');
        setPosition(undefined);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  // Handle text insertion
  const handleTextInsert = (text: string) => {
    // Try to insert at cursor position or append to active input
    const activeElement = document.activeElement;
    
    if (activeElement && (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement)) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;
      
      const newValue = value.substring(0, start) + '\n' + text + value.substring(end);
      activeElement.value = newValue;
      
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
    }
    
    setIsVisible(false);
  };

  // Handle text replacement
  const handleTextReplace = (text: string) => {
    const activeElement = document.activeElement;
    
    if (activeElement && (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement)) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;
      
      const newValue = value.substring(0, start) + text + value.substring(end);
      activeElement.value = newValue;
      
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    } else if (selectedText) {
      // Try to replace selected text in the document
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        selection.removeAllRanges();
      }
    }
    
    setIsVisible(false);
  };

  // Don't show on certain pages where it might interfere
  const shouldShow = !location.pathname.includes('/login') && 
                    !location.pathname.includes('/register') && 
                    !location.pathname.includes('/reset-password');

  if (!shouldShow) return null;

  return (
    <>
      {/* Floating AI Copilot Button */}
      <div className="fixed bottom-20 right-6 z-40">
        <CopilotButton
          onClick={() => setIsVisible(true)}
          isActive={isVisible}
          className="shadow-xl"
        />
      </div>

      {/* AI Copilot Interface */}
      <EnhancedAICopilot
        selectedText={selectedText}
        onTextInsert={handleTextInsert}
        onTextReplace={handleTextReplace}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        position={position}
        noteId={undefined}
      />
    </>
  );
};

export default GlobalAICopilot;
