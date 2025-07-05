import React, { useState, useRef, useEffect } from 'react';
import { GripHorizontal } from 'lucide-react';

interface ResizableBannerProps {
  children: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
  onHeightChange?: (height: number) => void;
}

const ResizableBanner: React.FC<ResizableBannerProps> = ({
  children,
  minHeight = 120,
  maxHeight = 400,
  defaultHeight = 224, // 56 * 4 (h-56 in Tailwind)
  onHeightChange
}) => {
  const [height, setHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  // Load saved height from localStorage
  useEffect(() => {
    const savedHeight = localStorage.getItem('banner-height');
    if (savedHeight) {
      const parsedHeight = parseInt(savedHeight, 10);
      if (parsedHeight >= minHeight && parsedHeight <= maxHeight) {
        setHeight(parsedHeight);
      }
    }
  }, [minHeight, maxHeight]);

  // Save height to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('banner-height', height.toString());
    onHeightChange?.(height);
  }, [height, onHeightChange]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startY.current = e.clientY;
    startHeight.current = height;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaY = e.clientY - startY.current;
    const newHeight = Math.min(
      Math.max(startHeight.current + deltaY, minHeight),
      maxHeight
    );
    
    setHeight(newHeight);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = height;
    
    const handleTouchMoveWrapper = (e: TouchEvent) => {
      e.preventDefault();
      handleTouchMove(e);
    };
    
    document.addEventListener('touchmove', handleTouchMoveWrapper, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isResizing) return;
    
    const deltaY = e.touches[0].clientY - startY.current;
    const newHeight = Math.min(
      Math.max(startHeight.current + deltaY, minHeight),
      maxHeight
    );
    
    setHeight(newHeight);
  };

  const handleTouchEnd = () => {
    setIsResizing(false);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  return (
    <div className="space-y-4">
      <div 
        ref={bannerRef}
        className="relative overflow-hidden rounded-lg border border-border bg-card group shadow-soft transition-all duration-200"
        style={{ height: `${height}px` }}
      >
        {children}
        
        {/* Resize Handle */}
        <div 
          className={`absolute bottom-0 left-0 right-0 h-4 cursor-ns-resize bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center border-t border-border/50 z-50 ${
            isResizing ? 'bg-primary/30' : ''
          }`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ pointerEvents: 'auto' }}
        >
          <div className="opacity-70 hover:opacity-100 transition-opacity duration-200 bg-background/20 rounded px-2 py-1">
            <GripHorizontal className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
        
        {/* Resize indicator */}
        {isResizing && (
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm border border-border rounded px-2 py-1 text-xs text-muted-foreground">
            {height}px
          </div>
        )}
      </div>
    </div>
  );
};

export default ResizableBanner;