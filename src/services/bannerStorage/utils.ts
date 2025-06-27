
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

export const checkBucketExists = async (): Promise<boolean> => {
  try {
    console.log('BannerUtils: Checking if banners bucket exists');
    
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('BannerUtils: Error listing buckets:', error);
      return false;
    }
    
    console.log('BannerUtils: Available buckets:', buckets?.map(b => b.name));
    const bucketExists = buckets?.some(bucket => bucket.name === 'banners') || false;
    console.log('BannerUtils: Banners bucket exists:', bucketExists);
    
    return bucketExists;
  } catch (error) {
    console.error('BannerUtils: Exception checking bucket existence:', error);
    return false;
  }
};

export const getPublicUrl = (fileName: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from('banners')
    .getPublicUrl(fileName);
  
  console.log('BannerUtils: Generated public URL:', publicUrl);
  return publicUrl;
};
