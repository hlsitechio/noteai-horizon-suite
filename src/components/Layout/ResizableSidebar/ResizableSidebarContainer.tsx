import React, { useState, useEffect } from 'react';
import { PanelGroup } from 'react-resizable-panels';
import ResizableSidebarPanel from './ResizableSidebarPanel';
import ResizableSidebarContent from './ResizableSidebarContent';
import ResizableSidebarHandle from './ResizableSidebarHandle';
import { ResizableHandle as VerticalResizableHandle } from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResizableSidebarContainerProps {
  sidebarContent?: React.ReactNode;
  mainContent?: React.ReactNode;
  sidebarDefaultSize?: number;
  sidebarMinSize?: number;
  sidebarMaxSize?: number;
  isEditMode?: boolean;
  sidebarTopContent?: React.ReactNode;
  sidebarMiddleContent?: React.ReactNode;
  sidebarBottomContent?: React.ReactNode;
  enableVerticalResize?: boolean;
}

const ResizableSidebarContainer: React.FC<ResizableSidebarContainerProps> = ({
  sidebarContent,
  mainContent,
  sidebarDefaultSize = 25,
  sidebarMinSize = 15,
  sidebarMaxSize = 50,
  isEditMode = false,
  sidebarTopContent,
  sidebarMiddleContent,
  sidebarBottomContent,
  enableVerticalResize = false
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  
  // Adjust sizes for mobile
  const mobileAdjustedDefaultSize = isMobile ? 12 : sidebarDefaultSize;
  const mobileAdjustedMinSize = isMobile ? 8 : sidebarMinSize;
  const mobileAdjustedMaxSize = isMobile ? 15 : sidebarMaxSize;

  // Fix hydration mismatch - only enable storage after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Create storage handler that respects edit mode
  const createStorageHandler = () => {
    if (!isMounted) {
      // Prevent hydration mismatch
      return {
        getItem: () => "",
        setItem: () => {}
      };
    }
    
    if (isEditMode) {
      // In edit mode: allow full storage functionality
      return undefined; // Use default localStorage
    } else {
      // Not in edit mode: read-only storage (restore saved sizes but don't save new ones)
      return {
        getItem: (name: string) => {
          try {
            return localStorage.getItem(name) || "";
          } catch {
            return "";
          }
        },
        setItem: () => {} // Prevent writes when not in edit mode
      };
    }
  };

  const handleLayout = React.useCallback((sizes: number[]) => {
    // Only emit layout changes when in edit mode
    console.log('Sidebar layout change:', sizes, 'Edit mode:', isEditMode);
  }, [isEditMode]);

  return (
    <PanelGroup 
      direction="horizontal" 
      className="w-full h-full"
      onLayout={handleLayout}
      storage={createStorageHandler()}
    >
      {/* Sidebar Panel */}
      <ResizableSidebarPanel
        defaultSize={mobileAdjustedDefaultSize}
        minSize={isEditMode ? mobileAdjustedMinSize : undefined}
        maxSize={isEditMode ? mobileAdjustedMaxSize : undefined}
        topPanelContent={enableVerticalResize ? sidebarTopContent : undefined}
        middlePanelContent={enableVerticalResize ? sidebarMiddleContent : undefined}
        bottomPanelContent={enableVerticalResize ? sidebarBottomContent : undefined}
        isEditMode={isEditMode}
      >
        {!enableVerticalResize && (sidebarContent || (
          <div className="w-full h-full bg-muted/10 border-2 border-dashed border-muted/30 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-bold mb-2">Sidebar Area</h2>
              <p className="text-muted-foreground text-sm">Add your sidebar components here</p>
            </div>
          </div>
        ))}
      </ResizableSidebarPanel>
      
      {/* Vertical Resize Handle - Conditionally rendered */}
      {isEditMode && (
        <ResizableSidebarHandle isEditMode={isEditMode} />
      )}
      
      {/* Main Content Panel */}
      <ResizableSidebarContent>
        {mainContent || (
          <div className="w-full h-full bg-background flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Main Content Area</h2>
              <p className="text-muted-foreground">Your main application content goes here</p>
            </div>
          </div>
        )}
      </ResizableSidebarContent>
    </PanelGroup>
  );
};

export default ResizableSidebarContainer;