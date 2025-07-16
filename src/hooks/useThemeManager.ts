import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useThemeManager = () => {
  const { user } = useAuth();

  useEffect(() => {
    const applyTheme = async () => {
      if (!user) return;

      try {
        // Get user's theme preference
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('dashboard_theme')
          .eq('user_id', user.id)
          .single();

        const theme = preferences?.dashboard_theme || 'default';
        
        // Remove all existing theme classes
        const html = document.documentElement;
        html.classList.remove(
          'theme-default',
          'theme-midnight', 
          'theme-emerald',
          'theme-violet',
          'theme-sunset',
          'theme-pure-black'
        );

        // Apply the selected theme (only custom color themes, NOT light/dark)
        if (theme !== 'default') {
          html.classList.add(`theme-${theme}`);
        }

        // For demo user with default theme, ensure clean styling
        if (user.email === 'demo@onlinenote.ai' && theme === 'default') {
          // Remove any existing theme classes and apply clean default
          html.classList.add('theme-clean-default');
        }

        // Ensure light/dark mode classes are preserved and not affected by custom themes
        // The basic ThemeProvider handles 'light'/'dark' classes separately

      } catch (error) {
        console.error('Error applying theme:', error);
      }
    };

    applyTheme();
  }, [user]);

  return null;
};