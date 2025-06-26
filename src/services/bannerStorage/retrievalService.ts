
import { supabase } from '@/integrations/supabase/client';
import { BannerData } from './types';

export class BannerRetrievalService {
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

      // Use maybeSingle() instead of single() to avoid 406 errors when no rows exist
      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('BannerRetrievalService: Get banner error:', error);
        return null;
      }

      console.log('BannerRetrievalService: Retrieved banner:', data);
      
      return data ? {
        ...data,
        file_type: data.file_type as 'image' | 'video'
      } : null;
    } catch (error) {
      console.error('BannerRetrievalService: Get banner exception:', error);
      return null;
    }
  }
}
