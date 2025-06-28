
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import FloatingWindowHeader from './FloatingWindowHeader';
import FloatingWindowContent from './FloatingWindowContent';
import FloatingWindowResizeHandle from './FloatingWindowResizeHandle';
import { useFloatingWindowDrag } from './hooks/useFloatingWindowDrag';
import { useFloatingWindowResize } from './hooks/useFloatingWindowResize';

interface FloatingWindowPosition {
  x: number;
  y: number;
}

interface FloatingWindowSize {
  width: number;
  height: number;
}

interface FloatingNoteWindowProps {
  noteId: string;
  title: string;
  content: string;
  initialPosition?: FloatingWindowPosition;
  initialSize?: FloatingWindowSize;
  isMinimized?: boolean;
  onClose: (noteId: string) => void;
  onMinimize: (noteId: string, minimized: boolean) => void;
  onPositionChange: (noteId: string, position: FloatingWindowPosition) => void;
  onSizeChange: (noteId: string, size: FloatingWindowSize) => void;
  onContentChange: (noteId: string, content: string) => void;
}

const FloatingNoteWindow: React.FC<FloatingNoteWindowProps> = ({
  noteId,
  title,
  content,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 400, height: 300 },
  isMinimized = false,
  onClose,
  onMinimize,
  onPositionChange,
  onSizeChange,
  onContentChange,
}) => {
  const [position, setPosition] = useState<FloatingWindowPosition>(initialPosition);
  const [size, setSize] = useState<FloatingWindowSize>(initialSize);
  const [minimized, setMinimized] = useState(isMinimized);

  const windowRef = useRef<HTMLDivElement>(null);

  console.log('FloatingNoteWindow rendering:', { noteId, title, position, size, minimized });

  const handlePositionChange = (newPosition: FloatingWindowPosition) => {
    console.log('FloatingNoteWindow: Position changed', newPosition);
    setPosition(newPosition);
    onPositionChange(noteId, newPosition);
  };

  const handleSizeChange = (newSize: FloatingWindowSize) => {
    console.log('FloatingNoteWindow: Size changed', newSize);
    setSize(newSize);
    onSizeChange(noteId, newSize);
  };

  const handleMinimize = () => {
    const newMinimized = !minimized;
    console.log('FloatingNoteWindow: Minimize toggled', newMinimized);
    setMinimized(newMinimized);
    onMinimize(noteId, newMinimized);
  };

  const handleClose = () => {
    console.log('FloatingNoteWindow: Closing', noteId);
    onClose(noteId);
  };

  const handleContentChange = (newContent: string) => {
    onContentChange(noteId, newContent);
  };

  const { handleDragStart } = useFloatingWindowDrag({
    position,
    size,
    isMinimized: minimized,
    onPositionChange: handlePositionChange,
  });

  const { handleResizeStart } = useFloatingWindowResize({
    size,
    isMinimized: minimized,
    onSizeChange: handleSizeChange,
  });

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: minimized ? 300 : size.width,
        height: minimized ? 50 : size.height,
        zIndex: 10000,
        pointerEvents: 'auto', // Enable pointer events for the window
      }}
      className="floating-note-window"
    >
      <Card className="h-full shadow-xl border-2 border-blue-200 dark:border-blue-700 pointer-events-auto">
        <FloatingWindowHeader
          title={title}
          isMinimized={minimized}
          onDragStart={handleDragStart}
          onMinimize={handleMinimize}
          onClose={handleClose}
        />

        <FloatingWindowContent
          content={content}
          isMinimized={minimized}
          windowHeight={size.height}
          onContentChange={handleContentChange}
        />

        <FloatingWindowResizeHandle
          isMinimized={minimized}
          onResizeStart={handleResizeStart}
        />
      </Card>
    </motion.div>
  );
};

export default FloatingNoteWindow;
