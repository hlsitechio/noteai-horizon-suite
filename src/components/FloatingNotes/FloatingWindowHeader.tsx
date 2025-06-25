
import React from 'react';
import { X, Minus, Maximize2, GripHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FloatingWindowHeaderProps {
  title: string;
  isMinimized: boolean;
  onDragStart: (e: React.MouseEvent) => void;
  onMinimize: () => void;
  onClose: () => void;
}

const FloatingWindowHeader: React.FC<FloatingWindowHeaderProps> = ({
  title,
  isMinimized,
  onDragStart,
  onMinimize,
  onClose,
}) => {
  return (
    <div
      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-t-lg cursor-move select-none"
      onMouseDown={onDragStart}
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
          onClick={onMinimize}
          className="h-6 w-6 p-0 hover:bg-blue-100 dark:hover:bg-slate-600"
        >
          {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingWindowHeader;
