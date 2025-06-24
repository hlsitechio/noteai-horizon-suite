
import React, { useState, useEffect, createContext, useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useUnifiedDragDrop } from '../../hooks/useUnifiedDragDrop';

interface DragDropReadyContextType {
  isReady: boolean;
}

const DragDropReadyContext = createContext<DragDropReadyContextType>({ isReady: false });

export const useDragDropReady = () => useContext(DragDropReadyContext);

interface UnifiedDragDropProviderProps {
  children: React.ReactNode;
}

export function UnifiedDragDropProvider({ children }: UnifiedDragDropProviderProps) {
  const { handleDragEnd } = useUnifiedDragDrop();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure the context is ready after a brief delay to avoid race conditions
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DragDropReadyContext.Provider value={{ isReady }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {children}
      </DragDropContext>
    </DragDropReadyContext.Provider>
  );
}
