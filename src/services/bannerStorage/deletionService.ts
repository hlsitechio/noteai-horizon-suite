// Banner storage deletion service - DISABLED
// The banners table doesn't exist in the current database schema

export class BannerDeletionService {
  static async deleteBanner(
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ): Promise<boolean> {
    console.warn('Banner deletion disabled - banners table missing from database schema');
    return false;
  }
}

// Legacy exports for compatibility
export const deleteBanner = async (bannerId: string): Promise<boolean> => {
  console.warn('Banner deletion disabled - banners table missing from database schema');
  return false;
};

export const deleteMultipleBanners = async (bannerIds: string[]): Promise<{ success: string[], failed: string[] }> => {
  console.warn('Banner deletion disabled - banners table missing from database schema');
  return { success: [], failed: bannerIds };
};

export const deleteAllUserBanners = async (userId: string): Promise<boolean> => {
  console.warn('Banner deletion disabled - banners table missing from database schema');
  return false;
};

export const softDeleteBanner = async (bannerId: string): Promise<boolean> => {
  console.warn('Banner deletion disabled - banners table missing from database schema');
  return false;
};

export const restoreBanner = async (bannerId: string): Promise<boolean> => {
  console.warn('Banner deletion disabled - banners table missing from database schema');
  return false;
};

export const permanentlyDeleteBanner = async (bannerId: string): Promise<boolean> => {
  console.warn('Banner deletion disabled - banners table missing from database schema');
  return false;
};