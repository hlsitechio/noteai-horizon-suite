
import { supabase } from '@/integrations/supabase/client';
import { Folder } from '../types/folder';

export class SupabaseFoldersService {
  static async getAllFolders(): Promise<Folder[]> {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data.map(folder => ({
        id: folder.id,
        name: folder.name,
        color: folder.color || '#64748b',
        parentId: folder.parent_id,
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
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('folders')
        .insert({
          name: folderData.name,
          color: folderData.color || '#64748b',
          parent_id: folderData.parentId,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        color: data.color || '#64748b',
        parentId: data.parent_id,
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
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.parentId !== undefined) updateData.parent_id = updates.parentId;

      const { data, error } = await supabase
        .from('folders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        color: data.color || '#64748b',
        parentId: data.parent_id,
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
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      return false;
    }
  }
}
