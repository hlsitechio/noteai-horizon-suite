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
    // Dynamic SEO paused - using only default values
    return;
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
