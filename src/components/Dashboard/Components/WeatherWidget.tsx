import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Eye, 
  Thermometer,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { ComponentLibraryButton } from './ComponentLibraryButton';

const currentWeather = {
  location: 'New York, NY',
  temperature: 22,
  condition: 'Partly Cloudy',
  icon: 'partly-cloudy',
  humidity: 65,
  windSpeed: 12,
  visibility: 10,
  uvIndex: 6,
  feelsLike: 24
};

const forecast = [
  {
    day: 'Today',
    high: 24,
    low: 18,
    condition: 'Sunny',
    icon: 'sunny',
    precipitation: 0
  },
  {
    day: 'Tomorrow',
    high: 21,
    low: 15,
    condition: 'Rain',
    icon: 'rainy',
    precipitation: 80
  },
  {
    day: 'Wed',
    high: 26,
    low: 19,
    condition: 'Cloudy',
    icon: 'cloudy',
    precipitation: 20
  },
  {
    day: 'Thu',
    high: 28,
    low: 22,
    condition: 'Sunny',
    icon: 'sunny',
    precipitation: 5
  }
];

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny':
      return <Sun className="h-4 w-4 text-yellow-500" />;
    case 'cloudy':
    case 'partly-cloudy':
      return <Cloud className="h-4 w-4 text-gray-500" />;
    case 'rainy':
      return <CloudRain className="h-4 w-4 text-blue-500" />;
    default:
      return <Sun className="h-4 w-4 text-yellow-500" />;
  }
};

export function WeatherWidget() {
  return (
    <Card className="h-full group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Weather</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <RefreshCw className="h-3 w-3" />
            </Button>
            <ComponentLibraryButton componentName="weather widget" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{currentWeather.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {currentWeather.temperature}°C
                </span>
                {getWeatherIcon(currentWeather.icon)}
              </div>
              <span className="text-sm text-muted-foreground">
                {currentWeather.condition}
              </span>
              <span className="text-xs text-muted-foreground">
                Feels like {currentWeather.feelsLike}°C
              </span>
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Droplets className="h-3 w-3 text-blue-500" />
              <span className="text-xs text-muted-foreground">Humidity</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {currentWeather.humidity}%
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Wind className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-muted-foreground">Wind</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {currentWeather.windSpeed} km/h
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Eye className="h-3 w-3 text-purple-500" />
              <span className="text-xs text-muted-foreground">Visibility</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {currentWeather.visibility} km
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Sun className="h-3 w-3 text-orange-500" />
              <span className="text-xs text-muted-foreground">UV Index</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {currentWeather.uvIndex}
            </span>
          </div>
        </div>

        {/* 4-Day Forecast */}
        <div className="space-y-2 pt-2 border-t">
          <span className="text-xs font-medium text-muted-foreground">4-Day Forecast</span>
          <div className="space-y-2">
            {forecast.map((day, index) => (
              <div key={day.day} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  {getWeatherIcon(day.icon)}
                  <span className="text-xs font-medium text-foreground min-w-[60px]">
                    {day.day}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {day.condition}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-foreground font-medium">
                    {day.high}°
                  </span>
                  <span className="text-muted-foreground">
                    {day.low}°
                  </span>
                  {day.precipitation > 0 && (
                    <Badge variant="outline" className="text-xs text-blue-600">
                      {day.precipitation}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
            <Thermometer className="h-3 w-3 mr-1" />
            View Detailed Forecast
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}