import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Get user from auth header
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { pagePath, bannerData, action } = await req.json()

    if (!pagePath) {
      return new Response(
        JSON.stringify({ error: 'Page path is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`[banner-storage] Processing ${action || 'unknown'} request for user ${user.id}, page: ${pagePath}`)

    if (action === 'update' || (req.method === 'POST' && !action)) {
      // Save banner settings
      if (!bannerData) {
        return new Response(
          JSON.stringify({ error: 'Banner data is required for saving' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      console.log(`[banner-storage] Saving banner data:`, bannerData)

      const { data, error } = await supabaseClient
        .from('page_banner_settings')
        .upsert({
          user_id: user.id,
          page_path: pagePath,
          banner_url: bannerData.bannerUrl,
          banner_type: bannerData.bannerType || 'image',
          banner_height: bannerData.bannerHeight || 100,
          banner_position_x: bannerData.bannerPositionX || 0,
          banner_position_y: bannerData.bannerPositionY || 0,
          banner_width: bannerData.bannerWidth || 100,
          is_enabled: bannerData.isEnabled !== false,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,page_path'
        })

      if (error) {
        console.error(`[banner-storage] Error saving banner settings:`, error)
        return new Response(
          JSON.stringify({ error: 'Failed to save banner settings', details: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      console.log(`[banner-storage] Banner settings saved successfully for ${pagePath}`)

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'get' || (req.method === 'GET' && !action)) {
      // Load banner settings
      console.log(`[banner-storage] Loading banner settings for page: ${pagePath}`)

      const { data, error } = await supabaseClient
        .from('page_banner_settings')
        .select('*')
        .eq('user_id', user.id)
        .eq('page_path', pagePath)
        .maybeSingle()

      if (error) {
        console.error(`[banner-storage] Error loading banner settings:`, error)
        return new Response(
          JSON.stringify({ error: 'Failed to load banner settings', details: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      const settings = data ? {
        bannerUrl: data.banner_url,
        bannerType: data.banner_type,
        bannerHeight: data.banner_height || 100,
        bannerPositionX: data.banner_position_x || 0,
        bannerPositionY: data.banner_position_y || 0,
        bannerWidth: data.banner_width || 100,
        isEnabled: data.is_enabled !== false
      } : null

      console.log(`[banner-storage] Banner settings loaded:`, settings)

      return new Response(
        JSON.stringify({ success: true, settings }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } else if (action === 'delete' || (req.method === 'DELETE' && !action)) {
      // Delete banner settings
      console.log(`[banner-storage] Deleting banner settings for page: ${pagePath}`)

      const { error } = await supabaseClient
        .from('page_banner_settings')
        .delete()
        .eq('user_id', user.id)
        .eq('page_path', pagePath)

      if (error) {
        console.error(`[banner-storage] Error deleting banner settings:`, error)
        return new Response(
          JSON.stringify({ error: 'Failed to delete banner settings', details: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }

      console.log(`[banner-storage] Banner settings deleted successfully for ${pagePath}`)

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )

  } catch (error) {
    console.error('[banner-storage] Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})