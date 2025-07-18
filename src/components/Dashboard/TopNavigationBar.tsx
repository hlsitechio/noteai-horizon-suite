import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, MapPin, Thermometer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { WeatherIcon } from '@/components/Weather/WeatherIcon';
import { ChronoDropdown } from './ChronoDropdown';
import { ChronoDisplay } from './ChronoDisplay';
import { toast } from 'sonner';

interface WeatherData {
  temperature: number;
  city: string;
  condition: string;
  icon?: string; // Weather code from Tomorrow.io API
}

interface TopNavigationBarProps {
  weatherCity?: string;
  onWeatherError?: (error: string) => void;
}

const TopNavigationBarComponent: React.FC<TopNavigationBarProps> = ({ 
  weatherCity = 'New York', 
  onWeatherError 
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [weatherUnits, setWeatherUnits] = useState<'celsius' | 'fahrenheit'>('celsius');
  const [savedWeatherCity, setSavedWeatherCity] = useState<string>('New York');

  // Chronometer states
  const [showChronoDropdown, setShowChronoDropdown] = useState(false);
  const [activeTimer, setActiveTimer] = useState<{minutes: number, seconds: number} | null>(null);

  // Load weather settings from localStorage
  useEffect(() => {
    const loadWeatherSettings = () => {
      const savedSettings = localStorage.getItem('weather-settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.units) {
            setWeatherUnits(settings.units);
          }
          if (settings.city) {
            setSavedWeatherCity(settings.city);
          }
        } catch (error) {
          console.error('Failed to load weather settings:', error);
        }
      } else {
        // Use the weatherCity prop only if no saved settings exist
        setSavedWeatherCity(weatherCity);
      }
    };

    loadWeatherSettings();
  }, [weatherCity]);

  // Listen for weather settings changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'weather-settings' && e.newValue) {
        try {
          const settings = JSON.parse(e.newValue);
          if (settings.units) {
            setWeatherUnits(settings.units);
          }
          if (settings.city) {
            setSavedWeatherCity(settings.city);
          }
        } catch (error) {
          console.error('Failed to parse weather settings:', error);
        }
      }
    };

    // Listen for custom events for same-tab updates
    const handleCustomStorageChange = () => {
      const savedSettings = localStorage.getItem('weather-settings');
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          if (settings.units) {
            setWeatherUnits(settings.units);
          }
          if (settings.city) {
            setSavedWeatherCity(settings.city);
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

  // Update clock every second using optimized scheduling
  useEffect(() => {
    import('@/utils/scheduler').then(({ scheduleIdleCallback, cancelIdleCallback }) => {
      let timeoutId: number;
      
      const updateClock = () => {
        setCurrentTime(new Date());
        timeoutId = scheduleIdleCallback(updateClock, 1000);
      };
      
      timeoutId = scheduleIdleCallback(updateClock, 1000);
      
      return () => {
        if (timeoutId) cancelIdleCallback(timeoutId);
      };
    });
  }, []);

  // Fetch weather data from edge function with useCallback to prevent unnecessary re-creation
  const fetchWeather = useCallback(async (city: string) => {
    if (!city.trim()) return;
    
    setIsLoadingWeather(true);
    try {
      if (import.meta.env.DEV) {
        console.log(`Fetching weather for: ${city}`);
      }
      
      // Add timeout to prevent blocking page load
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Weather request timeout')), 5000)
      );
      
      const weatherPromise = supabase.functions.invoke('weather-api', {
        body: { 
          city: city.trim(),
          units: weatherUnits === 'celsius' ? 'metric' : 'imperial'
        }
      });
      
      const { data, error } = await Promise.race([weatherPromise, timeoutPromise]) as any;

      if (error) {
        if (import.meta.env.DEV) {
          console.warn('Weather API error (non-blocking):', error.message);
        }
        // Don't call onWeatherError to avoid showing error toast on every page load
        setWeather({
          temperature: '--',
          city: city,
          condition: 'Unavailable',
          icon: '1000' // Default sunny icon
        } as any);
        return;
      }

      if (data && data.temperature !== undefined) {
        setWeather({
          temperature: data.temperature,
          city: data.city,
          condition: data.condition || 'Unknown',
          icon: data.icon // Weather code from API
        });
        if (import.meta.env.DEV) {
          console.log('Weather data updated:', data);
        }
      } else {
        console.error('Invalid weather data received:', data);
        onWeatherError?.('Invalid weather data received');
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Weather fetch error (non-blocking):', error instanceof Error ? error.message : 'Unknown error');
      }
      // Set fallback weather data instead of showing error
      setWeather({
        temperature: '--',
        city: city,
        condition: 'Unavailable',
        icon: '1000' // Default sunny icon
      } as any);
    } finally {
      setIsLoadingWeather(false);
    }
  }, [weatherUnits, onWeatherError]);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(`Weather useEffect triggered - City: ${savedWeatherCity}, Units: ${weatherUnits}`);
    }
    if (savedWeatherCity && savedWeatherCity.trim()) {
      fetchWeather(savedWeatherCity);
    }
  }, [savedWeatherCity, weatherUnits, fetchWeather]); // Include fetchWeather in dependencies

  // Chronometer handlers
  const handleStartTimer = (minutes: number, seconds: number) => {
    setActiveTimer({ minutes, seconds });
    toast.success(`Timer started for ${minutes}:${seconds.toString().padStart(2, '0')}`);
  };

  const handleTimerComplete = () => {
    toast.success('Timer completed!', {
      duration: 5000,
    });
  };

  const handleStopTimer = () => {
    setActiveTimer(null);
    toast.info('Timer stopped');
  };

  const handleClockClick = () => {
    if (!activeTimer) {
      console.log('Clock clicked, toggling dropdown:', !showChronoDropdown);
      setShowChronoDropdown(!showChronoDropdown);
    } else {
      console.log('Clock clicked but timer is active');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const firstName = user?.name?.split(' ')[0] || 'User';
  const welcomeMessage = user?.welcome_message || 'Welcome back';

  return (
    <Card className="w-full border-0 shadow-none bg-background/80 backdrop-blur-sm">
      <div className={`p-3 ${isMobile ? 'space-y-2' : 'grid grid-cols-3 items-center'}`}>
        {/* Welcome Message */}
        <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : 'justify-self-start'}`}>
          <span className={`font-medium text-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
            {welcomeMessage}, {firstName}!
          </span>
        </div>

        {/* Time and Date with Chronometer - Always Centered */}
        <div className={`flex items-center gap-4 ${isMobile ? 'justify-center text-sm' : 'justify-self-center'} relative`}>
          <div className="flex items-center gap-2 relative">
            <button 
              onClick={handleClockClick}
              className="p-1 rounded hover:bg-muted transition-colors cursor-pointer"
              type="button"
            >
              <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground hover:text-foreground`} />
            </button>
            <div className="text-center">
              <div className={`font-mono font-semibold text-foreground ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {formatTime(currentTime)}
              </div>
              <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {formatDate(currentTime)}
              </div>
            </div>
            
            {/* Chronometer Dropdown */}
            <ChronoDropdown
              isOpen={showChronoDropdown}
              onClose={() => setShowChronoDropdown(false)}
              onStartTimer={handleStartTimer}
            />
          </div>

          {/* Active Timer Display */}
          {activeTimer && (
            <ChronoDisplay
              initialMinutes={activeTimer.minutes}
              initialSeconds={activeTimer.seconds}
              onComplete={handleTimerComplete}
              onStop={handleStopTimer}
              className={isMobile ? 'text-xs' : ''}
            />
          )}
        </div>

        {/* Weather Widget */}
        <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : 'justify-self-end'}`}>
          {isLoadingWeather ? (
            <div className="flex items-center gap-2">
              <Thermometer className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground animate-pulse`} />
              <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Loading weather...
              </span>
            </div>
          ) : weather ? (
            <div className="flex items-center gap-2">
              {/* Weather icon based on weather code */}
              {weather.icon && (
                <WeatherIcon 
                  weatherCode={weather.icon} 
                  className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`}
                />
              )}
              <div className="text-center">
                <div className={`font-semibold text-foreground ${isMobile ? 'text-sm' : 'text-base'} flex items-center gap-1`}>
                  {weather.temperature}°{weatherUnits === 'celsius' ? 'C' : 'F'}
                </div>
                <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {weather.city}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Thermometer className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
              <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Weather unavailable
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const TopNavigationBar = React.memo(TopNavigationBarComponent);
