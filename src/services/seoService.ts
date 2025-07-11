import { supabase } from '@/integrations/supabase/client';

export interface SEOPageSettings {
  id?: string;
  user_id: string;
  page_path: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  is_active?: boolean;
}

export interface SEOKeywordData {
  id?: string;
  user_id: string;
  keyword: string;
  target_url: string;
  current_position?: number | null;
  previous_position?: number | null;
  search_volume?: string | null;
  difficulty?: string | null;
  traffic?: string | null;
  last_checked?: string;
}

export interface SEOAnalyticsData {
  id?: string;
  user_id: string;
  page_path: string;
  metric_type: string;
  metric_value: number;
  recorded_date?: string;
}

export class SEOService {
  /**
   * Get SEO settings for a specific page
   */
  static async getPageSEOSettings(userId: string, pagePath: string): Promise<SEOPageSettings | null> {
    const { data, error } = await supabase
      .from('seo_page_settings')
      .select('*')
      .eq('user_id', userId)
      .eq('page_path', pagePath)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching SEO settings:', error);
      return null;
    }

    return data;
  }

  /**
   * Create or update SEO settings for a page
   */
  static async upsertPageSEOSettings(settings: SEOPageSettings): Promise<SEOPageSettings | null> {
    const { data, error } = await supabase
      .from('seo_page_settings')
      .upsert(settings, {
        onConflict: 'user_id, page_path'
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting SEO settings:', error);
      throw error;
    }

    return data;
  }

  /**
   * Get all SEO keywords for a user
   */
  static async getKeywords(userId: string): Promise<SEOKeywordData[]> {
    const { data, error } = await supabase
      .from('seo_keywords')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching keywords:', error);
      throw error;
    }

    return (data || []) as SEOKeywordData[];
  }

  /**
   * Add a new keyword to track
   */
  static async addKeyword(keyword: SEOKeywordData): Promise<SEOKeywordData> {
    const { data, error } = await supabase
      .from('seo_keywords')
      .insert(keyword)
      .select()
      .single();

    if (error) {
      console.error('Error adding keyword:', error);
      throw error;
    }

    return data as SEOKeywordData;
  }

  /**
   * Update keyword ranking data
   */
  static async updateKeywordRanking(
    keywordId: string, 
    currentPosition: number, 
    searchVolume?: string, 
    traffic?: string
  ): Promise<void> {
    // First get the current position to set as previous
    const { data: current } = await supabase
      .from('seo_keywords')
      .select('current_position')
      .eq('id', keywordId)
      .single();

    const { error } = await supabase
      .from('seo_keywords')
      .update({
        previous_position: current?.current_position || null,
        current_position: currentPosition,
        search_volume: searchVolume,
        traffic: traffic,
        last_checked: new Date().toISOString()
      })
      .eq('id', keywordId);

    if (error) {
      console.error('Error updating keyword ranking:', error);
      throw error;
    }
  }

  /**
   * Delete a keyword
   */
  static async deleteKeyword(keywordId: string): Promise<void> {
    const { error } = await supabase
      .from('seo_keywords')
      .delete()
      .eq('id', keywordId);

    if (error) {
      console.error('Error deleting keyword:', error);
      throw error;
    }
  }

  /**
   * Record SEO analytics data
   */
  static async recordAnalytics(analytics: SEOAnalyticsData): Promise<void> {
    const { error } = await supabase
      .from('seo_analytics')
      .upsert(analytics, {
        onConflict: 'user_id, page_path, metric_type, recorded_date'
      });

    if (error) {
      console.error('Error recording analytics:', error);
      throw error;
    }
  }

  /**
   * Get analytics data for a page
   */
  static async getPageAnalytics(
    userId: string, 
    pagePath: string, 
    metricType?: string,
    days: number = 30
  ): Promise<SEOAnalyticsData[]> {
    let query = supabase
      .from('seo_analytics')
      .select('*')
      .eq('user_id', userId)
      .eq('page_path', pagePath)
      .gte('recorded_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('recorded_date', { ascending: false });

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }

    return (data || []) as SEOAnalyticsData[];
  }

  /**
   * Get default SEO settings for common pages
   */
  static getDefaultSEOSettings(pagePath: string): Partial<SEOPageSettings> {
    const defaults: Record<string, Partial<SEOPageSettings>> = {
      '/features': {
        meta_title: 'Advanced Note Taking App Features - OnlineNote AI',
        meta_description: 'Discover powerful features of our AI-powered note taking app. Smart organization, real-time sync, and intelligent suggestions for maximum productivity.',
        meta_keywords: ['note taking app', 'productivity features', 'smart notes', 'ai features'],
      },
      '/dashboard': {
        meta_title: 'Productivity Tools Dashboard - OnlineNote AI',
        meta_description: 'Access your comprehensive productivity tools dashboard. Track your notes, manage tasks, and boost efficiency with our AI-powered workspace.',
        meta_keywords: ['productivity tools', 'dashboard', 'task management', 'workspace'],
      },
      '/editor': {
        meta_title: 'Digital Notebook Editor - OnlineNote AI',
        meta_description: 'Experience our advanced digital notebook editor with AI-powered writing assistance, rich formatting, and seamless collaboration features.',
        meta_keywords: ['digital notebook', 'note editor', 'writing tools', 'collaboration'],
      },
      '/ai-features': {
        meta_title: 'AI Writing Assistant Features - OnlineNote AI',
        meta_description: 'Enhance your writing with our advanced AI writing assistant. Get intelligent suggestions, grammar corrections, and content optimization.',
        meta_keywords: ['AI writing assistant', 'ai features', 'writing enhancement', 'content optimization'],
      }
    };

    return defaults[pagePath] || {
      meta_title: 'OnlineNote AI - Smart Note-Taking with AI',
      meta_description: 'Transform your productivity with AI-powered note-taking. Organize, search, and collaborate smarter with intelligent suggestions.',
      meta_keywords: ['ai notes', 'smart note taking', 'productivity', 'note organization'],
    };
  }
}