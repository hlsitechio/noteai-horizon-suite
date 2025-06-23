
import React, { useEffect } from 'react';
import { useCustomCursor } from '../../hooks/useCustomCursor';

const CursorInteractionHandlers: React.FC = () => {
  const { setCursorState } = useCustomCursor();

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements
      if (target.closest('button, a, [role="button"], input[type="button"], input[type="submit"]')) {
        setCursorState('pointer');
      }
      // Check for text inputs
      else if (target.closest('input[type="text"], input[type="email"], input[type="password"], textarea')) {
        setCursorState('text');
      }
      // Check for draggable elements
      else if (target.closest('[draggable="true"], .draggable')) {
        setCursorState('grab');
      }
      // Check for resizable elements
      else if (target.closest('.resizable, .resize-handle')) {
        setCursorState('resize');
      }
      // Default cursor
      else {
        setCursorState('default');
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[draggable="true"], .draggable')) {
        setCursorState('grabbing');
      }
    };

    const handleMouseUp = () => {
      setCursorState('default');
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setCursorState]);

  return null;
};

export default CursorInteractionHandlers;
