
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
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
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    
    // Use multiple checks to ensure context is ready
    const timer1 = setTimeout(() => {
      if (mountedRef.current) {
        // First check after initial render
        setIsReady(true);
      }
    }, 50);

    const timer2 = setTimeout(() => {
      if (mountedRef.current) {
        // Double check to ensure stability
        setIsReady(true);
      }
    }, 200);

    return () => {
      mountedRef.current = false;
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <DragDropReadyContext.Provider value={{ isReady }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        {children}
      </DragDropContext>
    </DragDropReadyContext.Provider>
  );
}
