import React from 'react';
import { useIsMobile } from '../../hooks/use-mobile';
import { useUnifiedAIButton } from './hooks/useUnifiedAIButton';
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
    dragRef,
    handleDragStart,
    handleDragEnd,
    handleClick
  } = useUnifiedAIButton();
  const handleButtonClick = (e: React.MouseEvent) => {
    handleClick(e, onClick);
  };
  return;
};
export default UnifiedAIButton;