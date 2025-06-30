
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Enhanced error handling for missing environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not fully configured. Some features may not work.');
  console.warn('Missing variables:', {
    VITE_SUPABASE_URL: !supabaseUrl ? 'missing' : 'configured',
    VITE_SUPABASE_ANON_KEY: !supabaseAnonKey ? 'missing' : 'configured'
  });
}

// Use default values if environment variables are missing (for development)
const defaultUrl = supabaseUrl || 'https://qrdulwzjgbfgaplazgsh.supabase.co'
const defaultKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZHVsd3pqZ2JmZ2FwbGF6Z3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODAzOTEsImV4cCI6MjA2MzQ1NjM5MX0.1KYtfqg9iKuu9UfSuySWOH7XsCneoDTbnYqg9JqSvjY'

if (import.meta.env.PROD && defaultUrl.startsWith('http://')) {
  console.error('Supabase URL must use HTTPS in production')
}

export const supabase = createClient(defaultUrl, defaultKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'online-note-ai@1.0.0',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    fetch: (url, options: RequestInit = {}) => {
      // Enhanced error handling for network requests
      return fetch(url, {
        ...options,
        credentials: 'omit', // Prevent CORS issues
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        }
      }).catch(error => {
        console.warn('Supabase request failed (this may be expected if offline):', error.message);
        throw error;
      });
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    },
    heartbeatIntervalMs: 30000,
    reconnectAfterMs: (tries: number) => Math.min(tries * 1000, 30000),
  }
})
