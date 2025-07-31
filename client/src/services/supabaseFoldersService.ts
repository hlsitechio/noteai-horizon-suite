
import { Folder } from '../types/folder';

const API_BASE_URL = window.location.origin + '/api';

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export class SupabaseFoldersService {
  static async getAllFolders(): Promise<Folder[]> {
    try {
      const data = await apiRequest('/folders');

      return data.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        color: '#64748b', // Default color since not in database
        parentId: folder.parent_folder_id,
        createdAt: new Date(folder.created_at),
        updatedAt: new Date(folder.updated_at),
      }));
    } catch (error) {
      console.error('Error loading folders:', error);
      return [];
    }
  }

  static async saveFolder(folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>): Promise<Folder> {
    try {
      const data = await apiRequest('/folders', {
        method: 'POST',
        body: JSON.stringify({
          name: folderData.name,
          parent_folder_id: folderData.parentId,
        }),
      });

      return {
        id: data.id,
        name: data.name,
        color: '#64748b', // Default color since not in database
        parentId: data.parent_folder_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error saving folder:', error);
      throw error;
    }
  }

  static async updateFolder(id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>): Promise<Folder | null> {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.parentId !== undefined) updateData.parent_folder_id = updates.parentId;

      const data = await apiRequest(`/folders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      return {
        id: data.id,
        name: data.name,
        color: '#64748b', // Default color since not in database
        parentId: data.parent_folder_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Error updating folder:', error);
      return null;
    }
  }

  static async deleteFolder(id: string): Promise<boolean> {
    try {
      await apiRequest(`/folders/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      return false;
    }
  }
}
