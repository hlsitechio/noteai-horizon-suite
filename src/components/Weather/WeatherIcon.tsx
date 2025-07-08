import React from 'react';

interface WeatherIconProps {
  weatherCode: string | number;
  className?: string;
}

// Map Tomorrow.io weather codes to OpenWeatherMap icons
const getWeatherIconUrl = (code: string | number): string => {
  const numCode = typeof code === 'string' ? parseInt(code) : code;
  
  // Map Tomorrow.io codes to OpenWeatherMap icon codes
  let iconCode = '01d'; // default sunny
  
  switch (numCode) {
    // Clear/Sunny
    case 1000:
    case 1100:
      iconCode = '01d'; // clear sky
      break;
    
    // Partly/Mostly Cloudy
    case 1101:
      iconCode = '02d'; // few clouds
      break;
    case 1102:
    case 1001:
      iconCode = '04d'; // broken clouds
      break;
    
    // Fog
    case 2000:
    case 2100:
      iconCode = '50d'; // mist
      break;
    
    // Drizzle & Rain
    case 4000:
      iconCode = '09d'; // shower rain
      break;
    case 4001:
    case 4200:
      iconCode = '10d'; // rain
      break;
    case 4201:
      iconCode = '09d'; // shower rain (heavy)
      break;
    
    // Snow
    case 5000:
    case 5001:
    case 5100:
    case 5101:
      iconCode = '13d'; // snow
      break;
    
    // Thunderstorm
    case 8000:
      iconCode = '11d'; // thunderstorm
      break;
    
    // Default
    default:
      iconCode = '01d';
      break;
  }
  
  // Use OpenWeatherMap reliable CDN
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Fallback icon mapping in case the PNG doesn't load
const getFallbackEmoji = (code: string | number): string => {
  const numCode = typeof code === 'string' ? parseInt(code) : code;
  
  switch (numCode) {
    // Clear/Sunny
    case 1000:
    case 1100:
      return '☀️'; // "Clear, Sunny" / "Mostly Clear"
    
    // Partly/Mostly Cloudy
    case 1101:
      return '⛅'; // "Partly Cloudy"
    case 1102:
    case 1001:
      return '☁️'; // "Mostly Cloudy" / "Cloudy"
    
    // Fog
    case 2000:
    case 2100:
      return '🌫️'; // "Fog" / "Light Fog"
    
    // Wind
    case 3000:
    case 3001:
    case 3002:
      return '💨'; // "Light Wind" / "Wind" / "Strong Wind"
    
    // Drizzle & Rain
    case 4000:
      return '🌦️'; // "Drizzle"
    case 4001:
    case 4200:
    case 4201:
      return '🌧️'; // "Rain" / "Light Rain" / "Heavy Rain"
    
    // Snow
    case 5000:
    case 5001:
    case 5100:
    case 5101:
      return '❄️'; // "Snow" / "Flurries" / "Light Snow" / "Heavy Snow"
    
    // Freezing Rain/Drizzle
    case 6000:
    case 6001:
    case 6200:
    case 6201:
      return '🌨️'; // "Freezing Drizzle" / "Freezing Rain"
    
    // Ice Pellets
    case 7000:
    case 7101:
    case 7102:
      return '🧊'; // "Ice Pellets"
    
    // Thunderstorm
    case 8000:
      return '⛈️'; // "Thunderstorm"
    
    // Unknown or default
    default:
      return '🌤️'; // Default weather
  }
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  weatherCode, 
  className = "h-4 w-4" 
}) => {
  const iconUrl = getWeatherIconUrl(weatherCode);
  const fallbackEmoji = getFallbackEmoji(weatherCode);
  
  return (
    <div className={`${className} flex items-center justify-center`}>
      <img
        src={iconUrl}
        alt={`Weather condition: ${weatherCode}`}
        className="w-full h-full object-contain"
        onError={(e) => {
          // If the PNG fails to load, show the emoji fallback
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.weather-emoji')) {
            const emoji = document.createElement('span');
            emoji.textContent = fallbackEmoji;
            emoji.className = 'weather-emoji text-lg';
            emoji.style.fontSize = '1rem';
            parent.appendChild(emoji);
          }
        }}
      />
    </div>
  );
};

export default WeatherIcon;