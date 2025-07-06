import React, { createContext, useContext, useState } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  setIsEditMode: (editMode: boolean) => void;
  isDashboardEditMode: boolean;
  setIsDashboardEditMode: (editMode: boolean) => void;
  isSidebarEditMode: boolean;
  setIsSidebarEditMode: (editMode: boolean) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDashboardEditMode, setIsDashboardEditMode] = useState(false);
  const [isSidebarEditMode, setIsSidebarEditMode] = useState(false);

  return (
    <EditModeContext.Provider 
      value={{
        isEditMode,
        setIsEditMode,
        isDashboardEditMode,
        setIsDashboardEditMode,
        isSidebarEditMode,
        setIsSidebarEditMode,
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