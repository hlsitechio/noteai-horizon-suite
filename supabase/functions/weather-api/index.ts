import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-my-custom-header',
}

interface WeatherRequest {
  city: string;
  units?: 'metric' | 'imperial';
  forecast?: boolean;
}

interface WeatherResponse {
  temperature: number;
  city: string;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
  forecast?: any[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('TOMORROW_IO_API_KEY');
    if (!apiKey) {
      console.error('Tomorrow.io API key not configured');
      return new Response(
        JSON.stringify({ error: 'Weather service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { city, units = 'metric', forecast = false }: WeatherRequest = await req.json();

    if (!city || city.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'City parameter is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching weather for city: ${city}, units: ${units}, forecast: ${forecast}`);

    // Tomorrow.io API endpoints - Using the official documented endpoints
    const baseUrl = 'https://api.tomorrow.io/v4';
    
    // Use the official realtime weather endpoint
    const realtimeUrl = `${baseUrl}/weather/realtime?location=${encodeURIComponent(city)}&units=${units}&apikey=${apiKey}`;
    
    console.log('Fetching from Tomorrow.io Realtime API...');
    const realtimeResponse = await fetch(realtimeUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'accept-encoding': 'deflate, gzip, br'
      }
    });
    
    if (!realtimeResponse.ok) {
      console.error('Tomorrow.io API error:', realtimeResponse.status, realtimeResponse.statusText);
      const errorText = await realtimeResponse.text();
      console.error('Error details:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Weather service error: ${realtimeResponse.status}`,
          details: errorText
        }),
        { 
          status: realtimeResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const realtimeData = await realtimeResponse.json();
    console.log('Tomorrow.io realtime response received:', JSON.stringify(realtimeData, null, 2));

    if (!realtimeData.data || !realtimeData.data.values) {
      console.error('No weather data found for city:', city);
      return new Response(
        JSON.stringify({ error: 'No weather data found for the specified city' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const values = realtimeData.data.values;
    const location = realtimeData.location;

    // Weather code to condition mapping (same as before)
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

    // Temperature is already in the correct unit from the API
    const temperature = Math.round(values.temperature || 0);

    const weatherResponse: WeatherResponse = {
      temperature,
      city: location?.name || city,
      condition: getWeatherCondition(values.weatherCode || 1000),
      humidity: values.humidity ? Math.round(values.humidity) : undefined,
      windSpeed: values.windSpeed ? Math.round(values.windSpeed * 10) / 10 : undefined,
      icon: values.weatherCode ? String(values.weatherCode) : undefined
    };

    // Add forecast data if requested using the forecast endpoint
    if (forecast) {
      try {
        const forecastUrl = `${baseUrl}/weather/forecast?location=${encodeURIComponent(city)}&timesteps=1d&units=${units}&apikey=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'accept-encoding': 'deflate, gzip, br'
          }
        });
        
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          
          // Extract daily forecast data
          if (forecastData.timelines && forecastData.timelines.daily) {
            weatherResponse.forecast = forecastData.timelines.daily.slice(1, 6).map((interval: any) => ({
              date: interval.time,
              temperature: Math.round(interval.values.temperature),
              condition: getWeatherCondition(interval.values.weatherCode),
              weatherCode: interval.values.weatherCode
            }));
          }
        }
      } catch (error) {
        console.log('Could not fetch forecast data:', error);
      }
    }

    console.log('Returning weather data:', weatherResponse);

    return new Response(
      JSON.stringify(weatherResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
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