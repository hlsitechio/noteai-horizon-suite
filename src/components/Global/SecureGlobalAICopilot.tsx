
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuantumAI } from '@/contexts/QuantumAIContext';
import UnifiedAIButton from '@/components/AICopilot/UnifiedAIButton';
import EnhancedAICopilot from '@/components/Editor/EnhancedAICopilot';
import { validateNoteContent, sanitizeText, secureLog, rateLimiter } from '../../utils/securityUtils';
import { useToast } from '../../hooks/useToast';

const SecureGlobalAICopilot: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number } | undefined>();
  const location = useLocation();
  const { state } = useQuantumAI();
  const { toast } = useToast();

  // Update selected text when user makes a selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0) {
        // Validate and sanitize selected text
        if (text.length > 10000) { // Reasonable limit for selection
          secureLog.warn('Selected text too long, truncating');
          setSelectedText(sanitizeText(text.substring(0, 10000)));
        } else {
          setSelectedText(sanitizeText(text));
        }
        
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

  // Handle text insertion with security checks
  const handleTextInsert = (text: string) => {
    // Rate limiting
    if (!rateLimiter.checkLimit('ai_text_insert', 20, 60000)) {
      toast.error('Too many AI operations. Please wait a moment.');
      return;
    }

    // Validate and sanitize the text
    const validation = validateNoteContent(text);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid text content');
      return;
    }

    const sanitizedText = sanitizeText(text);
    
    // Try to insert at cursor position or append to active input
    const activeElement = document.activeElement;
    
    if (activeElement && (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement)) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;
      
      const newValue = value.substring(0, start) + '\n' + sanitizedText + value.substring(end);
      activeElement.value = newValue;
      
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
      
      secureLog.info('Text inserted successfully');
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(sanitizedText).then(() => {
        toast.success('Text copied to clipboard');
      }).catch(() => {
        toast.error('Failed to copy text');
      });
    }
    
    setIsVisible(false);
  };

  // Handle text replacement with security checks
  const handleTextReplace = (text: string) => {
    // Rate limiting
    if (!rateLimiter.checkLimit('ai_text_replace', 20, 60000)) {
      toast.error('Too many AI operations. Please wait a moment.');
      return;
    }

    // Validate and sanitize the text
    const validation = validateNoteContent(text);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid text content');
      return;
    }

    const sanitizedText = sanitizeText(text);
    const activeElement = document.activeElement;
    
    if (activeElement && (activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLInputElement)) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;
      
      const newValue = value.substring(0, start) + sanitizedText + value.substring(end);
      activeElement.value = newValue;
      
      // Trigger change event
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
      
      secureLog.info('Text replaced successfully');
    } else if (selectedText) {
      // Try to replace selected text in the document
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(sanitizedText));
        selection.removeAllRanges();
        
        secureLog.info('Selected text replaced successfully');
      }
    }
    
    setIsVisible(false);
  };

  const handleCopilotToggle = () => {
    // Rate limiting for copilot activation
    if (!rateLimiter.checkLimit('copilot_toggle', 10, 60000)) {
      toast.error('Too many copilot activations. Please wait a moment.');
      return;
    }
    
    setIsVisible(true);
  };

  return (
    <>
      {/* Unified AI Button */}
      <div className="fixed bottom-20 right-6 z-40">
        <UnifiedAIButton
          onClick={handleCopilotToggle}
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

export default SecureGlobalAICopilot;
