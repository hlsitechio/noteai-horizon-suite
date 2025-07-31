import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavigationBar } from './TopNavigationBar';
import ResizableBannerSetup from './ResizableBanner/ResizableBannerSetup';
import { WeatherSettings } from '@/components/Settings/WeatherSettings';
import { Button } from '@/components/ui/button';
import { Edit3, Settings } from 'lucide-react';
import DashboardSettings from './DashboardSettings';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Load weather settings from localStorage
  useEffect(() => {
    // Development logging only
    if (import.meta.env.DEV) {
      // Loading weather settings
    }
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
    // Development logging only
    if (import.meta.env.DEV) {
      // Setting up storage listeners
    }
    const handleStorageChange = (e: StorageEvent) => {
      // Development logging only
      if (import.meta.env.DEV) {
        // Storage change detected
      }
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
      // Development logging only
      if (import.meta.env.DEV) {
        // Custom storage change detected
      }
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
      // Development logging only
      if (import.meta.env.DEV) {
        // Removing storage listeners
      }
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('weather-settings-changed', handleCustomStorageChange);
    };
  }, []);

  const handleWeatherError = (error: string) => {
    console.error('Weather error:', error);
  };

  // Memoize TopNavigationBar props to prevent unnecessary re-renders during banner resize
  const topNavProps = useMemo(() => ({
    weatherCity,
    onWeatherError: handleWeatherError
  }), [weatherCity]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex-shrink-0">
        <TopNavigationBar {...topNavProps} />
      </div>
      
      {/* Banner Content */}
      <div className="flex-1 relative overflow-visible">
        {/* Control buttons positioned in banner area - hidden on mobile */}
        {!isMobile && onEditLayoutClick && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditLayoutClick}
              className="gap-2 transition-all duration-200 hover:bg-accent bg-transparent text-foreground hover:text-accent-foreground"
            >
              <Edit3 className="h-4 w-4" />
              Edit Layout
            </Button>
          </div>
        )}
        
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