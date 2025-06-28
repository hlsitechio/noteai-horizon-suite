
import React from 'react';
import WelcomeHeader from './WelcomeHeader';
import DndDashboard from './DndDashboard';
import ResetZoneButton from './ResetZoneButton';
import { useDashboard } from '../../hooks/useDashboard';
import { ScrollArea } from '@/components/ui/scroll-area';

const DashboardContent: React.FC = () => {
  const {
    blocks,
    isDragging,
    draggedBlockId,
    handleBlocksReorder,
    handleDragStart,
    handleDragEnd,
    handleResetLayout
  } = useDashboard();

  return (
    <div className="flex-1 flex flex-col w-full max-w-[1920px] mx-auto relative overflow-hidden">
      {/* Scrollable Content */}
      <ScrollArea className="flex-1 w-full">
        <div className="p-4 space-y-4 min-h-full">
          {/* Welcome Header - Compact banner space */}
          <div className="flex-shrink-0 w-full h-[280px]">
            <WelcomeHeader />
          </div>

          {/* Dashboard Controls Section */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
            <ResetZoneButton onReset={handleResetLayout} />
          </div>

          {/* Main Content Area - Reduced spacing */}
          <div className="pt-2">
            <DndDashboard
              blocks={blocks}
              onSwap={handleBlocksReorder}
              isDragging={isDragging}
              draggedBlockId={draggedBlockId}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardContent;
