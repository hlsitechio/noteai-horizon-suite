import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Tomorrow.io API endpoints
    const baseUrl = 'https://api.tomorrow.io/v4';
    
    // First, get location coordinates
    const locationUrl = `${baseUrl}/timelines?location=${encodeURIComponent(city)}&fields=temperature&timesteps=current&units=${units}&apikey=${apiKey}`;
    
    console.log('Fetching from Tomorrow.io API...');
    const locationResponse = await fetch(locationUrl);
    
    if (!locationResponse.ok) {
      console.error('Tomorrow.io API error:', locationResponse.status, locationResponse.statusText);
      const errorText = await locationResponse.text();
      console.error('Error details:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Weather service error: ${locationResponse.status}`,
          details: errorText
        }),
        { 
          status: locationResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const locationData = await locationResponse.json();
    console.log('Tomorrow.io response received:', JSON.stringify(locationData, null, 2));

    if (!locationData.data || !locationData.data.timelines || locationData.data.timelines.length === 0) {
      console.error('No weather data found for city:', city);
      return new Response(
        JSON.stringify({ error: 'No weather data found for the specified city' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const currentData = locationData.data.timelines[0].intervals[0];
    const values = currentData.values;

    // Get additional weather data if available
    const detailedUrl = `${baseUrl}/timelines?location=${encodeURIComponent(city)}&fields=temperature,temperatureApparent,humidity,windSpeed,weatherCode&timesteps=current&units=${units}&apikey=${apiKey}`;
    
    let detailedData = null;
    try {
      const detailedResponse = await fetch(detailedUrl);
      if (detailedResponse.ok) {
        detailedData = await detailedResponse.json();
      }
    } catch (error) {
      console.log('Could not fetch detailed weather data:', error);
    }

    const detailedValues = detailedData?.data?.timelines?.[0]?.intervals?.[0]?.values || {};

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

    const temperature = units === 'metric' ? 
      Math.round(values.temperature || detailedValues.temperature || 0) :
      Math.round(((values.temperature || detailedValues.temperature || 0) * 9/5) + 32);

    const weatherResponse: WeatherResponse = {
      temperature,
      city: city,
      condition: getWeatherCondition(detailedValues.weatherCode || 1000),
      humidity: detailedValues.humidity ? Math.round(detailedValues.humidity) : undefined,
      windSpeed: detailedValues.windSpeed ? Math.round(detailedValues.windSpeed * 10) / 10 : undefined,
      icon: detailedValues.weatherCode ? String(detailedValues.weatherCode) : undefined
    };

    // Add forecast data if requested
    if (forecast) {
      try {
        const forecastUrl = `${baseUrl}/timelines?location=${encodeURIComponent(city)}&fields=temperature,weatherCode&timesteps=1d&startTime=now&endTime=nowPlus5d&units=${units}&apikey=${apiKey}`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          weatherResponse.forecast = forecastData.data?.timelines?.[0]?.intervals?.slice(1, 6).map((interval: any) => ({
            date: interval.startTime,
            temperature: Math.round(interval.values.temperature),
            condition: getWeatherCondition(interval.values.weatherCode),
            weatherCode: interval.values.weatherCode
          })) || [];
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