/**
 * OCR Hook (Simplified Browser-Compatible Version)
 * Uses Tesseract.js directly for OCR processing
 */

import { useState } from 'react';
import { useToast } from './useToast';
import Tesseract from 'tesseract.js';

interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export const useWorkerOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const processImage = async (imageFile: File, progressCallback?: (progress: number) => void): Promise<OCRResult> => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const startTime = Date.now();
      
      // Use Tesseract.js directly (browser-compatible)
      const result = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            setProgress(progress);
            progressCallback?.(progress);
          }
        }
      });
      
      const processingTime = Date.now() - startTime;
      
      setProgress(100);
      setIsProcessing(false);
      
      return {
        text: result.data.text || '',
        confidence: result.data.confidence || 0,
        processingTime
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      setIsProcessing(false);
      setProgress(0);
      toast.error('Failed to process image');
      throw error;
    }
  };

  const processScreenCapture = async (canvas: HTMLCanvasElement): Promise<OCRResult> => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const startTime = Date.now();
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert canvas to blob'));
        }, 'image/png');
      });
      
      // Use Tesseract.js directly
      const result = await Tesseract.recognize(blob, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const progress = Math.round(m.progress * 100);
            setProgress(progress);
          }
        }
      });
      
      const processingTime = Date.now() - startTime;
      
      setProgress(100);
      setIsProcessing(false);
      
      return {
        text: result.data.text || '',
        confidence: result.data.confidence || 0,
        processingTime
      };
    } catch (error) {
      console.error('Screen capture OCR failed:', error);
      setIsProcessing(false);
      setProgress(0);
      toast.error('Failed to process screen capture');
      throw error;
    }
  };

  return {
    processImage,
    processScreenCapture,
    isProcessing,
    progress
  };
};