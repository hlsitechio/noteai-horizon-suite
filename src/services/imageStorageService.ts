// Image storage service - DISABLED
// The user_gallery table doesn't exist in the current database schema

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
    console.warn('Image storage service disabled - user_gallery table missing from database schema');
    return null;
  }

  static async getUserGallery(userId: string): Promise<GalleryImage[]> {
    console.warn('Image storage service disabled - user_gallery table missing from database schema');
    return [];
  }

  static async deleteImage(imageId: string): Promise<boolean> {
    console.warn('Image storage service disabled - user_gallery table missing from database schema');
    return false;
  }

  static async updateImage(
    imageId: string, 
    updates: { title?: string; description?: string; tags?: string[]; is_banner?: boolean }
  ): Promise<GalleryImage | null> {
    console.warn('Image storage service disabled - user_gallery table missing from database schema');
    return null;
  }

  static async getBannerImages(userId: string): Promise<GalleryImage[]> {
    console.warn('Image storage service disabled - user_gallery table missing from database schema');
    return [];
  }

  static async searchImages(userId: string, searchTerm: string): Promise<GalleryImage[]> {
    console.warn('Image storage service disabled - user_gallery table missing from database schema');
    return [];
  }
}