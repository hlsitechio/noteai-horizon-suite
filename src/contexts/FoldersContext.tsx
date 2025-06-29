
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Folder } from '../types/folder';
import { SupabaseFoldersService } from '../services/supabaseFoldersService';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

interface FoldersContextType {
  folders: Folder[];
  isLoading: boolean;
  createFolder: (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Folder>;
  updateFolder: (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>) => Promise<Folder | null>;
  deleteFolder: (id: string) => Promise<boolean>;
  refreshFolders: () => void;
}

const FoldersContext = createContext<FoldersContextType | undefined>(undefined);

export const useFolders = () => {
  const context = useContext(FoldersContext);
  if (!context) {
    throw new Error('useFolders must be used within a FoldersProvider');
  }
  return context;
};

export const FoldersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading } = useAuth();

  const refreshFolders = async () => {
    // Don't try to load folders if user is not authenticated
    if (!user || authLoading) {
      setFolders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const loadedFolders = await SupabaseFoldersService.getAllFolders();
      setFolders(loadedFolders);
    } catch (error) {
      console.error('Error loading folders:', error);
      // Don't show toast error if it's just an auth issue
      if (user) {
        toast.error('Failed to load folders');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only refresh folders when auth state is settled and user is authenticated
    if (!authLoading) {
      refreshFolders();
    }
  }, [user, authLoading]);

  const createFolder = async (folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Folder> => {
    try {
      const newFolder = await SupabaseFoldersService.saveFolder(folderData);
      setFolders(prev => [newFolder, ...prev]);
      toast.success('Folder created successfully');
      return newFolder;
    } catch (error) {
      toast.error('Failed to create folder');
      throw error;
    }
  };

  const updateFolder = async (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>): Promise<Folder | null> => {
    try {
      const updatedFolder = await SupabaseFoldersService.updateFolder(id, updates);
      if (updatedFolder) {
        setFolders(prev => prev.map(folder => folder.id === id ? updatedFolder : folder));
        toast.success('Folder updated successfully');
      }
      return updatedFolder;
    } catch (error) {
      toast.error('Failed to update folder');
      throw error;
    }
  };

  const deleteFolder = async (id: string): Promise<boolean> => {
    try {
      const success = await SupabaseFoldersService.deleteFolder(id);
      if (success) {
        setFolders(prev => prev.filter(folder => folder.id !== id));
        toast.success('Folder deleted successfully');
      }
      return success;
    } catch (error) {
      toast.error('Failed to delete folder');
      throw error;
    }
  };

  return (
    <FoldersContext.Provider
      value={{
        folders,
        isLoading,
        createFolder,
        updateFolder,
        deleteFolder,
        refreshFolders,
      }}
    >
      {children}
    </FoldersContext.Provider>
  );
};

// Export the context itself for use in App.tsx
export { FoldersContext };
