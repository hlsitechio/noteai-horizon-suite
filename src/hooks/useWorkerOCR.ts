/**
 * Worker-enhanced OCR Hook
 * Uses worker threads for CPU-intensive OCR processing
 */

import { useState } from 'react';
import { useToast } from './useToast';
import { workerPool } from '@/workers/worker-pool';

interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export const useWorkerOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const processImage = async (
    imageSource: Blob | File,
    options?: {
      language?: string;
      preprocess?: boolean;
    }
  ): Promise<OCRResult> => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      console.log('[Worker OCR] Starting image processing');
      
      // Show loading notification
      toast.info('Processing image with OCR...', 'Please wait while we extract text');
      
      // Process image in worker thread
      const workerResult = await workerPool.runOCRTask({
        type: 'process-image',
        payload: {
          imageData: imageSource,
          options: {
            language: options?.language || 'eng',
            whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,!?-:;()[]{}"\'/\\@#$%^&*+=<>|`~_',
          }
        }
      }, (progress) => {
        setProgress(progress);
      });

      if (!workerResult.success) {
        throw new Error(workerResult.error || 'OCR processing failed');
      }

      const { text, confidence, processingTime } = workerResult.data;
      
      console.log(`[Worker OCR] Processing completed in ${processingTime}ms with ${confidence}% confidence`);
      
      if (text.trim()) {
        toast.success(`Text extracted successfully (${confidence.toFixed(1)}% confidence)`);
      } else {
        toast.warning('No text found in the image');
      }
      
      return { text, confidence, processingTime };

    } catch (error: any) {
      console.error('[Worker OCR] Error:', error);
      
      if (error.message?.includes('Worker')) {
        toast.error('OCR processing failed. Please try again.');
      } else if (error.message?.includes('network')) {
        toast.error('Network error during OCR processing');
      } else {
        toast.error(`OCR failed: ${error.message}`);
      }
      
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const processScreenCapture = async (imageBlob: Blob): Promise<OCRResult> => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      console.log('[Worker OCR] Starting screen capture processing');
      
      const workerResult = await workerPool.runOCRTask({
        type: 'process-screen-capture',
        payload: {
          imageData: imageBlob,
          options: {
            language: 'eng',
            psm: 6, // Uniform block of text
          }
        }
      }, (progress) => {
        setProgress(progress);
      });

      if (!workerResult.success) {
        throw new Error(workerResult.error || 'Screen capture OCR failed');
      }

      const { text, confidence, processingTime } = workerResult.data;
      
      console.log(`[Worker OCR] Screen capture processed in ${processingTime}ms`);
      
      return { text, confidence, processingTime };

    } catch (error: any) {
      console.error('[Worker OCR] Screen capture error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return {
    processImage,
    processScreenCapture,
    isProcessing,
    progress
  };
};