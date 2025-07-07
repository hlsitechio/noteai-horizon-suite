import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle,
  Snowflake,
  Zap,
  Wind,
  Eye,
  CloudFog,
  LucideIcon
} from 'lucide-react';

interface WeatherIconProps {
  weatherCode: string | number;
  className?: string;
}

// Weather icon mapping based on Tomorrow.io weather codes
// Reference: https://docs.tomorrow.io/reference/data-layers-weather-codes
const getWeatherIcon = (code: string | number): LucideIcon => {
  const numCode = typeof code === 'string' ? parseInt(code) : code;
  
  switch (numCode) {
    // Clear/Sunny
    case 1000:
      return Sun; // "Clear, Sunny"
    
    // Mostly Clear
    case 1100:
      return Sun; // "Mostly Clear" - still sunny with few clouds
    
    // Partly Cloudy
    case 1101:
      return Cloud; // "Partly Cloudy"
    
    // Mostly Cloudy
    case 1102:
      return Cloud; // "Mostly Cloudy"
    
    // Cloudy
    case 1001:
      return Cloud; // "Cloudy"
    
    // Fog
    case 2000:
    case 2100:
      return CloudFog; // "Fog" / "Light Fog"
    
    // Wind
    case 3000:
    case 3001:
    case 3002:
      return Wind; // "Light Wind" / "Wind" / "Strong Wind"
    
    // Drizzle
    case 4000:
      return CloudDrizzle; // "Drizzle"
    
    // Rain
    case 4001:
    case 4200:
    case 4201:
      return CloudRain; // "Rain" / "Light Rain" / "Heavy Rain"
    
    // Snow
    case 5000:
    case 5001:
    case 5100:
    case 5101:
      return CloudSnow; // "Snow" / "Flurries" / "Light Snow" / "Heavy Snow"
    
    // Freezing Rain/Drizzle
    case 6000:
    case 6001:
    case 6200:
    case 6201:
      return CloudRain; // "Freezing Drizzle" / "Freezing Rain" / "Light Freezing Rain" / "Heavy Freezing Rain"
    
    // Ice Pellets
    case 7000:
    case 7101:
    case 7102:
      return Snowflake; // "Ice Pellets" / "Heavy Ice Pellets" / "Light Ice Pellets"
    
    // Thunderstorm
    case 8000:
      return Zap; // "Thunderstorm"
    
    // Unknown or default
    case 0:
    default:
      return Cloud; // "Unknown" or fallback
  }
};

// Color mapping for weather icons
const getWeatherIconColor = (code: string | number): string => {
  const numCode = typeof code === 'string' ? parseInt(code) : code;
  
  switch (numCode) {
    case 1000:
    case 1100:
      return 'text-yellow-500'; // Sunny/Clear
    case 1101:
    case 1102:
    case 1001:
      return 'text-gray-500'; // Cloudy
    case 2000:
    case 2100:
      return 'text-gray-400'; // Fog
    case 3000:
    case 3001:
    case 3002:
      return 'text-blue-400'; // Wind
    case 4000:
    case 4001:
    case 4200:
    case 4201:
    case 6000:
    case 6001:
    case 6200:
    case 6201:
      return 'text-blue-600'; // Rain/Drizzle
    case 5000:
    case 5001:
    case 5100:
    case 5101:
    case 7000:
    case 7101:
    case 7102:
      return 'text-blue-300'; // Snow/Ice
    case 8000:
      return 'text-purple-600'; // Thunderstorm
    default:
      return 'text-gray-500'; // Default
  }
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  weatherCode, 
  className = "h-4 w-4" 
}) => {
  const IconComponent = getWeatherIcon(weatherCode);
  const colorClass = getWeatherIconColor(weatherCode);
  
  return (
    <IconComponent 
      className={`${className} ${colorClass}`}
      aria-label={`Weather condition: ${weatherCode}`}
    />
  );
};

export default WeatherIcon;