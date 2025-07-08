import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface GalleryImage {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  storage_path: string;
  file_size: number;
  file_type: string;
  title?: string;
  description?: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export class ImageStorageService {
  private static readonly BUCKET_NAME = 'onaib1';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: 'File type not supported. Please use JPG, PNG, WebP, or GIF.' };
    }

    return { isValid: true };
  }

  static async uploadImage(file: File, title?: string, description?: string, tags: string[] = []): Promise<GalleryImage | null> {
    try {
      // Validate file first
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Get current user with better error handling
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Auth error:', userError);
        throw new Error('Authentication error: ' + userError.message);
      }
      
      if (!user || !user.id) {
        throw new Error('User not authenticated - please log in first');
      }

      console.log('Uploading image for user:', user.id);

      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName);

      console.log('File uploaded successfully, inserting into database...');

      // Save to user_gallery table with explicit user_id
      const insertData = {
        user_id: user.id, // Explicitly set the user_id
        file_name: file.name,
        file_url: publicUrl,
        storage_path: fileName,
        file_size: file.size,
        file_type: file.type,
        title: title || file.name,
        description: description || '',
        tags: tags || [],
        is_public: false
      };

      console.log('Inserting gallery record:', insertData);

      const { data: galleryData, error: dbError } = await supabase
        .from('user_gallery')
        .insert(insertData)
        .select()
        .single();

      if (dbError) {
        console.error('Database insertion error:', dbError);
        // Clean up uploaded file if database insert fails
        await supabase.storage.from(this.BUCKET_NAME).remove([fileName]);
        throw new Error(`Database error: ${dbError.message}. Details: ${dbError.details || 'No additional details'}`);
      }

      console.log('Image uploaded and saved successfully:', galleryData);
      return galleryData;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  static async getUserGallery(userId: string): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('user_gallery')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch gallery: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      return [];
    }
  }

  static async deleteImage(imageId: string): Promise<boolean> {
    try {
      // First get the image data to know the storage path
      const { data: imageData, error: fetchError } = await supabase
        .from('user_gallery')
        .select('storage_path')
        .eq('id', imageId)
        .single();

      if (fetchError || !imageData) {
        throw new Error('Image not found');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([imageData.storage_path]);

      if (storageError) {
        console.warn('Storage deletion failed:', storageError.message);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_gallery')
        .delete()
        .eq('id', imageId);

      if (dbError) {
        throw new Error(`Database deletion failed: ${dbError.message}`);
      }

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  static async updateImage(
    imageId: string, 
    updates: { title?: string; description?: string; tags?: string[]; is_public?: boolean }
  ): Promise<GalleryImage | null> {
    try {
      const { data, error } = await supabase
        .from('user_gallery')
        .update(updates)
        .eq('id', imageId)
        .select()
        .single();

      if (error) {
        throw new Error(`Update failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Update error:', error);
      return null;
    }
  }

  static async getBannerImages(userId: string): Promise<GalleryImage[]> {
    return this.getUserGallery(userId);
  }

  static async searchImages(userId: string, searchTerm: string): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('user_gallery')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Search failed: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }
}