import React, { useState, useEffect } from 'react';
import { TopNavigationBar } from './TopNavigationBar';
import ResizableBannerSetup from './ResizableBanner/ResizableBannerSetup';
import { WeatherSettings } from '@/components/Settings/WeatherSettings';
import { Button } from '@/components/ui/button';
import { Edit3, Settings } from 'lucide-react';
import DashboardSettings from './DashboardSettings';

interface BannerWithTopNavProps {
  onImageUpload?: (file: File) => void;
  onAIGenerate?: (prompt: string) => void;
  onVideoUpload?: (file: File) => void;
  onImageSelect?: (imageUrl: string) => void;
  selectedImageUrl?: string | null;
  isEditMode?: boolean;
  onEditLayoutClick?: () => void;
}

export const BannerWithTopNav: React.FC<BannerWithTopNavProps> = ({
  onImageUpload,
  onAIGenerate,
  onVideoUpload,
  onImageSelect,
  selectedImageUrl,
  isEditMode = false,
  onEditLayoutClick
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

    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      const savedSettings = localStorage.getItem('weather-settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.city) {
            setWeatherCity(settings.city);
          }
        } catch (error) {
          console.error('Failed to parse weather settings:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('weather-settings-changed', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('weather-settings-changed', handleCustomStorageChange);
    };
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
      <div className="flex-1 relative">
        {/* Control buttons positioned in banner area */}
        <div className="absolute top-2 right-2 z-40 flex items-center gap-2">
          <DashboardSettings>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 transition-all duration-200 hover:bg-accent bg-background/80 backdrop-blur-sm"
            >
              <Settings className="h-4 w-4" />
              Components
            </Button>
          </DashboardSettings>
          
          {onEditLayoutClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditLayoutClick}
              className="gap-2 transition-all duration-200 hover:bg-accent bg-background/80 backdrop-blur-sm"
            >
              <Edit3 className="h-4 w-4" />
              Edit Layout
            </Button>
          )}
        </div>
        
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