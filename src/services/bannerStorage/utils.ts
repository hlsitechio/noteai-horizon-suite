
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

export const createBannersStorageBucket = async (): Promise<boolean> => {
  try {
    console.log('BannerUtils: Creating banners storage bucket...');
    
    // Create the bucket
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('banners', {
      public: true,
      allowedMimeTypes: [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp',
        'video/mp4',
        'video/avi',
        'video/quicktime',
        'video/x-msvideo'
      ],
      fileSizeLimit: 52428800 // 50MB limit
    });

    if (bucketError) {
      // If bucket already exists, that's fine
      if (bucketError.message?.includes('already exists')) {
        console.log('BannerUtils: Banners bucket already exists');
        return true;
      }
      console.error('BannerUtils: Error creating bucket:', bucketError);
      return false;
    }

    console.log('BannerUtils: Bucket created successfully:', bucketData);

    // Set up storage policies for the new bucket
    await createStoragePolicies();
    
    return true;
  } catch (error) {
    console.error('BannerUtils: Exception creating bucket:', error);
    return false;
  }
};

const createStoragePolicies = async (): Promise<void> => {
  try {
    console.log('BannerUtils: Setting up storage policies...');
    
    // Note: Storage policies are usually set up via SQL migrations
    // This is a fallback attempt, but the main policies should be in migrations
    
    // The policies should already exist from migrations, but we'll log this attempt
    console.log('BannerUtils: Storage policies should be handled by database migrations');
    
  } catch (error) {
    console.error('BannerUtils: Error setting up storage policies:', error);
  }
};

export const ensureBannersStorageExists = async (): Promise<boolean> => {
  try {
    console.log('BannerUtils: Ensuring banners storage exists...');
    
    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('BannerUtils: Error listing buckets:', listError);
      // Try to create bucket anyway
      return await createBannersStorageBucket();
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'banners') || false;
    console.log('BannerUtils: Banners bucket exists:', bucketExists);
    
    if (!bucketExists) {
      console.log('BannerUtils: Bucket does not exist, creating it...');
      return await createBannersStorageBucket();
    }
    
    return true;
  } catch (error) {
    console.error('BannerUtils: Exception ensuring storage exists:', error);
    // Try to create bucket as fallback
    return await createBannersStorageBucket();
  }
};

export const checkBucketExists = async (): Promise<boolean> => {
  // This function now ensures the bucket exists rather than just checking
  return await ensureBannersStorageExists();
};

export const getPublicUrl = (fileName: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from('banners')
    .getPublicUrl(fileName);
  
  console.log('BannerUtils: Generated public URL:', publicUrl);
  return publicUrl;
};
