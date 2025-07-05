import { useEffect, useCallback } from 'react';

interface UseEditorKeyboardProps {
  onSave: () => void;
  onFocusModeToggle: () => void;
  canSave: boolean;
}

export const useEditorKeyboard = ({
  onSave,
  onFocusModeToggle,
  canSave
}: UseEditorKeyboardProps) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl/Cmd + S to save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      if (canSave) {
        onSave();
      }
    }
    
    // Ctrl/Cmd + Enter to toggle focus mode
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      onFocusModeToggle();
    }
    
    // Escape to exit focus mode (handled in FocusMode component)
    if (event.key === 'Escape') {
      // This will be handled by the FocusMode component
    }
  }, [onSave, onFocusModeToggle, canSave]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    // Expose any keyboard-related utilities if needed
  };
};