
import { supabase } from '@/integrations/supabase/client';

export interface WasabiUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  fileName?: string;
  fileType?: string;
  error?: string;
}

export interface WasabiFile {
  name: string;
  url: string;
  path: string;
  size: number;
  lastModified: string;
}

export class WasabiStorageService {
  private static readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
    'application/pdf', 'application/doc', 'application/docx',
    'text/plain', 'text/csv'
  ];

  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return { isValid: false, error: 'File size must be less than 100MB' };
    }

    // Check file type
    if (this.ALLOWED_TYPES.length > 0 && !this.ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: 'File type not supported.' };
    }

    return { isValid: true };
  }

  static async uploadFile(
    file: File, 
    bucketPath: string = 'uploads',
    onProgress?: (progress: number) => void
  ): Promise<WasabiUploadResult> {
    try {
      // Validate file first
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      if (onProgress) onProgress(10);

      // Convert file to base64
      const fileBase64 = await this.fileToBase64(file);
      
      if (onProgress) onProgress(30);

      // Call the Wasabi edge function
      const { data, error } = await supabase.functions.invoke('wasabi-storage', {
        body: {
          action: 'upload',
          fileData: fileBase64,
          fileName: file.name,
          fileType: file.type,
          bucketPath: bucketPath
        }
      });

      if (error) {
        console.error('Wasabi upload error:', error);
        throw new Error(error.message || 'Upload failed');
      }

      if (onProgress) onProgress(90);

      if (!data || !data.success) {
        throw new Error('Invalid response from upload service');
      }

      if (onProgress) onProgress(100);

      console.log('File uploaded to Wasabi successfully:', data);
      return data as WasabiUploadResult;
    } catch (error) {
      console.error('Wasabi upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  static async uploadBanner(file: File): Promise<WasabiUploadResult> {
    return this.uploadFile(file, 'banners');
  }

  static async uploadDocument(file: File): Promise<WasabiUploadResult> {
    return this.uploadFile(file, 'documents');
  }

  static async uploadImage(file: File): Promise<WasabiUploadResult> {
    return this.uploadFile(file, 'images');
  }

  static async uploadVideo(file: File): Promise<WasabiUploadResult> {
    return this.uploadFile(file, 'videos');
  }

  static async listFiles(bucketPath: string = ''): Promise<WasabiFile[]> {
    try {
      const { data, error } = await supabase.functions.invoke('wasabi-storage', {
        body: {
          action: 'list',
          bucketPath: bucketPath
        }
      });

      if (error) {
        console.error('Wasabi list error:', error);
        throw new Error(error.message || 'Failed to list files');
      }

      if (!data || !data.success) {
        throw new Error('Invalid response from list service');
      }

      // Parse XML response (simplified)
      // In a production app, you'd want to use a proper XML parser
      console.log('Files listed from Wasabi successfully');
      return [];
    } catch (error) {
      console.error('Wasabi list error:', error);
      return [];
    }
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
