
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccentColor } from './AccentColorContext';
import { extractDominantColor, ExtractedColor } from '../utils/colorExtraction';

interface DynamicAccentContextType {
  isDynamicAccentEnabled: boolean;
  setDynamicAccentEnabled: (enabled: boolean) => void;
  extractColorFromMedia: (file: File | string) => Promise<void>;
  isExtracting: boolean;
  lastExtractedColor: ExtractedColor | null;
}

const DynamicAccentContext = createContext<DynamicAccentContextType | undefined>(undefined);

interface DynamicAccentProviderProps {
  children: React.ReactNode;
}

export const DynamicAccentProvider: React.FC<DynamicAccentProviderProps> = ({ children }) => {
  const { setAccentColor } = useAccentColor();
  const [isDynamicAccentEnabled, setIsDynamicAccentEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('dynamic-accent-enabled');
    return saved ? JSON.parse(saved) : false;
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const [lastExtractedColor, setLastExtractedColor] = useState<ExtractedColor | null>(null);

  useEffect(() => {
    localStorage.setItem('dynamic-accent-enabled', JSON.stringify(isDynamicAccentEnabled));
  }, [isDynamicAccentEnabled]);

  const setDynamicAccentEnabled = (enabled: boolean) => {
    setIsDynamicAccentEnabled(enabled);
    console.log('Dynamic accent color', enabled ? 'enabled' : 'disabled');
  };

  const extractColorFromMedia = async (file: File | string) => {
    if (!isDynamicAccentEnabled) {
      console.log('Dynamic accent color is disabled, skipping extraction');
      return;
    }

    setIsExtracting(true);
    console.log('Extracting dominant color from media...');

    try {
      const extractedColor = await extractDominantColor(file);
      console.log('Extracted color:', extractedColor);
      
      setLastExtractedColor(extractedColor);
      setAccentColor(extractedColor.hex, extractedColor.hsl);
      
      console.log('Accent color updated to extracted color:', extractedColor.hex);
    } catch (error) {
      console.error('Failed to extract color from media:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <DynamicAccentContext.Provider value={{
      isDynamicAccentEnabled,
      setDynamicAccentEnabled,
      extractColorFromMedia,
      isExtracting,
      lastExtractedColor
    }}>
      {children}
    </DynamicAccentContext.Provider>
  );
};

export const useDynamicAccent = () => {
  const context = useContext(DynamicAccentContext);
  if (context === undefined) {
    throw new Error('useDynamicAccent must be used within a DynamicAccentProvider');
  }
  return context;
};
