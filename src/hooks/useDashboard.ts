
import { useState, useCallback } from 'react';
import { useDashboardData } from './useDashboardData';

export interface DashboardBlock {
  id: string;
  type: 'kpi' | 'recent-notes' | 'quick-actions' | 'categories' | 'recent-activity' | 'workflow-actions';
  title: string;
  position: number;
  isVisible: boolean;
  size?: 'small' | 'medium' | 'large';
}

const defaultBlocks: DashboardBlock[] = [
  { id: 'notes-count', type: 'kpi', title: 'Total Notes', position: 0, isVisible: true, size: 'small' },
  { id: 'words-count', type: 'kpi', title: 'Total Words', position: 1, isVisible: true, size: 'small' },
  { id: 'avg-words', type: 'kpi', title: 'Avg Words', position: 2, isVisible: true, size: 'small' },
  { id: 'categories-count', type: 'kpi', title: 'Categories', position: 3, isVisible: true, size: 'small' },
  { id: 'weekly-notes', type: 'kpi', title: 'Weekly Notes', position: 4, isVisible: true, size: 'small' },
  { id: 'favorites-count', type: 'kpi', title: 'Favorites', position: 5, isVisible: true, size: 'small' },
  { id: 'recent-notes', type: 'recent-notes', title: 'Recent Notes', position: 6, isVisible: true, size: 'large' },
  { id: 'quick-actions', type: 'quick-actions', title: 'Quick Actions', position: 7, isVisible: true, size: 'medium' },
  { id: 'categories', type: 'categories', title: 'Categories Overview', position: 8, isVisible: true, size: 'medium' },
  { id: 'recent-activity', type: 'recent-activity', title: 'Recent Activity', position: 9, isVisible: true, size: 'medium' },
  { id: 'workflow-actions', type: 'workflow-actions', title: 'Workflow Actions', position: 10, isVisible: true, size: 'medium' },
];

export const useDashboard = () => {
  const dashboardData = useDashboardData();
  const [blocks, setBlocks] = useState<DashboardBlock[]>(defaultBlocks);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  const handleBlocksReorder = useCallback((startIndex: number, endIndex: number) => {
    setBlocks(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update positions
      return result.map((block, index) => ({
        ...block,
        position: index,
      }));
    });
  }, []);

  const handleDragStart = useCallback((blockId: string) => {
    setIsDragging(true);
    setDraggedBlockId(blockId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedBlockId(null);
  }, []);

  const handleResetLayout = useCallback(() => {
    setBlocks(defaultBlocks);
  }, []);

  return {
    ...dashboardData,
    blocks,
    isDragging,
    draggedBlockId,
    handleBlocksReorder,
    handleDragStart,
    handleDragEnd,
    handleResetLayout,
  };
};
