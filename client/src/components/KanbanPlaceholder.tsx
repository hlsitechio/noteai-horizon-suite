import React from 'react';
import FeaturePlaceholder from '@/components/placeholders/FeaturePlaceholder';

// Placeholder exports for all Kanban components
export const KanbanBoard = (props: any) => <FeaturePlaceholder featureName="Kanban Board" />;
export const KanbanTaskCard = (props: any) => <FeaturePlaceholder featureName="Kanban Task" />;
export const TaskDetailDialog = (props: any) => <FeaturePlaceholder featureName="Task Details" />;
export const CreateTaskDialog = (props: any) => <FeaturePlaceholder featureName="Create Task" />;

export default KanbanBoard;