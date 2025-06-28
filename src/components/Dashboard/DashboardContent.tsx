
import React from 'react';
import WelcomeHeader from './WelcomeHeader';
import DndDashboard from './DndDashboard';
import ResetZoneButton from './ResetZoneButton';
import { useDashboard } from '../../hooks/useDashboard';
import { ScrollArea } from '@/components/ui/scroll-area';
import SyncStatusIndicator from '../SyncStatusIndicator';

const DashboardContent: React.FC = () => {
  const {
    blocks,
    isDragging,
    draggedBlockId,
    isLoading,
    syncStatus,
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
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
              <SyncStatusIndicator status={syncStatus} />
            </div>
            <ResetZoneButton onReset={handleResetLayout} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading dashboard data...</span>
            </div>
          )}

          {/* Main Content Area - Reduced spacing */}
          {!isLoading && (
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
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DashboardContent;
