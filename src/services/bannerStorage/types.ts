
export interface BannerData {
  id: string;
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface BannerMetadata {
  user_id: string;
  banner_type: 'dashboard' | 'project';
  project_id?: string | null;
  file_url: string;
  file_type: 'image' | 'video';
  file_name: string;
  file_size: number;
}

export interface BannerUploadResult {
  success: boolean;
  data?: BannerData;
  error?: string;
}
