
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BannerData {
  id: string;
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export class BannerStorageService {
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

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${bannerType}${projectId ? `_${projectId}` : ''}.${fileExt}`;
      
      console.log('BannerStorageService: Uploading file:', fileName, file.type, file.size);

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('BannerStorageService: Upload error:', uploadError);
        toast.error('Failed to upload banner');
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      console.log('BannerStorageService: Upload successful, public URL:', publicUrl);

      // Save metadata to database
      const bannerMetadata = {
        user_id: user.id,
        banner_type: bannerType,
        project_id: projectId || null,
        file_url: publicUrl,
        file_type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
        file_name: file.name,
        file_size: file.size
      };

      const { data: bannerData, error: dbError } = await supabase
        .from('banners')
        .upsert(bannerMetadata, {
          onConflict: 'user_id,banner_type,project_id'
        })
        .select()
        .single();

      if (dbError) {
        console.error('BannerStorageService: Database error:', dbError);
        toast.error('Failed to save banner metadata');
        return null;
      }

      console.log('BannerStorageService: Banner saved successfully:', bannerData);
      return bannerData;
    } catch (error) {
      console.error('BannerStorageService: Upload exception:', error);
      toast.error('Failed to upload banner');
      return null;
    }
  }

  static async getBanner(
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ): Promise<BannerData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      let query = supabase
        .from('banners')
        .select('*')
        .eq('user_id', user.id)
        .eq('banner_type', bannerType);

      if (bannerType === 'project' && projectId) {
        query = query.eq('project_id', projectId);
      } else if (bannerType === 'dashboard') {
        query = query.is('project_id', null);
      }

      const { data, error } = await query.single();

      if (error && error.code !== 'PGRST116') {
        console.error('BannerStorageService: Get banner error:', error);
        return null;
      }

      console.log('BannerStorageService: Retrieved banner:', data);
      return data;
    } catch (error) {
      console.error('BannerStorageService: Get banner exception:', error);
      return null;
    }
  }

  static async deleteBanner(
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // First get the banner to find the file path
      const banner = await this.getBanner(bannerType, projectId);
      if (!banner) return true; // Already deleted

      // Extract file path from URL
      const url = new URL(banner.file_url);
      const filePath = url.pathname.split('/').slice(-1)[0];
      const fileName = `${user.id}/${filePath}`;

      console.log('BannerStorageService: Deleting banner:', fileName);

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('banners')
        .remove([fileName]);

      if (storageError) {
        console.error('BannerStorageService: Storage delete error:', storageError);
      }

      // Delete from database
      let query = supabase
        .from('banners')
        .delete()
        .eq('user_id', user.id)
        .eq('banner_type', bannerType);

      if (bannerType === 'project' && projectId) {
        query = query.eq('project_id', projectId);
      } else if (bannerType === 'dashboard') {
        query = query.is('project_id', null);
      }

      const { error: dbError } = await query;

      if (dbError) {
        console.error('BannerStorageService: Database delete error:', dbError);
        return false;
      }

      console.log('BannerStorageService: Banner deleted successfully');
      return true;
    } catch (error) {
      console.error('BannerStorageService: Delete banner exception:', error);
      return false;
    }
  }
}
