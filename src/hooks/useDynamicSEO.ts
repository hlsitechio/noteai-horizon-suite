import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SEOService, SEOPageSettings } from '@/services/seoService';

export interface DynamicSEOData {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export const useDynamicSEO = (pagePath: string): DynamicSEOData => {
  const { user } = useAuth();
  const [seoData, setSeoData] = useState<DynamicSEOData>(() => {
    // Get default values immediately
    const defaults = SEOService.getDefaultSEOSettings(pagePath);
    return {
      title: defaults.meta_title || 'OnlineNote AI',
      description: defaults.meta_description || 'Smart note-taking with AI',
      keywords: defaults.meta_keywords || ['ai notes', 'productivity'],
      ogTitle: defaults.og_title,
      ogDescription: defaults.og_description,
      ogImage: defaults.og_image,
      canonicalUrl: defaults.canonical_url,
    };
  });

  useEffect(() => {
    const fetchSEOSettings = async () => {
      if (!user) return;

      try {
        const settings = await SEOService.getPageSEOSettings(user.id, pagePath);
        
        if (settings) {
          setSeoData({
            title: settings.meta_title || seoData.title,
            description: settings.meta_description || seoData.description,
            keywords: settings.meta_keywords || seoData.keywords,
            ogTitle: settings.og_title || settings.meta_title,
            ogDescription: settings.og_description || settings.meta_description,
            ogImage: settings.og_image,
            canonicalUrl: settings.canonical_url,
          });
        }
      } catch (error) {
        console.error('Error fetching dynamic SEO settings:', error);
        // Keep default values on error
      }
    };

    fetchSEOSettings();
  }, [user, pagePath]);

  return seoData;
};

export const useUpdateSEO = () => {
  const { user } = useAuth();

  const updatePageSEO = async (pagePath: string, settings: Partial<SEOPageSettings>) => {
    if (!user) throw new Error('User not authenticated');

    const fullSettings: SEOPageSettings = {
      user_id: user.id,
      page_path: pagePath,
      is_active: true,
      ...settings,
    };

    return await SEOService.upsertPageSEOSettings(fullSettings);
  };

  return { updatePageSEO };
};
