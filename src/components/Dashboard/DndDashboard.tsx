
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  console.log('DndDashboard: Render with blocks:', blocks.length, 'items:', items.length);
  console.log('DndDashboard: Current items order:', items);

  // Improved sensors with better activation constraints
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Very small distance - almost immediate activation
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Update items when blocks change - but prevent infinite loops
  useEffect(() => {
    const newItems = blocks.map((b) => b.id);
    // Only update if the items have actually changed
    if (JSON.stringify(newItems) !== JSON.stringify(items)) {
      console.log('DndDashboard: Items changed, updating from:', items, 'to:', newItems);
      setItems(newItems);
    }
  }, [blocks]); // Remove items from dependencies to prevent infinite loop

  const handleDragStart = (event: DragStartEvent) => {
    const dragId = event.active.id as string;
    console.log(`🔥🔥🔥 DndDashboard: DRAG STARTED for ${dragId}`);
    console.log('🔥🔥🔥 DndDashboard: Full drag start event:', event);
    setActiveId(dragId);
    onDragStart(dragId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log(`🔥🔥🔥 DndDashboard: DRAG ENDED - active: ${active.id}, over: ${over?.id}`);
    console.log('🔥🔥🔥 DndDashboard: Full drag end event:', event);
    
    setActiveId(null);
    onDragEnd();

    if (active.id !== over?.id && over?.id) {
      const activeId = active.id as string;
      const overId = over.id as string;
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);
      
      console.log(`🔥🔥🔥 DndDashboard: Moving item from index ${oldIndex} to ${newIndex}`);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        console.log(`🔥🔥🔥 DndDashboard: New order after move:`, newItems);
        
        setItems(newItems);

        // Reorder blocks and notify parent
        const reordered = newItems.map((id) => blocks.find((b) => b.id === id)!).filter(Boolean);
        console.log('🔥🔥🔥 DndDashboard: Calling onSwap with reordered blocks:', reordered.map(b => b.id));
        onSwap(reordered);
      } else {
        console.warn('🔥🔥🔥 DndDashboard: Could not find indices for drag operation', { activeId, overId, oldIndex, newIndex });
      }
    } else {
      console.log('🔥🔥🔥 DndDashboard: No reorder needed - same position or invalid target');
    }
  };

  // Get the active block for drag overlay
  const activeBlock = activeId ? blocks.find(block => block.id === activeId) : null;

  console.log('DndDashboard: About to render with', items.length, 'items');

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
        } gap-4 w-full min-h-0 transition-all duration-200 ease-out ${
          isDragging ? 'dragging-active bg-gradient-to-br from-blue-50/20 to-purple-50/20' : ''
        }`}>
          {items.map((id) => {
            const block = blocks.find((b) => b.id === id);
            if (!block) {
              console.warn(`DndDashboard: Block not found for id: ${id}`);
              return null;
            }

            const BlockComponent = block.component;

            console.log(`DndDashboard: Rendering block ${id} with component:`, BlockComponent.name);

            return (
              <SortableItem 
                key={id} 
                id={id} 
                gridClass={`${isMobile 
                  ? (block.id.startsWith('kpi-') ? 'col-span-1' : 'col-span-2') 
                  : block.gridClass
                } ${
                  block.id.startsWith('kpi-') ? 'h-24' : 'min-h-[250px]'
                } transition-all duration-200 ease-out`}
              >
                <BlockComponent {...block.props} />
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
      
      {/* Drag Overlay */}
      <DragOverlay>
        {activeBlock ? (
          <div className="opacity-95 transform rotate-3 scale-105 shadow-2xl">
            <div className={`${isMobile 
              ? (activeBlock.id.startsWith('kpi-') ? 'w-32' : 'w-64') 
              : 'w-64'
            } ${
              activeBlock.id.startsWith('kpi-') ? 'h-24' : 'h-64'
            } bg-background border-2 border-blue-400 rounded-lg p-4`}>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-sm font-medium text-foreground">
                    {activeBlock.id}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Drop to reorder
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
      
      <DragStatusOverlay 
        isDragging={isDragging} 
        draggedBlockId={draggedBlockId} 
      />
    </DndContext>
  );
};

export default DndDashboard;
