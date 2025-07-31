import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client for authentication
const supabaseUrl = 'https://ubxtmbgvibtjtjggjnjm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVieHRtYmd2aWJ0anRqZ2dqbmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzIyNjgsImV4cCI6MjA2NzU0ODI2OH0.As1iaW6edJIAUdCyNNfTIiXG3pZRRX4Om9AJ7g4TO3Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});