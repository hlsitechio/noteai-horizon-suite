import { supabase } from '@/integrations/supabase/client';
import type { PageBannerSettings } from '@/hooks/usePageBannerSettings';

export class PageBannerService {
  static async getPageBannerSettings(pagePath: string): Promise<PageBannerSettings | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('page_banner_settings')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('page_path', pagePath)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        return null;
      }

      return {
        bannerUrl: data.banner_url,
        bannerType: data.banner_type,
        bannerHeight: data.banner_height || 100,
        bannerPositionX: data.banner_position_x || 0,
        bannerPositionY: data.banner_position_y || 0,
        bannerWidth: data.banner_width || 100,
        isEnabled: data.is_enabled !== false
      };
    } catch (error) {
      console.error('Failed to get page banner settings:', error);
      return null;
    }
  }

  static async updatePageBannerSettings(
    pagePath: string, 
    settings: PageBannerSettings
  ): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const updateData = {
        user_id: user.user.id,
        page_path: pagePath,
        banner_url: settings.bannerUrl,
        banner_type: settings.bannerType,
        banner_height: settings.bannerHeight,
        banner_position_x: settings.bannerPositionX,
        banner_position_y: settings.bannerPositionY,
        banner_width: settings.bannerWidth,
        is_enabled: settings.isEnabled !== false,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('page_banner_settings')
        .upsert(updateData, {
          onConflict: 'user_id,page_path'
        });

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to update page banner settings:', error);
      return false;
    }
  }

  static async deletePageBannerSettings(pagePath: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('page_banner_settings')
        .delete()
        .eq('user_id', user.user.id)
        .eq('page_path', pagePath);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete page banner settings:', error);
      return false;
    }
  }

  static async getAllUserPageBannerSettings(): Promise<Array<{ pagePath: string; settings: PageBannerSettings }>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('page_banner_settings')
        .select('*')
        .eq('user_id', user.user.id);

      if (error) {
        throw error;
      }

      return data.map(row => ({
        pagePath: row.page_path,
        settings: {
          bannerUrl: row.banner_url,
          bannerType: row.banner_type,
          bannerHeight: row.banner_height || 100,
          bannerPositionX: row.banner_position_x || 0,
          bannerPositionY: row.banner_position_y || 0,
          bannerWidth: row.banner_width || 100,
          isEnabled: row.is_enabled !== false
        }
      }));
    } catch (error) {
      console.error('Failed to get all user page banner settings:', error);
      return [];
    }
  }
}