
import React, { createContext, useContext } from 'react';
import { useCustomCursor, CursorState } from '../hooks/useCustomCursor';
import { cursorPacks } from '../components/CustomCursor/CursorPacks';

interface CursorContextType {
  cursorState: CursorState;
  setCursorState: (state: CursorState) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  currentPack: string;
  switchPack: (packId: string) => void;
  availablePacks: typeof cursorPacks;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cursor = useCustomCursor();

  return (
    <CursorContext.Provider value={cursor}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};
