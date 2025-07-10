import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeatherRequest {
  city: string;
  units?: 'metric' | 'imperial';
  forecast?: boolean;
  useCache?: boolean;
}

interface WeatherResponse {
  temperature: number;
  city: string;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
  forecast?: Array<{
    date: string;
    temperature: number;
    condition: string;
    weatherCode: number;
  }>;
  cached?: boolean;
  cacheExpiry?: string;
}

interface CachedWeatherData {
  data: WeatherResponse;
  expiry: number;
  city: string;
}

// In-memory cache with 10-minute expiry for better performance
const weatherCache = new Map<string, CachedWeatherData>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 100; // Prevent memory bloat

// Enhanced predefined cities with coordinates for better accuracy
const PREDEFINED_CITIES = {
  'Paris': { lat: 48.856663, lng: 2.351556, displayName: 'Paris, France' },
  'London': { lat: 51.509865, lng: -0.118092, displayName: 'London, United Kingdom' },
  'New York': { lat: 40.7127281, lng: -74.0060152, displayName: 'New York, United States' },
  'Los Angeles': { lat: 34.0536909, lng: -118.242766, displayName: 'Los Angeles, United States' },
  'Montreal': { lat: 45.508888, lng: -73.561668, displayName: 'Montreal, Canada' },
  'Toronto': { lat: 43.651070, lng: -79.347015, displayName: 'Toronto, Canada' },
  'Ottawa': { lat: 45.424721, lng: -75.695000, displayName: 'Ottawa, Canada' }
};

function getCacheKey(city: string, units: string, forecast: boolean): string {
  return `${city.toLowerCase().trim()}_${units}_${forecast}`;
}

function isValidCache(cached: CachedWeatherData): boolean {
  return Date.now() < cached.expiry;
}

function cleanCache(): void {
  if (weatherCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(weatherCache.entries());
    entries.sort((a, b) => a[1].expiry - b[1].expiry);
    // Remove oldest 20% of entries
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      weatherCache.delete(entries[i][0]);
    }
  }
}

// Enhanced fetch with timeout and retry logic
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 429 && attempt < maxRetries) {
        // Rate limited, exponential backoff
        const delay = Math.pow(2, attempt + 1) * 1000;
        console.log(`Rate limited, waiting ${delay}ms before retry ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (response.status >= 400 && response.status < 500 && attempt < maxRetries) {
        // Client error, short delay before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = Math.pow(2, attempt + 1) * 1000;
      console.log(`Request failed, retrying in ${delay}ms... (${attempt + 1}/${maxRetries}): ${lastError.message}`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, units = 'metric', forecast = false, useCache = true }: WeatherRequest = await req.json();

    if (!city || city.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'City parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const trimmedCity = city.trim();
    console.log(`Weather request: city=${trimmedCity}, units=${units}, forecast=${forecast}, useCache=${useCache}`);

    // Check cache first
    if (useCache) {
      const cacheKey = getCacheKey(trimmedCity, units, forecast);
      const cached = weatherCache.get(cacheKey);
      
      if (cached && isValidCache(cached)) {
        console.log(`Cache HIT for ${trimmedCity}`);
        const response = {
          ...cached.data,
          cached: true,
          cacheExpiry: new Date(cached.expiry).toISOString()
        };
        
        return new Response(
          JSON.stringify(response),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'X-Cache-Status': 'HIT'
            } 
          }
        );
      }
    }

    const apiKey = Deno.env.get('TOMORROW_IO_API_KEY');
    if (!apiKey) {
      console.error('Tomorrow.io API key not configured');
      // Return mock data for development/demo purposes
      const mockData = {
        temperature: 22,
        city: trimmedCity,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        icon: '1101',
        cached: false
      };
      
      return new Response(
        JSON.stringify(mockData),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Determine location parameter and display name
    const predefinedCity = PREDEFINED_CITIES[trimmedCity as keyof typeof PREDEFINED_CITIES];
    let locationParam: string;
    let cityDisplayName: string;

    if (predefinedCity) {
      locationParam = `${predefinedCity.lat}, ${predefinedCity.lng}`;
      cityDisplayName = predefinedCity.displayName;
      console.log(`Using coordinates for ${trimmedCity}: ${locationParam}`);
    } else {
      locationParam = encodeURIComponent(trimmedCity);
      cityDisplayName = trimmedCity;
      console.log(`Using city name for custom location: ${trimmedCity}`);
    }

    // Weather code to condition mapping
    const getWeatherCondition = (code: number): string => {
      const weatherCodes: { [key: number]: string } = {
        0: 'Unknown',
        1000: 'Clear',
        1001: 'Cloudy',
        1100: 'Mostly Clear',
        1101: 'Partly Cloudy',
        1102: 'Mostly Cloudy',
        2000: 'Fog',
        2100: 'Light Fog',
        3000: 'Light Wind',
        3001: 'Wind',
        3002: 'Strong Wind',
        4000: 'Drizzle',
        4001: 'Rain',
        4200: 'Light Rain',
        4201: 'Heavy Rain',
        5000: 'Snow',
        5001: 'Flurries',
        5100: 'Light Snow',
        5101: 'Heavy Snow',
        6000: 'Freezing Drizzle',
        6001: 'Freezing Rain',
        6200: 'Light Freezing Rain',
        6201: 'Heavy Freezing Rain',
        7000: 'Ice Pellets',
        7101: 'Heavy Ice Pellets',
        7102: 'Light Ice Pellets',
        8000: 'Thunderstorm'
      };
      return weatherCodes[code] || 'Unknown';
    };

    // Tomorrow.io API endpoints
    const baseUrl = 'https://api.tomorrow.io/v4';
    const realtimeUrl = `${baseUrl}/weather/realtime?location=${locationParam}&units=${units}&apikey=${apiKey}`;
    
    console.log(`Fetching from Tomorrow.io API for: ${cityDisplayName}`);
    
    const realtimeResponse = await fetchWithRetry(realtimeUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Supabase-Weather-Function/2.0'
      }
    });

    const realtimeData = await realtimeResponse.json();
    console.log(`Weather data received for ${cityDisplayName}`);

    if (!realtimeData.data || !realtimeData.data.values) {
      console.error('No weather data found for city:', trimmedCity);
      return new Response(
        JSON.stringify({ error: 'No weather data found for the specified city' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const values = realtimeData.data.values;
    const temperature = Math.round(values.temperature || 0);

    const weatherResponse: WeatherResponse = {
      temperature,
      city: cityDisplayName,
      condition: getWeatherCondition(values.weatherCode || 1000),
      humidity: values.humidity ? Math.round(values.humidity) : undefined,
      windSpeed: values.windSpeed ? Math.round(values.windSpeed * 10) / 10 : undefined,
      icon: values.weatherCode ? String(values.weatherCode) : undefined,
      cached: false
    };

    // Add forecast data if requested
    if (forecast) {
      try {
        const forecastUrl = `${baseUrl}/weather/forecast?location=${locationParam}&timesteps=1d&units=${units}&apikey=${apiKey}`;
        const forecastResponse = await fetchWithRetry(forecastUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Supabase-Weather-Function/2.0'
          }
        });
        
        const forecastData = await forecastResponse.json();
        
        if (forecastData.timelines && forecastData.timelines.daily) {
          weatherResponse.forecast = forecastData.timelines.daily.slice(1, 6).map((interval: any) => ({
            date: interval.time,
            temperature: Math.round(interval.values.temperature),
            condition: getWeatherCondition(interval.values.weatherCode),
            weatherCode: interval.values.weatherCode
          }));
        }
      } catch (error) {
        console.log('Could not fetch forecast data:', error);
        // Continue without forecast data
      }
    }

    // Cache the response
    if (useCache) {
      const cacheKey = getCacheKey(trimmedCity, units, forecast);
      cleanCache(); // Clean old entries before adding new ones
      
      weatherCache.set(cacheKey, {
        data: weatherResponse,
        expiry: Date.now() + CACHE_DURATION,
        city: trimmedCity
      });
      
      console.log(`Cached weather data for ${trimmedCity} (cache size: ${weatherCache.size})`);
    }

    console.log(`Returning fresh weather data for ${cityDisplayName}`);

    return new Response(
      JSON.stringify(weatherResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Cache-Status': 'MISS'
        } 
      }
    );

  } catch (error) {
    console.error('Weather API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});