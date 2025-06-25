
import { BannerUploadService } from './uploadService';
import { BannerRetrievalService } from './retrievalService';
import { BannerDeletionService } from './deletionService';

export { BannerData, BannerMetadata, BannerUploadResult } from './types';

export class BannerStorageService {
  static async uploadBanner(
    file: File,
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ) {
    return BannerUploadService.uploadBanner(file, bannerType, projectId);
  }

  static async getBanner(
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ) {
    return BannerRetrievalService.getBanner(bannerType, projectId);
  }

  static async deleteBanner(
    bannerType: 'dashboard' | 'project',
    projectId?: string
  ) {
    return BannerDeletionService.deleteBanner(bannerType, projectId);
  }
}
