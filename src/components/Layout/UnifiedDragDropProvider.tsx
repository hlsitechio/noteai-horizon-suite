
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useUnifiedDragDrop } from '../../hooks/useUnifiedDragDrop';

interface DragDropReadyContextType {
  isReady: boolean;
  contextRef: React.RefObject<any>;
}

const DragDropReadyContext = createContext<DragDropReadyContextType>({ 
  isReady: false, 
  contextRef: { current: null } 
});

export const useDragDropReady = () => useContext(DragDropReadyContext);

interface UnifiedDragDropProviderProps {
  children: React.ReactNode;
}

export function UnifiedDragDropProvider({ children }: UnifiedDragDropProviderProps) {
  const { handleDragEnd } = useUnifiedDragDrop();
  const [isReady, setIsReady] = useState(false);
  const contextRef = useRef<any>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    
    // Use requestAnimationFrame to ensure DOM is ready
    const checkContext = () => {
      if (mountedRef.current && contextRef.current) {
        setIsReady(true);
      } else if (mountedRef.current) {
        requestAnimationFrame(checkContext);
      }
    };

    requestAnimationFrame(checkContext);

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleContextRef = (ref: any) => {
    contextRef.current = ref;
    if (ref && mountedRef.current) {
      setIsReady(true);
    }
  };

  return (
    <DragDropReadyContext.Provider value={{ isReady, contextRef }}>
      <DragDropContext onDragEnd={handleDragEnd} ref={handleContextRef}>
        {children}
      </DragDropContext>
    </DragDropReadyContext.Provider>
  );
}
