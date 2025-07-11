import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user's Google Drive settings
    const { data: settings } = await supabaseClient
      .from('google_drive_settings')
      .select('access_token')
      .eq('user_id', user.id)
      .single()

    if (!settings?.access_token) {
      return new Response(
        JSON.stringify({ error: 'Google Drive not connected' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { fileId } = await req.json()
    if (!fileId) {
      return new Response(
        JSON.stringify({ error: 'File ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Download file from Google Drive
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${settings.access_token}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to download file:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to download file from Google Drive' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Return the file content as blob
    const fileContent = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    return new Response(
      fileContent,
      { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': contentType,
          'Content-Disposition': 'attachment'
        }
      }
    )

  } catch (error) {
    console.error('Error in google-drive-download function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})