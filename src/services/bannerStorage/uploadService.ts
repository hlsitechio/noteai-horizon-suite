
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BannerData, BannerMetadata, BannerUploadResult } from './types';
import { generateFileName, getFileExtension, checkBucketExists, getPublicUrl } from './utils';

export class BannerUploadService {
  static async uploadBanner(
    file: File,
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ): Promise<BannerData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Authentication required');
        return null;
      }

      const fileExt = getFileExtension(file.name);
      const fileName = generateFileName(user.id, bannerType, projectId, fileExt);
      
      console.log('BannerUploadService: Uploading file:', fileName, file.type, file.size);

      // Check if bucket exists
      const bucketExists = await checkBucketExists();
      if (!bucketExists) {
        toast.error('Storage bucket not found. Please contact support.');
        return null;
      }

      // Upload file to storage
      const uploadResult = await this.uploadFileToStorage(fileName, file);
      if (!uploadResult.success) {
        return null;
      }

      // Get public URL
      const publicUrl = getPublicUrl(fileName);
      console.log('BannerUploadService: Public URL generated:', publicUrl);

      // Save metadata to database
      const bannerData = await this.saveBannerMetadata(user.id, bannerType, projectId, publicUrl, file);
      if (!bannerData) {
        return null;
      }

      console.log('BannerUploadService: Banner saved successfully:', bannerData);
      toast.success('Banner uploaded successfully!');
      
      return bannerData;
    } catch (error) {
      console.error('BannerUploadService: Upload exception:', error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  private static async uploadFileToStorage(fileName: string, file: File): Promise<BannerUploadResult> {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('banners')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('BannerUploadService: Upload error details:', uploadError);
      
      if (uploadError.message.includes('not found') || uploadError.message.includes('bucket')) {
        toast.error('Storage bucket not found. Please contact support.');
      } else {
        toast.error(`Upload failed: ${uploadError.message}`);
      }
      
      return { success: false, error: uploadError.message };
    }

    console.log('BannerUploadService: Upload successful:', uploadData);
    return { success: true };
  }

  private static async saveBannerMetadata(
    userId: string,
    bannerType: 'dashboard' | 'project',
    projectId: string | undefined,
    publicUrl: string,
    file: File
  ): Promise<BannerData | null> {
    const bannerMetadata: BannerMetadata = {
      user_id: userId,
      banner_type: bannerType,
      project_id: projectId || null,
      file_url: publicUrl,
      file_type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
      file_name: file.name,
      file_size: file.size
    };

    console.log('BannerUploadService: Saving metadata:', bannerMetadata);

    const { data: bannerData, error: dbError } = await supabase
      .from('banners')
      .upsert(bannerMetadata, {
        onConflict: 'user_id,banner_type,project_id'
      })
      .select()
      .single();

    if (dbError) {
      console.error('BannerUploadService: Database error details:', dbError);
      toast.error(`Database error: ${dbError.message}`);
      return null;
    }

    // Ensure proper type casting for the returned data
    return {
      ...bannerData,
      file_type: bannerData.file_type as 'image' | 'video'
    };
  }
}
