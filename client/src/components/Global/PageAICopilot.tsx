
import React, { useState, useEffect } from 'react';
import { UnifiedAIButton } from '@/components/AICopilot';
import UnifiedAIAssistant from '@/components/Editor/AIAssistant';

interface PageAICopilotProps {
  pageContext?: string;
}

const PageAICopilot: React.FC<PageAICopilotProps> = ({ pageContext }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number } | undefined>();

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
    navigator.clipboard.writeText(text);
    setIsVisible(false);
  };

  // Handle text replacement
  const handleTextReplace = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsVisible(false);
  };

  return (
    <>
      {/* Global AI Copilot removed - AI Assistant is now permanently visible in the editor */}
    </>
  );
};

export default PageAICopilot;
