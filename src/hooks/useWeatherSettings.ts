import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WeatherSettings {
  enabled: boolean;
  city: string;
  units: 'celsius' | 'fahrenheit';
  updateInterval: number;
}

const DEFAULT_SETTINGS: WeatherSettings = {
  enabled: true,
  city: 'New York',
  units: 'celsius',
  updateInterval: 30
};

export function useWeatherSettings() {
  const [settings, setSettings] = useState<WeatherSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from Supabase
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not authenticated, use localStorage fallback
        const savedSettings = localStorage.getItem('weather-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
        setIsLoading(false);
        return;
      }

      // Fetch from Supabase
      const { data, error: fetchError } = await supabase
        .from('user_preferences')
        .select('weather_enabled, weather_city, weather_units, weather_update_interval')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        const loadedSettings: WeatherSettings = {
          enabled: data.weather_enabled ?? DEFAULT_SETTINGS.enabled,
          city: data.weather_city ?? DEFAULT_SETTINGS.city,
          units: (data.weather_units as 'celsius' | 'fahrenheit') ?? DEFAULT_SETTINGS.units,
          updateInterval: data.weather_update_interval ?? DEFAULT_SETTINGS.updateInterval
        };
        setSettings(loadedSettings);
        
        // Also update localStorage for consistency
        localStorage.setItem('weather-settings', JSON.stringify(loadedSettings));
      } else {
        // No preferences found, create default entry
        await saveSettings(DEFAULT_SETTINGS);
      }
    } catch (err) {
      console.error('Failed to load weather settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
      
      // Fallback to localStorage
      const savedSettings = localStorage.getItem('weather-settings');
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        } catch (parseError) {
          console.error('Failed to parse localStorage settings:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save settings to Supabase
  const saveSettings = async (newSettings: WeatherSettings) => {
    try {
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not authenticated, save to localStorage only
        localStorage.setItem('weather-settings', JSON.stringify(newSettings));
        setSettings(newSettings);
        
        // Dispatch event for cross-component updates
        window.dispatchEvent(new CustomEvent('weather-settings-changed'));
        return;
      }

      // Save to Supabase
      const { error: upsertError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          weather_enabled: newSettings.enabled,
          weather_city: newSettings.city,
          weather_units: newSettings.units,
          weather_update_interval: newSettings.updateInterval,
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        throw upsertError;
      }

      setSettings(newSettings);
      
      // Also update localStorage for consistency
      localStorage.setItem('weather-settings', JSON.stringify(newSettings));
      
      // Dispatch event for cross-component updates
      window.dispatchEvent(new CustomEvent('weather-settings-changed'));
      
      toast.success('Weather settings saved successfully');
    } catch (err) {
      console.error('Failed to save weather settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
      toast.error('Failed to save weather settings');
      throw err;
    }
  };

  // Update a specific setting
  const updateSetting = <K extends keyof WeatherSettings>(
    key: K,
    value: WeatherSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    return newSettings;
  };

  // Initialize settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          loadSettings();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    saveSettings,
    loadSettings
  };
}