
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useIsMobile } from '../../hooks/use-mobile';
import { DashboardBlock } from '../../hooks/useDashboardLayout';
import SortableItem from './SortableItem';
import DragStatusOverlay from './DragStatusOverlay';

interface DndDashboardProps {
  blocks: DashboardBlock[];
  onSwap: (blocks: DashboardBlock[]) => void;
  isDragging: boolean;
  draggedBlockId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

const DndDashboard: React.FC<DndDashboardProps> = ({
  blocks,
  onSwap,
  isDragging,
  draggedBlockId,
  onDragStart,
  onDragEnd
}) => {
  const [items, setItems] = useState(blocks.map((b) => b.id));
  const isMobile = useIsMobile();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Update items when blocks change
  useEffect(() => {
    setItems(blocks.map((b) => b.id));
  }, [blocks]);

  const handleDragStart = (event: any) => {
    console.log(`DndDashboard: Starting drag for ${event.active.id}`);
    onDragStart(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(`DndDashboard: Drag ended - active: ${active.id}, over: ${over?.id}`);
    
    onDragEnd();

    if (active.id !== over?.id && over?.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      console.log(`DndDashboard: Reordering from index ${oldIndex} to ${newIndex}`);
      setItems(newItems);

      // Reorder blocks and notify parent
      const reordered = newItems.map((id) => blocks.find((b) => b.id === id)!).filter(Boolean);
      onSwap(reordered);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className={`dashboard-grid grid ${
          isMobile ? 'grid-cols-2' : 'grid-cols-12'
        } gap-3 w-full min-h-0 transition-all duration-300 ${
          isDragging ? 'dragging-active bg-gradient-to-br from-blue-50/20 to-purple-50/20' : ''
        }`}>
          {items.map((id) => {
            const block = blocks.find((b) => b.id === id);
            if (!block) return null;

            const BlockComponent = block.component;

            return (
              <SortableItem 
                key={id} 
                id={id} 
                gridClass={`${isMobile 
                  ? (block.id.startsWith('kpi-') ? 'col-span-1' : 'col-span-2') 
                  : block.gridClass
                } ${
                  block.id.startsWith('kpi-') ? 'h-24' : 'min-h-[250px]'
                } transition-transform duration-300 ease-in-out`}
              >
                <BlockComponent {...block.props} />
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
      
      <DragStatusOverlay 
        isDragging={isDragging} 
        draggedBlockId={draggedBlockId} 
      />
    </DndContext>
  );
};

export default DndDashboard;
