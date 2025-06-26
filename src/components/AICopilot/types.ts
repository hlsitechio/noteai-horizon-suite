
import React from 'react';

export interface UnifiedAIButtonProps {
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

export interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  action: () => void;
  color: string;
}

export interface AIButton3DProps {
  onClick: (e: React.MouseEvent) => void;
  isActive: boolean;
  isDragging: boolean;
  showQuickActions: boolean;
  dragRef: React.RefObject<HTMLButtonElement>;
  onDragStart: () => void;
  onDragEnd: () => void;
  className: string;
  isMobile: boolean;
}

export interface QuickActionsMenuProps {
  isVisible: boolean;
  actions: QuickAction[];
  onActionClick: (action: () => void) => void;
}
