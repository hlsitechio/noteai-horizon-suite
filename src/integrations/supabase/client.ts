
import { createClient } from '@supabase/supabase-js'

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
      // Fix CORS issue by not including credentials for API requests when not authenticated
      return fetch(url, {
        ...options,
        credentials: 'same-origin', // Changed from 'include' to 'same-origin'
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        }
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
