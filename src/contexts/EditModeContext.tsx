import React, { createContext, useContext } from 'react';
import { useEditModeState } from '@/hooks/useEditModeState';

interface EditModeContextType {
  isEditMode: boolean;
  setIsEditMode: (editMode: boolean) => void;
  isDashboardEditMode: boolean;
  setIsDashboardEditMode: (editMode: boolean) => void;
  isSidebarEditMode: boolean;
  setIsSidebarEditMode: (editMode: boolean) => void;
  isLoading: boolean;
  handlePanelSizeSave: () => Promise<void>;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isDashboardEditMode,
    isSidebarEditMode,
    isLoading,
    setIsDashboardEditMode,
    setIsSidebarEditMode,
    handlePanelSizeSave
  } = useEditModeState();

  // Legacy support for general edit mode (combines both)
  const isEditMode = isDashboardEditMode || isSidebarEditMode;
  const setIsEditMode = (editMode: boolean) => {
    setIsDashboardEditMode(editMode);
    setIsSidebarEditMode(editMode);
  };

  return (
    <EditModeContext.Provider 
      value={{
        isEditMode,
        setIsEditMode,
        isDashboardEditMode,
        setIsDashboardEditMode,
        isSidebarEditMode,
        setIsSidebarEditMode,
        isLoading,
        handlePanelSizeSave,
      }}
    >
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};