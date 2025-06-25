
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Maximize2, Minimize2, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const windowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (minimized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDrag = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - (minimized ? 50 : size.height), e.clientY - dragOffset.y)),
      };
      setPosition(newPosition);
      onPositionChange(noteId, newPosition);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Handle resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    if (minimized) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  const handleResize = (e: MouseEvent) => {
    if (isResizing) {
      const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
      const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));
      const newSize = { width: newWidth, height: newHeight };
      setSize(newSize);
      onSizeChange(noteId, newSize);
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Handle minimize/maximize
  const handleMinimize = () => {
    const newMinimized = !minimized;
    setMinimized(newMinimized);
    onMinimize(noteId, newMinimized);
  };

  const handleClose = () => {
    onClose(noteId);
  };

  // Mouse event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDrag(e);
      handleResize(e);
    };

    const handleMouseUp = () => {
      handleDragEnd();
      handleResizeEnd();
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  // Prevent text selection during drag
  useEffect(() => {
    if (isDragging || isResizing) {
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing]);

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
        zIndex: 1000,
      }}
      className="floating-note-window"
    >
      <Card className="h-full shadow-xl border-2 border-blue-200 dark:border-blue-700">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-t-lg cursor-move select-none"
          onMouseDown={handleDragStart}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {title || 'Untitled Note'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimize}
              className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-slate-600"
            >
              {minimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!minimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex-1 flex flex-col"
              style={{ height: size.height - 50 }}
            >
              <div className="flex-1 p-3">
                <Textarea
                  value={content}
                  onChange={(e) => onContentChange(noteId, e.target.value)}
                  placeholder="Start writing your note..."
                  className="w-full h-full resize-none border-none focus:ring-0 focus:outline-none bg-transparent"
                  style={{ minHeight: size.height - 80 }}
                />
              </div>
              
              {/* Resize handle */}
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100"
                onMouseDown={handleResizeStart}
              >
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 absolute bottom-1 right-1 rounded-sm"></div>
                <div className="w-1 h-1 bg-gray-400 dark:bg-gray-600 absolute bottom-0.5 right-0.5 rounded-sm"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default FloatingNoteWindow;
