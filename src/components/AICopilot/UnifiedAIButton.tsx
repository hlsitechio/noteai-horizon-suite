
import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { useUnifiedAIButton } from './hooks/useUnifiedAIButton';
import QuickActionsMenu from './QuickActionsMenu';
import AIButton3D from './AIButton3D';
import type { UnifiedAIButtonProps } from './types';

const UnifiedAIButton: React.FC<UnifiedAIButtonProps> = ({ 
  onClick, 
  isActive = false, 
  className = "" 
}) => {
  const isMobile = useIsMobile();
  const {
    isDragging,
    showQuickActions,
    dragRef,
    quickActions,
    handleDragStart,
    handleDragEnd,
    handleClick,
    handleQuickAction
  } = useUnifiedAIButton();

  const handleButtonClick = (e: React.MouseEvent) => {
    handleClick(e, onClick);
  };

  return (
    <div className="relative">
      {/* Quick Actions Menu */}
      <QuickActionsMenu
        isVisible={showQuickActions}
        actions={quickActions}
        onActionClick={handleQuickAction}
      />

      {/* Main AI Button */}
      <AIButton3D
        onClick={handleButtonClick}
        isActive={isActive}
        isDragging={isDragging}
        showQuickActions={showQuickActions}
        dragRef={dragRef}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={className}
        isMobile={isMobile}
      />
    </div>
  );
};

export default UnifiedAIButton;
