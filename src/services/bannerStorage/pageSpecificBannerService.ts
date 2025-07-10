import { supabase } from '@/integrations/supabase/client';
import type { PageBannerSettings } from '@/hooks/usePageBannerSettings';

// Add a simple cache to prevent infinite loops
const settingsCache = new Map<string, { data: PageBannerSettings | null; timestamp: number }>();
const CACHE_DURATION = 5000; // 5 seconds

export class PageBannerService {
  static async getPageBannerSettings(pagePath: string): Promise<PageBannerSettings | null> {
    try {
      // Check cache first to prevent repeated calls
      const cacheKey = pagePath;
      const cached = settingsCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log(`[PageBannerService] Using cached settings for: ${pagePath}`);
        return cached.data;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[PageBannerService] User not authenticated, returning empty settings');
        return {};
      }

      console.log(`[PageBannerService] Loading settings for page: ${pagePath}`);

      // Try direct database access first for better reliability
      const { data, error } = await supabase
        .from('page_banner_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('page_path', pagePath)
        .single();

      let result: PageBannerSettings | null = null;

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('[PageBannerService] Database error:', error);
        result = null;
      } else if (data) {
        result = {
          bannerUrl: data.banner_url,
          bannerType: data.banner_type,
          bannerHeight: data.banner_height || 100,
          bannerPositionX: data.banner_position_x || 0,
          bannerPositionY: data.banner_position_y || 0,
          bannerWidth: data.banner_width || 100,
          isEnabled: data.is_enabled !== false
        };
      } else {
        result = {}; // No settings found, return empty object
      }

      // Cache the result
      settingsCache.set(cacheKey, { data: result, timestamp: Date.now() });

      console.log(`[PageBannerService] Loaded settings:`, result);
      return result;
    } catch (error) {
      console.error('[PageBannerService] Failed to get page banner settings:', error);
      return {};
    }
  }

  static async updatePageBannerSettings(
    pagePath: string, 
    settings: PageBannerSettings
  ): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      console.log(`[PageBannerService] Saving settings for page: ${pagePath}`, settings);

      // Use the banner-storage edge function for reliable saving
      const { data, error } = await supabase.functions.invoke('banner-storage', {
        body: { 
          pagePath,
          bannerData: settings,
          action: 'update'
        }
      });

      if (error) {
        console.error('[PageBannerService] Error saving settings:', error);
        return false;
      }

      // Clear cache after successful update
      settingsCache.delete(pagePath);

      console.log(`[PageBannerService] Settings saved successfully:`, data);
      return true;
    } catch (error) {
      console.error('[PageBannerService] Failed to update page banner settings:', error);
      return false;
    }
  }

  static async deletePageBannerSettings(pagePath: string): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      console.log(`[PageBannerService] Deleting settings for page: ${pagePath}`);

      // Use the banner-storage edge function for reliable deletion
      const { data, error } = await supabase.functions.invoke('banner-storage', {
        body: { pagePath, action: 'delete' }
      });

      if (error) {
        console.error('[PageBannerService] Error deleting settings:', error);
        return false;
      }

      console.log(`[PageBannerService] Settings deleted successfully`);
      return true;
    } catch (error) {
      console.error('[PageBannerService] Failed to delete page banner settings:', error);
      return false;
    }
  }

  static async getAllUserPageBannerSettings(): Promise<Array<{ pagePath: string; settings: PageBannerSettings }>> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('User not authenticated');
      }

      // Fall back to direct database access for this read-only operation
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
      console.error('[PageBannerService] Failed to get all user page banner settings:', error);
      return [];
    }
  }

  // Enhanced methods using the new edge functions
  static async uploadBannerFile(file: File, pagePath?: string): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      console.log(`[PageBannerService] Uploading banner file: ${file.name}`);

      // Convert file to base64
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Use the banner-upload edge function
      const { data, error } = await supabase.functions.invoke('banner-upload', {
        body: {
          fileData,
          fileName: file.name,
          fileType: file.type,
          pagePath
        }
      });

      if (error) {
        console.error('[PageBannerService] Upload error:', error);
        return null;
      }

      console.log(`[PageBannerService] File uploaded successfully: ${data.url}`);
      return data.url;
    } catch (error) {
      console.error('[PageBannerService] Failed to upload banner file:', error);
      return null;
    }
  }

  static async generateAIBanner(prompt: string, pagePath?: string): Promise<string | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('User not authenticated');
      }

      console.log(`[PageBannerService] Generating AI banner with prompt: ${prompt}`);

      // Use the enhanced generate-banner-image edge function
      const { data, error } = await supabase.functions.invoke('generate-banner-image', {
        body: {
          prompt,
          pagePath,
          saveToGallery: true
        }
      });

      if (error) {
        console.error('[PageBannerService] Generation error:', error);
        return null;
      }

      console.log(`[PageBannerService] AI banner generated successfully: ${data.image}`);
      return data.image;
    } catch (error) {
      console.error('[PageBannerService] Failed to generate AI banner:', error);
      return null;
    }
  }
}