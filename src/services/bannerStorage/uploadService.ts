
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
      console.log('BannerUploadService: Starting upload process', { fileName: file.name, fileSize: file.size, fileType: file.type });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('BannerUploadService: No authenticated user found');
        toast.error('Authentication required');
        return null;
      }

      console.log('BannerUploadService: User authenticated', user.id);

      // Check if bucket exists
      const bucketExists = await checkBucketExists();
      console.log('BannerUploadService: Bucket exists check:', bucketExists);
      
      if (!bucketExists) {
        console.error('BannerUploadService: Banners bucket does not exist');
        toast.error('Storage bucket not found. Please contact support.');
        return null;
      }

      const fileExt = getFileExtension(file.name);
      const fileName = generateFileName(user.id, bannerType, projectId, fileExt);
      
      console.log('BannerUploadService: Generated file name:', fileName);

      // Upload file to storage
      const uploadResult = await this.uploadFileToStorage(fileName, file);
      if (!uploadResult.success) {
        console.error('BannerUploadService: File upload to storage failed');
        return null;
      }

      console.log('BannerUploadService: File uploaded to storage successfully');

      // Get public URL
      const publicUrl = getPublicUrl(fileName);
      console.log('BannerUploadService: Public URL generated:', publicUrl);

      // Save metadata to database
      const bannerData = await this.saveBannerMetadata(user.id, bannerType, projectId, publicUrl, file);
      if (!bannerData) {
        console.error('BannerUploadService: Failed to save banner metadata to database');
        return null;
      }

      console.log('BannerUploadService: Banner saved successfully:', bannerData);
      toast.success('Banner uploaded successfully!');
      
      return bannerData;
    } catch (error) {
      console.error('BannerUploadService: Upload exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Upload failed: ${errorMessage}`);
      return null;
    }
  }

  private static async uploadFileToStorage(fileName: string, file: File): Promise<BannerUploadResult> {
    try {
      console.log('BannerUploadService: Uploading file to storage bucket "banners"', { fileName, fileSize: file.size, fileType: file.type });
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('BannerUploadService: Storage upload error:', uploadError);
        toast.error(`Storage upload failed: ${uploadError.message}`);
        return { success: false, error: uploadError.message };
      }

      console.log('BannerUploadService: Storage upload successful:', uploadData);
      return { success: true };
    } catch (error) {
      console.error('BannerUploadService: Storage upload exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown storage error';
      return { success: false, error: errorMessage };
    }
  }

  private static async saveBannerMetadata(
    userId: string,
    bannerType: 'dashboard' | 'project',
    projectId: string | undefined,
    publicUrl: string,
    file: File
  ): Promise<BannerData | null> {
    try {
      const bannerMetadata: BannerMetadata = {
        user_id: userId,
        banner_type: bannerType,
        project_id: projectId || null,
        file_url: publicUrl,
        file_type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        file_name: file.name,
        file_size: file.size
      };

      console.log('BannerUploadService: Attempting to save banner metadata:', bannerMetadata);

      // For dashboard banners, we need to handle the unique constraint properly
      if (bannerType === 'dashboard') {
        // First try to update existing dashboard banner
        const { data: existingBanner, error: selectError } = await supabase
          .from('banners')
          .select('id')
          .eq('user_id', userId)
          .eq('banner_type', 'dashboard')
          .is('project_id', null)
          .maybeSingle();

        if (selectError) {
          console.error('BannerUploadService: Error checking existing banner:', selectError);
          toast.error(`Database query error: ${selectError.message}`);
          return null;
        }

        if (existingBanner) {
          console.log('BannerUploadService: Updating existing dashboard banner:', existingBanner.id);
          
          const { data: updatedBanner, error: updateError } = await supabase
            .from('banners')
            .update({
              file_url: publicUrl,
              file_type: bannerMetadata.file_type,
              file_name: file.name,
              file_size: file.size,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingBanner.id)
            .select()
            .single();

          if (updateError) {
            console.error('BannerUploadService: Update error:', updateError);
            toast.error(`Database update error: ${updateError.message}`);
            return null;
          }

          return {
            ...updatedBanner,
            file_type: updatedBanner.file_type as 'image' | 'video'
          };
        } else {
          console.log('BannerUploadService: Creating new dashboard banner');
          
          const { data: newBanner, error: insertError } = await supabase
            .from('banners')
            .insert(bannerMetadata)
            .select()
            .single();

          if (insertError) {
            console.error('BannerUploadService: Insert error:', insertError);
            toast.error(`Database insert error: ${insertError.message}`);
            return null;
          }

          return {
            ...newBanner,
            file_type: newBanner.file_type as 'image' | 'video'
          };
        }
      } else {
        // For project banners, use upsert with proper conflict resolution
        console.log('BannerUploadService: Upserting project banner');
        
        const { data: bannerData, error: dbError } = await supabase
          .from('banners')
          .upsert(bannerMetadata, {
            onConflict: 'user_id,banner_type,project_id'
          })
          .select()
          .single();

        if (dbError) {
          console.error('BannerUploadService: Project banner upsert error:', dbError);
          toast.error(`Database error: ${dbError.message}`);
          return null;
        }

        return {
          ...bannerData,
          file_type: bannerData.file_type as 'image' | 'video'
        };
      }
    } catch (error) {
      console.error('BannerUploadService: Database operation exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      toast.error(`Database error: ${errorMessage}`);
      return null;
    }
  }
}
