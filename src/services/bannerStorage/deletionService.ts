
import { supabase } from '@/integrations/supabase/client';
import { BannerRetrievalService } from './retrievalService';
import { extractFilePathFromUrl } from './utils';

export class BannerDeletionService {
  static async deleteBanner(
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // First get the banner to find the file path
      const banner = await BannerRetrievalService.getBanner(bannerType, projectId);
      if (!banner) return true; // Already deleted

      // Extract file path from URL for storage deletion
      const filePath = extractFilePathFromUrl(banner.file_url);
      const fileName = `${user.id}/${filePath}`;

      console.log('BannerDeletionService: Deleting banner:', fileName);

      // Delete from storage (non-blocking - if this fails, we still want to clean up the database)
      const storageResult = await this.deleteFromStorage(fileName);
      if (!storageResult) {
        console.warn('BannerDeletionService: Storage deletion failed, but continuing with database cleanup');
      }

      // Delete from database
      const dbResult = await this.deleteFromDatabase(user.id, bannerType, projectId);
      if (!dbResult) {
        console.error('BannerDeletionService: Failed to delete from database');
        return false;
      }

      console.log('BannerDeletionService: Banner deleted successfully');
      return true;
    } catch (error) {
      console.error('BannerDeletionService: Delete banner exception:', error);
      return false;
    }
  }

  private static async deleteFromStorage(fileName: string): Promise<boolean> {
    try {
      const { error: storageError } = await supabase.storage
        .from('banners')
        .remove([fileName]);

      if (storageError) {
        console.error('BannerDeletionService: Storage delete error:', storageError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('BannerDeletionService: Storage delete exception:', error);
      return false;
    }
  }

  private static async deleteFromDatabase(
    userId: string,
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ): Promise<boolean> {
    try {
      let query = supabase
        .from('banners')
        .delete()
        .eq('user_id', userId)
        .eq('banner_type', bannerType);

      if (bannerType === 'project' && projectId) {
        query = query.eq('project_id', projectId);
      } else if (bannerType === 'dashboard') {
        query = query.is('project_id', null);
      }

      const { error: dbError } = await query;

      if (dbError) {
        console.error('BannerDeletionService: Database delete error:', dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('BannerDeletionService: Database delete exception:', error);
      return false;
    }
  }
}
