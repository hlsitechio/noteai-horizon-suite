
import { FileValidationResult } from './types';
import { logger } from '../../../utils/logger';

export const validateFile = (file: File): FileValidationResult => {
  logger.debug('BANNER', 'File validation - name:', file.name, 'type:', file.type, 'size:', file.size);

  // Check if it's an image or video
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  logger.debug('BANNER', 'File type check - isImage:', isImage, 'isVideo:', isVideo);

  if (!isImage && !isVideo) {
    logger.debug('BANNER', 'Invalid file type');
    return {
      isValid: false,
      error: 'Please select an image or video file'
    };
  }

  // Check file size (max 50MB for videos, 10MB for images)
  const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    logger.debug('BANNER', 'File too large:', file.size, 'max:', maxSize);
    const maxSizeText = isVideo ? '50MB' : '10MB';
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeText}`
    };
  }

  // For videos, check if it's MP4
  if (isVideo && !file.type.includes('mp4') && !file.name.toLowerCase().endsWith('.mp4')) {
    logger.debug('BANNER', 'Not MP4 format:', file.type);
    return {
      isValid: false,
      error: 'Only MP4 videos are supported'
    };
  }

  return {
    isValid: true,
    type: isVideo ? 'video' : 'image'
  };
};
