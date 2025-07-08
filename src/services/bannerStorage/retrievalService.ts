// Banner storage retrieval service - DISABLED
// The banners table doesn't exist in the current database schema

import { BannerData } from './types';

export class BannerRetrievalService {
  static async getBanner(
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ): Promise<BannerData | null> {
    console.warn('Banner retrieval disabled - banners table missing from database schema');
    return null;
  }
}

// Legacy exports for compatibility
export const getBannerById = async (bannerId: string): Promise<BannerData | null> => {
  console.warn('Banner retrieval disabled - banners table missing from database schema');
  return null;
};

export const getUserBanners = async (userId: string, limit?: number): Promise<BannerData[]> => {
  console.warn('Banner retrieval disabled - banners table missing from database schema');
  return [];
};

export const getBannersByType = async (userId: string, fileType: 'image' | 'video'): Promise<BannerData[]> => {
  console.warn('Banner retrieval disabled - banners table missing from database schema');
  return [];
};

export const searchBanners = async (userId: string, searchTerm: string): Promise<BannerData[]> => {
  console.warn('Banner retrieval disabled - banners table missing from database schema');
  return [];
};

export const getRecentBanners = async (userId: string, days: number = 7): Promise<BannerData[]> => {
  console.warn('Banner retrieval disabled - banners table missing from database schema');
  return [];
};

export const getBannersByFolder = async (folderId: string): Promise<BannerData[]> => {
  console.warn('Banner retrieval disabled - banners table missing from database schema');
  return [];
};