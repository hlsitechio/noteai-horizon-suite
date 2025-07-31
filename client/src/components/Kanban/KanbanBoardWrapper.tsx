import React from 'react';
import FeaturePlaceholder from '@/components/placeholders/FeaturePlaceholder';
import { Trello } from 'lucide-react';

interface KanbanBoardWrapperProps {
  [key: string]: any;
}

const KanbanBoardWrapper: React.FC<KanbanBoardWrapperProps> = (props) => {
  return (
    <FeaturePlaceholder 
      featureName="Kanban Board" 
      icon={<Trello className="w-6 h-6" />}
      description="Kanban board functionality is temporarily disabled while we optimize the system."
    />
  );
};

export default KanbanBoardWrapper;