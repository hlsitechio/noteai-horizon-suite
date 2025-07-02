
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuantumAI } from '@/contexts/QuantumAIContext';

export const useUnifiedAIButton = () => {
  const navigate = useNavigate();
  const { showCommandPalette } = useQuantumAI();
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLButtonElement>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Button will stay in place after drag - no reset needed
  };

  const handleClick = (e: React.MouseEvent, onClick: () => void) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    
    // Always open the main AI Copilot interface directly
    onClick();
  };

  return {
    isDragging,
    dragRef,
    handleDragStart,
    handleDragEnd,
    handleClick
  };
};
