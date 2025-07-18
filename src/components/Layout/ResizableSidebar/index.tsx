
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { useSidebarCollapse } from '@/contexts/SidebarContext';

interface ResizableSidebarContainerProps {
  sidebarContent: React.ReactNode;
  mainContent: React.ReactNode;
  sidebarDefaultSize?: number;
  sidebarMinSize?: number;
  sidebarMaxSize?: number;
  isEditMode?: boolean;
  className?: string;
}

export const ResizableSidebarContainer: React.FC<ResizableSidebarContainerProps> = ({
  sidebarContent,
  mainContent,
  sidebarDefaultSize = 20,
  sidebarMinSize = 15,
  sidebarMaxSize = 40,
  isEditMode = true,
  className
}) => {
  const { isCollapsed } = useSidebarCollapse();

  return (
    <div className={cn("h-full w-full", className)}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={isCollapsed ? 5 : sidebarDefaultSize}
          minSize={isCollapsed ? 4 : sidebarMinSize}
          maxSize={isCollapsed ? 6 : sidebarMaxSize}
          className="relative"
        >
          {sidebarContent}
        </ResizablePanel>
        
        <ResizableHandle 
          withHandle={isEditMode && !isCollapsed}
          className={cn(
            "transition-all duration-200",
            isEditMode && !isCollapsed
              ? "hover:bg-primary/20 cursor-col-resize" 
              : "opacity-30 pointer-events-none",
            isCollapsed && "w-0 opacity-0"
          )}
        />
        
        <ResizablePanel defaultSize={100 - sidebarDefaultSize}>
          {mainContent}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
