
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
    setBlocks(initialBlocks);
  }, []);

  const swapBlocks = useCallback((draggedId: string, targetId: string) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      const draggedIndex = newBlocks.findIndex(block => block.id === draggedId);
      const targetIndex = newBlocks.findIndex(block => block.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      // Swap the blocks
      [newBlocks[draggedIndex], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[draggedIndex]];
      
      return newBlocks;
    });
  }, []);

  return {
    blocks,
    initializeBlocks,
    swapBlocks
  };
};
