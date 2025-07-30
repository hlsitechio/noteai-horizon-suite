import { supabase } from "@/integrations/supabase/client";

export interface WorkspaceMediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'note-attachment';
  size: number;
  mimeType: string;
  storagePath: string;
  createdAt: string;
  updatedAt: string;
}

export class WorkspaceMediaService {
  
  // Get the user-specific storage path
  private static getUserStoragePath(userId: string, type: 'image' | 'video' | 'document' | 'note-attachment'): string {
    const bucketMap = {
      'image': 'user-gallery',
      'video': 'banner-videos', 
      'document': 'notes-attachments',
      'note-attachment': 'notes-attachments'
    };
    
    return `${userId}/${type}s`;
  }

  // Upload media file to user's workspace
  static async uploadFile(
    file: File, 
    userId: string, 
    type: 'image' | 'video' | 'document' | 'note-attachment',
    workspaceId?: string
  ): Promise<{ url: string; path: string } | null> {
    try {
      const bucketMap = {
        'image': 'user-gallery',
        'video': 'banner-videos',
        'document': 'notes-attachments', 
        'note-attachment': 'notes-attachments'
      };

      const bucket = bucketMap[type];
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storagePath = `${userId}/${type}s/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(storagePath);

      // Save to user_gallery table for tracking
      await supabase
        .from('user_gallery')
        .insert({
          user_id: userId,
          file_name: fileName,
          file_url: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
          storage_path: storagePath,
          title: file.name,
          tags: [type, workspaceId].filter(Boolean)
        });

      return {
        url: urlData.publicUrl,
        path: storagePath
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  // Get user's media files by type
  static async getUserMedia(
    userId: string, 
    type?: 'image' | 'video' | 'document' | 'note-attachment'
  ): Promise<WorkspaceMediaFile[]> {
    try {
      let query = supabase
        .from('user_gallery')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (type) {
        query = query.contains('tags', [type]);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        name: item.file_name,
        url: item.file_url,
        type: this.determineFileType(item.file_type, item.tags),
        size: item.file_size,
        mimeType: item.file_type,
        storagePath: item.storage_path,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error('Error getting user media:', error);
      return [];
    }
  }

  // Delete media file
  static async deleteFile(userId: string, storagePath: string, fileId: string): Promise<boolean> {
    try {
      // Determine bucket from storage path
      const bucket = this.getBucketFromPath(storagePath);
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_gallery')
        .delete()
        .eq('id', fileId)
        .eq('user_id', userId);

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // Get workspace banner images for selection
  static async getWorkspaceBanners(userId: string): Promise<WorkspaceMediaFile[]> {
    const images = await this.getUserMedia(userId, 'image');
    const videos = await this.getUserMedia(userId, 'video');
    
    return [...images, ...videos].filter(file => 
      file.type === 'image' || file.type === 'video'
    );
  }

  // Upload banner specifically for workspace
  static async uploadBanner(
    file: File, 
    userId: string, 
    workspaceId: string
  ): Promise<{ url: string; type: 'image' | 'video' } | null> {
    const fileType = file.type.startsWith('image/') ? 'image' : 
                    file.type.startsWith('video/') ? 'video' : null;
    
    if (!fileType) {
      console.error('Invalid file type for banner');
      return null;
    }

    const result = await this.uploadFile(file, userId, fileType, workspaceId);
    
    if (result) {
      return {
        url: result.url,
        type: fileType
      };
    }
    
    return null;
  }

  // Attach file to note
  static async attachToNote(
    file: File,
    userId: string,
    noteId: string
  ): Promise<{ url: string; path: string } | null> {
    return await this.uploadFile(file, userId, 'note-attachment', noteId);
  }

  // Helper methods
  private static determineFileType(mimeType: string, tags: string[]): 'image' | 'video' | 'document' | 'note-attachment' {
    if (tags.includes('note-attachment')) return 'note-attachment';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'document';
  }

  private static getBucketFromPath(storagePath: string): string {
    if (storagePath.includes('/images/')) return 'user-gallery';
    if (storagePath.includes('/videos/')) return 'banner-videos';
    if (storagePath.includes('/documents/') || storagePath.includes('/note-attachments/')) return 'notes-attachments';
    return 'user-gallery'; // default
  }

  // Clean up orphaned files (files not linked to any workspace)
  static async cleanupOrphanedFiles(userId: string): Promise<number> {
    try {
      // Get all user's files
      const { data: files, error } = await supabase
        .from('user_gallery')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      let deletedCount = 0;
      
      // Check which files are still referenced in workspace
      for (const file of files || []) {
        // Check if file is referenced in any workspace
        const { data: workspaces } = await supabase
          .from('dashboard_workspaces')
          .select('selected_banner_url, banner_settings')
          .eq('user_id', userId);

        let isReferenced = false;
        
        for (const workspace of workspaces || []) {
          if (workspace.selected_banner_url === file.file_url) {
            isReferenced = true;
            break;
          }
          
          // Check banner_settings for any references
          const bannerSettings = workspace.banner_settings as any;
          if (bannerSettings && Object.values(bannerSettings).includes(file.file_url)) {
            isReferenced = true;
            break;
          }
        }

        // Check if file is referenced in any notes
        if (!isReferenced && file.tags?.includes('note-attachment')) {
          const { data: notes } = await supabase
            .from('notes_v2')
            .select('content')
            .eq('user_id', userId)
            .like('content', `%${file.file_url}%`);
          
          if (notes && notes.length > 0) {
            isReferenced = true;
          }
        }

        // Delete if not referenced anywhere
        if (!isReferenced) {
          const deleted = await this.deleteFile(userId, file.storage_path, file.id);
          if (deleted) deletedCount++;
        }
      }

      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up orphaned files:', error);
      return 0;
    }
  }
}