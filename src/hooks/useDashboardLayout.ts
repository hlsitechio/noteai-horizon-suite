
import { useState, useCallback } from 'react';

export interface DashboardBlock {
  id: string;
  component: React.ComponentType<any>;
  props: any;
  gridClass: string;
}

export const useDashboardLayout = () => {
  const [blocks, setBlocks] = useState<DashboardBlock[]>([]);
  
  const initializeBlocks = useCallback((initialBlocks: DashboardBlock[]) => {
    console.log('Initializing blocks:', initialBlocks.map(b => b.id));
    setBlocks(initialBlocks);
  }, []);

  const swapBlocks = useCallback((draggedId: string, targetId: string) => {
    console.log('useDashboardLayout: Attempting to swap', draggedId, 'with', targetId);
    
    setBlocks(prev => {
      const newBlocks = [...prev];
      const draggedIndex = newBlocks.findIndex(block => block.id === draggedId);
      const targetIndex = newBlocks.findIndex(block => block.id === targetId);
      
      console.log('Found indices - dragged:', draggedIndex, 'target:', targetIndex);
      
      if (draggedIndex === -1 || targetIndex === -1) {
        console.warn('Could not find blocks for swapping');
        return prev;
      }
      
      // Swap the blocks
      const temp = newBlocks[draggedIndex];
      newBlocks[draggedIndex] = newBlocks[targetIndex];
      newBlocks[targetIndex] = temp;
      
      console.log('Blocks swapped successfully. New order:', newBlocks.map(b => b.id));
      
      return newBlocks;
    });
  }, []);

  const reorderBlocks = useCallback((reorderedBlocks: DashboardBlock[]) => {
    console.log('useDashboardLayout: Reordering blocks to:', reorderedBlocks.map(b => b.id));
    setBlocks(reorderedBlocks);
  }, []);

  return {
    blocks,
    initializeBlocks,
    swapBlocks,
    reorderBlocks
  };
};
