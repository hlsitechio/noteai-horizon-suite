
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
      {/* Reset Layout Button */}
      <div className="absolute top-4 right-4 z-50">
        <ResetZoneButton onReset={handleResetLayout} />
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1 w-full">
        <div className="p-4 space-y-4 min-h-full">
          {/* Welcome Header - Compact for mobile */}
          <div className="flex-shrink-0 w-full h-[120px]">
            <WelcomeHeader />
          </div>

          {/* Main Content Area - All draggable components */}
          <DndDashboard
            blocks={blocks}
            onSwap={handleBlocksReorder}
            isDragging={isDragging}
            draggedBlockId={draggedBlockId}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardContent;
