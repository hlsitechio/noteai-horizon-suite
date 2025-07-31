
import { Folder } from '../types/folder';

const FOLDERS_STORAGE_KEY = 'online-note-ai-folders';

export class FolderStorageService {
  static getAllFolders(): Folder[] {
    try {
      const foldersJson = localStorage.getItem(FOLDERS_STORAGE_KEY);
      if (!foldersJson) return [];
      
      const folders = JSON.parse(foldersJson);
      return folders.map((folder: any) => ({
        ...folder,
        createdAt: new Date(folder.createdAt),
        updatedAt: new Date(folder.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading folders:', error);
      return [];
    }
  }

  static saveFolder(folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): Folder {
    const folders = this.getAllFolders();
    const newFolder: Folder = {
      ...folder,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    folders.push(newFolder);
    this.saveAllFolders(folders);
    return newFolder;
  }

  static updateFolder(id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>): Folder | null {
    const folders = this.getAllFolders();
    const folderIndex = folders.findIndex(folder => folder.id === id);
    
    if (folderIndex === -1) return null;
    
    const updatedFolder = {
      ...folders[folderIndex],
      ...updates,
      updatedAt: new Date(),
    };
    
    folders[folderIndex] = updatedFolder;
    this.saveAllFolders(folders);
    return updatedFolder;
  }

  static deleteFolder(id: string): boolean {
    const folders = this.getAllFolders();
    const filteredFolders = folders.filter(folder => folder.id !== id);
    
    if (filteredFolders.length === folders.length) return false;
    
    this.saveAllFolders(filteredFolders);
    return true;
  }

  private static saveAllFolders(folders: Folder[]): void {
    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error('Error saving folders:', error);
    }
  }
}
