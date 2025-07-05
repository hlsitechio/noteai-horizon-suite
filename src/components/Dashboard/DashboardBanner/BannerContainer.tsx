import React, { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface BannerContainerProps {
  children: React.ReactNode;
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
  onHeightChange?: (height: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const BannerContainer: React.FC<BannerContainerProps> = ({
  children,
  minHeight = 120,
  maxHeight = 500,
  defaultHeight = 224,
  onHeightChange,
  onMouseEnter,
  onMouseLeave
}) => {
  const [containerHeight, setContainerHeight] = useState(defaultHeight);

  // Load saved height from localStorage
  useEffect(() => {
    const savedHeight = localStorage.getItem('dashboard-banner-height');
    if (savedHeight) {
      const parsedHeight = parseInt(savedHeight, 10);
      if (parsedHeight >= minHeight && parsedHeight <= maxHeight) {
        setContainerHeight(parsedHeight);
      }
    }
  }, [minHeight, maxHeight]);

  // Save height to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboard-banner-height', containerHeight.toString());
    onHeightChange?.(containerHeight);
  }, [containerHeight, onHeightChange]);

  const handleResize = () => {
    // This will be called when the panel is resized
    const bannerElement = document.getElementById('banner-panel');
    if (bannerElement) {
      const newHeight = bannerElement.offsetHeight;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setContainerHeight(newHeight);
      }
    }
  };

  return (
    <div 
      className="rounded-lg border border-border bg-card shadow-soft transition-all duration-200 hover:shadow-md"
      style={{ height: `${containerHeight}px`, minHeight: `${minHeight}px`, maxHeight: `${maxHeight}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <ResizablePanelGroup 
        direction="vertical" 
        className="h-full"
        onLayout={handleResize}
      >
        <ResizablePanel 
          id="banner-panel"
          defaultSize={100}
          minSize={20}
          maxSize={100}
          className="relative overflow-hidden"
        >
          {children}
        </ResizablePanel>
        <ResizableHandle 
          withHandle 
          className="h-2 bg-primary/10 hover:bg-primary/20 transition-colors border-t border-border/50"
        />
      </ResizablePanelGroup>
    </div>
  );
};

export default BannerContainer;