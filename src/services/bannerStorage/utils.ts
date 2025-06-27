
import { supabase } from '@/integrations/supabase/client';

export const generateFileName = (userId: string, bannerType: string, projectId?: string, fileExtension?: string): string => {
  const timestamp = Date.now();
  const projectSuffix = projectId ? `_${projectId}` : '';
  return `${userId}/${bannerType}${projectSuffix}_${timestamp}.${fileExtension}`;
};

export const extractFilePathFromUrl = (url: string): string => {
  const urlObj = new URL(url);
  return urlObj.pathname.split('/').slice(-1)[0];
};

export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop() || '';
};

export const getPublicUrl = (fileName: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from('banners')
    .getPublicUrl(fileName);
  
  console.log('BannerUtils: Generated public URL:', publicUrl);
  return publicUrl;
};

// Simple verification that the bucket exists (for logging purposes)
export const verifyBannersStorageExists = async (): Promise<boolean> => {
  try {
    console.log('BannerUtils: Verifying banners storage...');
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('BannerUtils: Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'banners') || false;
    console.log('BannerUtils: Banners bucket exists:', bucketExists);
    
    return bucketExists;
  } catch (error) {
    console.error('BannerUtils: Exception verifying storage:', error);
    return false;
  }
};
