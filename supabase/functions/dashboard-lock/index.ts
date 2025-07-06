import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-my-custom-header',
}

interface DashboardLockRequest {
  lockDashboard?: boolean;
  lockSidebar?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { lockDashboard = true, lockSidebar = true }: DashboardLockRequest = await req.json()

    console.log(`Locking dashboard for user ${user.id}:`, { lockDashboard, lockSidebar })

    // Update dashboard settings to disable edit modes (lock the panels)
    const { data: existingSettings } = await supabaseClient
      .from('dashboard_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (existingSettings) {
      // Update existing settings
      const { error: updateError } = await supabaseClient
        .from('dashboard_settings')
        .update({
          dashboard_edit_mode: lockDashboard ? false : existingSettings.dashboard_edit_mode,
          sidebar_edit_mode: lockSidebar ? false : existingSettings.sidebar_edit_mode,
          edit_mode_expires_at: null, // Clear expiration since we're explicitly locking
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating dashboard settings:', updateError)
        return new Response(
          JSON.stringify({ error: 'Failed to lock dashboard' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    } else {
      // Create new settings with locked state
      const { error: insertError } = await supabaseClient
        .from('dashboard_settings')
        .insert({
          user_id: user.id,
          dashboard_edit_mode: !lockDashboard,
          sidebar_edit_mode: !lockSidebar,
          edit_mode_expires_at: null,
          sidebar_panel_sizes: {},
          selected_banner_url: null,
          selected_banner_type: null
        })

      if (insertError) {
        console.error('Error creating dashboard settings:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to lock dashboard' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    console.log(`Dashboard successfully locked for user ${user.id}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Dashboard layout locked successfully',
        locked: {
          dashboard: lockDashboard,
          sidebar: lockSidebar
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Dashboard lock function error:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})