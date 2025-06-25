
export interface BannerUploadProps {
  currentBannerUrl?: string;
  onBannerUpdate?: (bannerUrl: string, type: 'image' | 'video') => void;
  onBannerDelete?: () => void;
}

export interface BannerState {
  isOpen: boolean;
  selectedBanner: string | null;
  selectedFile: File | null;
  bannerType: 'image' | 'video';
  isUploading: boolean;
  isDeleting: boolean;
  uploadError: string | null;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  type?: 'image' | 'video';
}
