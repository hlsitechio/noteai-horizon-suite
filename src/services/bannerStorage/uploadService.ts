// Banner storage upload service - DISABLED
// The banners table doesn't exist in the current database schema

import { BannerData } from './types';

export class BannerUploadService {
  static async uploadBanner(
    file: File,
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ): Promise<BannerData | null> {
    console.warn('Banner upload disabled - banners table missing from database schema');
    return null;
  }
}

// Legacy exports for compatibility
export const uploadBanner = async (
  file: File,
  userId: string,
  options?: any
): Promise<BannerData | null> => {
  console.warn('Banner upload disabled - banners table missing from database schema');
  return null;
};

export const uploadBannerFromUrl = async (
  imageUrl: string,
  userId: string,
  options?: any
): Promise<BannerData | null> => {
  console.warn('Banner upload disabled - banners table missing from database schema');
  return null;
};

export const uploadBannerFromBase64 = async (
  base64Data: string,
  fileName: string,
  userId: string,
  options?: any
): Promise<BannerData | null> => {
  console.warn('Banner upload disabled - banners table missing from database schema');
  return null;
};

export const updateBannerMetadata = async (
  bannerId: string,
  updates: any
): Promise<BannerData | null> => {
  console.warn('Banner update disabled - banners table missing from database schema');
  return null;
};

export const moveBannerToFolder = async (
  bannerId: string,
  folderId: string | null
): Promise<boolean> => {
  console.warn('Banner move disabled - banners table missing from database schema');
  return false;
};

export const copyBanner = async (
  bannerId: string,
  newTitle?: string
): Promise<BannerData | null> => {
  console.warn('Banner copy disabled - banners table missing from database schema');
  return null;
};