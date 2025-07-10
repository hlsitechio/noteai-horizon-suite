import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Fetching profile for user:', user.id);

    // Fetch user profile from the database
    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('id, display_name, email, avatar_url, created_at')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      
      // If profile doesn't exist, create a basic one
      if (profileError.code === 'PGRST116') {
        console.log('Profile not found, creating basic profile...');
        
        const displayName = user.user_metadata?.display_name || 
                           user.user_metadata?.full_name ||
                           user.email?.split('@')[0] || 
                           'User';

        const { data: newProfile, error: createError } = await supabaseClient
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email!,
            display_name: displayName,
            avatar_url: user.user_metadata?.avatar_url || null
          })
          .select('id, display_name, email, avatar_url, created_at')
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return new Response(
            JSON.stringify({ error: 'Failed to create user profile' }),
            { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

        console.log('Created new profile:', newProfile);
        return new Response(
          JSON.stringify({ 
            profile: newProfile,
            created: true
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profile' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Profile fetched successfully:', profile.display_name);

    return new Response(
      JSON.stringify({ 
        profile,
        created: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in get-user-profile:', error);
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