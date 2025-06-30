
import { createClient } from '@supabase/supabase-js'

// Use the actual Supabase project URL and anon key directly
const supabaseUrl = 'https://qrdulwzjgbfgaplazgsh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZHVsd3pqZ2JmZ2FwbGF6Z3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4ODAzOTEsImV4cCI6MjA2MzQ1NjM5MX0.1KYtfqg9iKuu9UfSuySWOH7XsCneoDTbnYqg9JqSvjY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
      return fetch(url, {
        ...options,
        credentials: 'omit',
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
