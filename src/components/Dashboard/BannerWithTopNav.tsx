import React, { useState, useEffect } from 'react';
import { TopNavigationBar } from './TopNavigationBar';
import ResizableBannerSetup from './ResizableBanner/ResizableBannerSetup';
import { WeatherSettings } from '@/components/Settings/WeatherSettings';

interface BannerWithTopNavProps {
  onImageUpload?: (file: File) => void;
  onAIGenerate?: (prompt: string) => void;
  onVideoUpload?: (file: File) => void;
  onImageSelect?: (imageUrl: string) => void;
  selectedImageUrl?: string | null;
  isEditMode?: boolean;
}

export const BannerWithTopNav: React.FC<BannerWithTopNavProps> = ({
  onImageUpload,
  onAIGenerate,
  onVideoUpload,
  onImageSelect,
  selectedImageUrl,
  isEditMode = false
}) => {
  const [weatherCity, setWeatherCity] = useState('New York');

  // Load weather settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('weather-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.city) {
          setWeatherCity(settings.city);
        }
      } catch (error) {
        console.error('Failed to load weather settings:', error);
      }
    }
  }, []);

  // Listen for weather settings changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'weather-settings' && e.newValue) {
        try {
          const settings = JSON.parse(e.newValue);
          if (settings.city) {
            setWeatherCity(settings.city);
          }
        } catch (error) {
          console.error('Failed to parse weather settings:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleWeatherError = (error: string) => {
    console.error('Weather error:', error);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex-shrink-0">
        <TopNavigationBar 
          weatherCity={weatherCity}
          onWeatherError={handleWeatherError}
        />
      </div>
      
      {/* Banner Content */}
      <div className="flex-1">
        <ResizableBannerSetup
          onImageUpload={onImageUpload}
          onAIGenerate={onAIGenerate}
          onVideoUpload={onVideoUpload}
          onImageSelect={onImageSelect}
          selectedImageUrl={selectedImageUrl}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
};