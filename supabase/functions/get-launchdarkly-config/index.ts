import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get LaunchDarkly client ID from environment variables
    const clientId = Deno.env.get('LAUNCHDARKLY_CLIENT_ID');
    
    if (!clientId) {
      return new Response(
        JSON.stringify({ 
          error: 'LaunchDarkly client ID not configured in secrets',
          clientId: null 
        }),
        {
          status: 200, // Return 200 to allow graceful handling
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        clientId,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error getting LaunchDarkly config:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to get LaunchDarkly configuration',
        clientId: null 
      }),
      {
        status: 200, // Return 200 to allow graceful handling
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});