
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BannerData, BannerMetadata, BannerUploadResult } from './types';
import { generateFileName, getFileExtension, verifyBannersStorageExists, getPublicUrl } from './utils';
import { logger } from '@/utils/logger';

export class BannerUploadService {
  static async uploadBanner(
    file: File,
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ): Promise<BannerData | null> {
    try {
      logger.debug('BANNER', 'Starting upload process', { fileName: file.name, fileSize: file.size, fileType: file.type });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        logger.error('BANNER', 'No authenticated user found');
        toast.error('Authentication required');
        return null;
      }

      logger.debug('BANNER', 'User authenticated', user.id);

      // Verify storage bucket exists (for logging - bucket is guaranteed to exist)
      const storageReady = await verifyBannersStorageExists();
      logger.debug('BANNER', 'Storage verification:', storageReady);

      const fileExt = getFileExtension(file.name);
      const fileName = generateFileName(user.id, bannerType, projectId, fileExt);
      
      logger.debug('BANNER', 'Generated file name:', fileName);

      // Upload file to storage
      const uploadResult = await this.uploadFileToStorage(fileName, file);
      if (!uploadResult.success) {
        logger.error('BANNER', 'File upload to storage failed');
        return null;
      }

      logger.debug('BANNER', 'File uploaded to storage successfully');

      // Get public URL
      const publicUrl = getPublicUrl(fileName);
      logger.debug('BANNER', 'Public URL generated:', publicUrl);

      // Save metadata to database
      const bannerData = await this.saveBannerMetadata(user.id, bannerType, projectId, publicUrl, file);
      if (!bannerData) {
        logger.error('BANNER', 'Failed to save banner metadata to database');
        return null;
      }

      logger.debug('BANNER', 'Banner saved successfully:', bannerData);
      toast.success('Banner uploaded successfully!');
      
      return bannerData;
    } catch (error) {
      logger.error('BANNER', 'Upload exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Upload failed: ${errorMessage}`);
      return null;
    }
  }

  private static async uploadFileToStorage(fileName: string, file: File): Promise<BannerUploadResult> {
    try {
      logger.debug('BANNER', 'Uploading file to storage bucket "banners"', { fileName, fileSize: file.size, fileType: file.type });
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        logger.error('BANNER', 'Storage upload error:', uploadError);
        toast.error(`Storage upload failed: ${uploadError.message}`);
        return { success: false, error: uploadError.message };
      }

      logger.debug('BANNER', 'Storage upload successful:', uploadData);
      return { success: true };
    } catch (error) {
      logger.error('BANNER', 'Storage upload exception:', error);
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

      logger.debug('BANNER', 'Attempting to save banner metadata:', bannerMetadata);

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
          logger.error('BANNER', 'Error checking existing banner:', selectError);
          toast.error(`Database query error: ${selectError.message}`);
          return null;
        }

        if (existingBanner) {
          logger.debug('BANNER', 'Updating existing dashboard banner:', existingBanner.id);
          
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
            logger.error('BANNER', 'Update error:', updateError);
            toast.error(`Database update error: ${updateError.message}`);
            return null;
          }

          return {
            ...updatedBanner,
            file_type: updatedBanner.file_type as 'image' | 'video'
          };
        } else {
          logger.debug('BANNER', 'Creating new dashboard banner');
          
          const { data: newBanner, error: insertError } = await supabase
            .from('banners')
            .insert(bannerMetadata)
            .select()
            .single();

          if (insertError) {
            logger.error('BANNER', 'Insert error:', insertError);
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
        logger.debug('BANNER', 'Upserting project banner');
        
        const { data: bannerData, error: dbError } = await supabase
          .from('banners')
          .upsert(bannerMetadata, {
            onConflict: 'user_id,banner_type,project_id'
          })
          .select()
          .single();

        if (dbError) {
          logger.error('BANNER', 'Project banner upsert error:', dbError);
          toast.error(`Database error: ${dbError.message}`);
          return null;
        }

        return {
          ...bannerData,
          file_type: bannerData.file_type as 'image' | 'video'
        };
      }
    } catch (error) {
      logger.error('BANNER', 'Database operation exception:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      toast.error(`Database error: ${errorMessage}`);
      return null;
    }
  }
}
