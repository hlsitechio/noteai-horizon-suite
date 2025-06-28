
import React from 'react';
import WelcomeHeader from './WelcomeHeader';
import DashboardGrid from './DashboardGrid';
import { useDashboard } from '../../hooks/useDashboard';

const DashboardContent: React.FC = () => {
  const {
    blocks,
    isDragging,
    draggedBlockId,
    handleBlockSwap,
    handleDragStart,
    handleDragEnd
  } = useDashboard();

  return (
    <div className="flex-1 flex flex-col p-4 gap-4 w-full max-w-[1920px] max-h-[1080px] mx-auto">
      {/* Welcome Header - Fixed height for 1080p */}
      <div className="flex-shrink-0 w-full h-[180px]">
        <WelcomeHeader />
      </div>

      {/* Main Content Area - All draggable components with mobile optimization */}
      <DashboardGrid
        blocks={blocks}
        isDragging={isDragging}
        draggedBlockId={draggedBlockId}
        onBlockSwap={handleBlockSwap}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default DashboardContent;
