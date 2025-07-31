import { usePlaceholderHook } from './usePlaceholderHook';

export const useWorkerOCR = () => ({
  ...usePlaceholderHook('OCR'),
  processImage: () => {
    console.log('OCR feature temporarily disabled');
    return null;
  }
});

export const useWorkerAIIntegration = () => usePlaceholderHook('AI Integration');