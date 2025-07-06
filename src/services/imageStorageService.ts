import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface GalleryImage {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  file_type: string;
  title?: string;
  description?: string;
  tags: string[];
  is_banner: boolean;
  created_at: string;
  updated_at: string;
}

export class ImageStorageService {
  private static readonly BUCKET_NAME = 'banner-images';
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath);

      // Save to database
      const { data: dbData, error: dbError } = await supabase
        .from('user_gallery')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          title: title || file.name.split('.')[0],
          description,
          tags,
          is_banner: true // Default to banner for now
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return dbData as GalleryImage;
    } catch (error) {
      console.error('Error uploading image:', error);
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

      if (error) throw error;
      return data as GalleryImage[];
    } catch (error) {
      console.error('Error fetching user gallery:', error);
      throw error;
    }
  }

  static async deleteImage(imageId: string): Promise<boolean> {
    try {
      // Get image data first
      const { data: imageData, error: fetchError } = await supabase
        .from('user_gallery')
        .select('file_path')
        .eq('id', imageId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([imageData.file_path]);

      if (storageError) {
        console.warn('Storage deletion failed:', storageError);
        // Continue with database deletion even if storage fails
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_gallery')
        .delete()
        .eq('id', imageId);

      if (dbError) throw dbError;

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  static async updateImage(
    imageId: string, 
    updates: { title?: string; description?: string; tags?: string[]; is_banner?: boolean }
  ): Promise<GalleryImage | null> {
    try {
      const { data, error } = await supabase
        .from('user_gallery')
        .update(updates)
        .eq('id', imageId)
        .select()
        .single();

      if (error) throw error;
      return data as GalleryImage;
    } catch (error) {
      console.error('Error updating image:', error);
      throw error;
    }
  }

  static async getBannerImages(userId: string): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('user_gallery')
        .select('*')
        .eq('user_id', userId)
        .eq('is_banner', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GalleryImage[];
    } catch (error) {
      console.error('Error fetching banner images:', error);
      throw error;
    }
  }

  static async searchImages(userId: string, searchTerm: string): Promise<GalleryImage[]> {
    try {
      const { data, error } = await supabase
        .from('user_gallery')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GalleryImage[];
    } catch (error) {
      console.error('Error searching images:', error);
      throw error;
    }
  }
}