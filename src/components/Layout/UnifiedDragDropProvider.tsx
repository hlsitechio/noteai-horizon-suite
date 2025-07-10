
import React from 'react';

interface UnifiedDragDropProviderProps {
  children: React.ReactNode;
}

export function UnifiedDragDropProvider({ children }: UnifiedDragDropProviderProps) {
  // Simplified provider - using @dnd-kit/core instead of react-beautiful-dnd
  return <>{children}</>;
}
