
import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { DashboardBlock } from '../../hooks/useDashboardLayout';
import DraggableBlock from './DraggableBlock';
import DragStatusOverlay from './DragStatusOverlay';

interface DashboardGridProps {
  blocks: DashboardBlock[];
  isDragging: boolean;
  draggedBlockId: string | null;
  onBlockSwap: (draggedId: string, targetId: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  blocks,
  isDragging,
  draggedBlockId,
  onBlockSwap,
  onDragStart,
  onDragEnd
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`dashboard-grid grid ${
      isMobile ? 'grid-cols-1' : 'grid-cols-12'
    } gap-4 flex-1 min-h-0 w-full h-[850px] relative transition-all duration-300 auto-rows-fr ${
      isDragging ? 'dragging-active bg-gradient-to-br from-blue-50/20 to-purple-50/20' : ''
    }`}>
      {blocks.map((block) => {
        const BlockComponent = block.component;
        return (
          <DraggableBlock
            key={block.id}
            id={block.id}
            gridClass={`${isMobile ? 'col-span-1' : block.gridClass} ${
              block.id.startsWith('kpi-') ? 'min-h-[120px]' : 'min-h-[300px]'
            } transition-transform duration-300 ease-in-out`}
            onSwap={onBlockSwap}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <BlockComponent {...block.props} />
          </DraggableBlock>
        );
      })}
      
      <DragStatusOverlay 
        isDragging={isDragging} 
        draggedBlockId={draggedBlockId} 
      />
    </div>
  );
};

export default DashboardGrid;
