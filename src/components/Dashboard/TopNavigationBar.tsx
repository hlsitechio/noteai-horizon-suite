import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, MapPin, Thermometer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface WeatherData {
  temperature: number;
  city: string;
  condition: string;
}

interface TopNavigationBarProps {
  weatherCity?: string;
  onWeatherError?: (error: string) => void;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({ 
  weatherCity = 'New York', 
  onWeatherError 
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch weather data
  const fetchWeather = async (city: string) => {
    setIsLoadingWeather(true);
    try {
      // This will be implemented with Tomorrow.io API integration
      // For now, showing placeholder data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setWeather({
        temperature: Math.round(Math.random() * 30 + 5), // Random temp 5-35°C
        city: city,
        condition: 'Partly Cloudy'
      });
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      onWeatherError?.('Failed to fetch weather data');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeather(weatherCity);
  }, [weatherCity]);

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

  return (
    <Card className="w-full border-0 shadow-none bg-background/80 backdrop-blur-sm">
      <div className={`p-3 ${isMobile ? 'space-y-2' : 'flex items-center justify-between'}`}>
        {/* Welcome Message */}
        <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
          <span className={`font-medium text-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
            Welcome back, {firstName}!
          </span>
        </div>

        {/* Time and Date */}
        <div className={`flex items-center gap-4 ${isMobile ? 'justify-center text-sm' : ''}`}>
          <div className="flex items-center gap-2">
            <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
            <div className="text-center">
              <div className={`font-mono font-semibold text-foreground ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {formatTime(currentTime)}
              </div>
              <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Weather Widget */}
        <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
          {isLoadingWeather ? (
            <div className="flex items-center gap-2">
              <Thermometer className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground animate-pulse`} />
              <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Loading weather...
              </span>
            </div>
          ) : weather ? (
            <div className="flex items-center gap-2">
              <MapPin className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-muted-foreground`} />
              <div className="text-center">
                <div className={`font-semibold text-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {weather.temperature}°C
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