import React from 'react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle as HorizontalResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardPanel } from '../DashboardPanel';

interface ResizableDashboardGridProps {
  topSectionSize: number;
  bottomSectionSize: number;
  leftPanelsSize: number;
  rightPanelsSize: number;
  isDashboardEditMode: boolean;
  onMainContentResize: (sizes: number[]) => void;
  onHorizontalResize: (sizes: number[]) => void;
  createStorageHandler: () => undefined;
  startOrder: number; // Starting order for panels
}

// Helper function to get correct panel key based on order and position
const getPanelKey = (order: number, position: 'left' | 'right'): string => {
  const section = order === 1 ? 'top' : order === 2 ? 'middle' : 'bottom';
  const side = position === 'left' ? 'Left' : 'Right';
  return `${section}${side}`;
};

export const ResizableDashboardGrid: React.FC<ResizableDashboardGridProps> = ({
  topSectionSize,
  bottomSectionSize,
  leftPanelsSize,
  rightPanelsSize,
  isDashboardEditMode,
  onHorizontalResize,
  createStorageHandler,
  startOrder
}) => {
  const handleHorizontalResize = React.useCallback((sizes: number[]) => {
    if (isDashboardEditMode) {
      onHorizontalResize(sizes);
    }
  }, [isDashboardEditMode, onHorizontalResize]);

  return (
    <>
      {/* Dashboard Section Panel */}
      <Panel 
        id={`section-${startOrder}-panel`}
        order={startOrder}
        defaultSize={startOrder === 3 ? bottomSectionSize : topSectionSize} 
        minSize={isDashboardEditMode ? 25 : undefined}
        maxSize={isDashboardEditMode ? 75 : undefined}
      >
        <div className="h-full">
          <PanelGroup 
            direction="horizontal" 
            className="h-full" 
            onLayout={handleHorizontalResize}
            id={`horizontal-${startOrder}`}
            storage={createStorageHandler()}
          >
            <Panel 
              id={`${startOrder}-left-panel`}
              order={0}
              defaultSize={leftPanelsSize} 
              minSize={isDashboardEditMode ? 30 : undefined}
              maxSize={isDashboardEditMode ? 70 : undefined}
            >
              <div className="h-full border-r border-border/50">
                <ScrollArea className="h-full">
                  <DashboardPanel 
                    panelKey={getPanelKey(startOrder, 'left')} 
                    className="p-4 min-h-full" 
                  />
                </ScrollArea>
              </div>
            </Panel>
            
            <HorizontalResizableHandle 
              className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none w-1"} 
            />
            
            <Panel 
              id={`${startOrder}-right-panel`}
              order={1}
              defaultSize={rightPanelsSize} 
              minSize={isDashboardEditMode ? 30 : undefined}
              maxSize={isDashboardEditMode ? 70 : undefined}
            >
              <div className="h-full">
                <ScrollArea className="h-full">
                  <DashboardPanel 
                    panelKey={getPanelKey(startOrder, 'right')} 
                    className="p-4 min-h-full" 
                  />
                </ScrollArea>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      </Panel>
      
      {startOrder < 3 && (
        <HorizontalResizableHandle 
          className={isDashboardEditMode ? "opacity-100" : "opacity-0 pointer-events-none h-1"} 
        />
      )}
    </>
  );
};