import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface BannerDisplaySettings {
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  showControls: boolean;
  aspectRatio: string;
  quality: string;
  parallaxEffect: boolean;
  blurBackground: boolean;
  opacity: number;
  borderRadius: number;
}

export interface PageBannerSettings {
  id?: string;
  user_id?: string;
  page_path: string;
  banner_url?: string | null;
  banner_type?: string | null;
  banner_height?: number | null;
  banner_position_x?: number | null;
  banner_position_y?: number | null;
  banner_width?: number | null;
  is_enabled?: boolean | null;
  banner_settings?: BannerDisplaySettings;
  panel_sizes?: Json;
  created_at?: string;
  updated_at?: string;
}

export class PageBannerService {
  static async getPageSettings(userId: string, pagePath: string): Promise<PageBannerSettings | null> {
    try {
      const { data, error } = await supabase
        .from('page_banner_settings')
        .select('*')
        .eq('user_id', userId)
        .eq('page_path', pagePath)
        .maybeSingle();

      if (error) {
        console.error('Error fetching page banner settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPageSettings:', error);
      return null;
    }
  }

  static async updatePageSettings(
    userId: string, 
    pagePath: string, 
    settings: Partial<PageBannerSettings>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('page_banner_settings')
        .upsert({
          user_id: userId,
          page_path: pagePath,
          ...settings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,page_path'
        });

      if (error) {
        console.error('Error updating page banner settings:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updatePageSettings:', error);
      return false;
    }
  }

  static async updateBannerDisplaySettings(
    userId: string,
    pagePath: string,
    displaySettings: BannerDisplaySettings
  ): Promise<boolean> {
    try {
      // First check if settings exist
      const existing = await this.getPageSettings(userId, pagePath);
      
      const settingsData = {
        user_id: userId,
        page_path: pagePath,
        banner_settings: displaySettings,
        updated_at: new Date().toISOString()
      };

      if (existing) {
        const { error } = await supabase
          .from('page_banner_settings')
          .update(settingsData)
          .eq('user_id', userId)
          .eq('page_path', pagePath);

        if (error) {
          console.error('Error updating banner display settings:', error);
          return false;
        }
      } else {
        const { error } = await supabase
          .from('page_banner_settings')
          .insert({
            ...settingsData,
            is_enabled: true
          });

        if (error) {
          console.error('Error creating banner display settings:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error in updateBannerDisplaySettings:', error);
      return false;
    }
  }

  static async deletePageSettings(userId: string, pagePath: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('page_banner_settings')
        .delete()
        .eq('user_id', userId)
        .eq('page_path', pagePath);

      if (error) {
        console.error('Error deleting page banner settings:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deletePageSettings:', error);
      return false;
    }
  }

  static getDefaultDisplaySettings(): BannerDisplaySettings {
    return {
      autoplay: true,
      loop: true,
      muted: true,
      showControls: false,
      aspectRatio: 'auto',
      quality: 'high',
      parallaxEffect: false,
      blurBackground: false,
      opacity: 100,
      borderRadius: 8
    };
  }
}