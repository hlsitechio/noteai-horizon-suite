/**
 * OCR Processing Worker
 * Handles CPU-intensive OCR operations using Tesseract.js in a separate thread
 */

import { createWorker } from 'tesseract.js';

export interface OCRWorkerTask {
  type: 'process-image' | 'process-screen-capture';
  payload: {
    imageData: string | Blob | File;
    options?: {
      language?: string;
      whitelist?: string;
    };
  };
}

export interface OCRWorkerResult {
  success: boolean;
  data?: {
    text: string;
    confidence: number;
    processingTime: number;
  };
  error?: string;
  progress?: number;
}

// Progress callback type for OCR processing
export type OCRProgressCallback = (progress: number) => void;

// Main worker function for OCR processing
export default async function ocrWorker(
  task: OCRWorkerTask,
  progressCallback?: OCRProgressCallback
): Promise<OCRWorkerResult> {
  const startTime = Date.now();
  
  try {
    console.log(`[OCR Worker] Starting ${task.type} processing`);
    
    const { imageData, options = {} } = task.payload;
    const language = options.language || 'eng';
    const whitelist = options.whitelist || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,!?-:;()[]{}"\'/\\@#$%^&*+=<>|`~_';
    
    // Create Tesseract worker with progress tracking
    const worker = await createWorker(language, 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && progressCallback) {
          progressCallback(Math.round(m.progress * 100));
        }
      }
    });
    
    // Configure OCR parameters for better accuracy
    await worker.setParameters({
      tessedit_char_whitelist: whitelist,
    });
    
    // Process the image
    const { data } = await worker.recognize(imageData);
    
    // Clean up worker
    await worker.terminate();
    
    const processingTime = Date.now() - startTime;
    
    console.log(`[OCR Worker] Processing completed in ${processingTime}ms`);
    
    return {
      success: true,
      data: {
        text: data.text.trim(),
        confidence: data.confidence,
        processingTime
      }
    };
    
  } catch (error) {
    console.error('[OCR Worker] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'OCR processing failed'
    };
  }
}

// Utility function for preprocessing images before OCR
export async function preprocessImage(imageBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0);
      
      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Apply simple contrast enhancement
      for (let i = 0; i < data.length; i += 4) {
        // Convert to grayscale using luminance formula
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        
        // Apply threshold for better OCR results
        const threshold = gray > 128 ? 255 : 0;
        
        data[i] = threshold;     // Red
        data[i + 1] = threshold; // Green
        data[i + 2] = threshold; // Blue
        // Alpha channel (data[i + 3]) remains unchanged
      }
      
      // Put processed image data back to canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create processed image blob'));
        }
      }, 'image/png');
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for preprocessing'));
    };
    
    // Create object URL from blob and set as image source
    img.src = URL.createObjectURL(imageBlob);
  });
}
