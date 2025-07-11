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

    const formData = await req.formData()
    const file = formData.get('file') as File
    const folderId = formData.get('folderId') as string

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'File is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create file metadata
    const metadata = {
      name: file.name,
      ...(folderId && { parents: [folderId] })
    }

    // Create multipart upload data
    const boundary = '-------314159265358979323846'
    const delimiter = `\r\n--${boundary}\r\n`
    const close_delim = `\r\n--${boundary}--`

    let body = delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${file.type}\r\n\r\n`

    // Convert file to array buffer and create body
    const fileBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(body.length + fileBuffer.byteLength + close_delim.length)
    
    let offset = 0
    // Add metadata part
    const bodyBytes = new TextEncoder().encode(body)
    uint8Array.set(bodyBytes, offset)
    offset += bodyBytes.length
    
    // Add file content
    uint8Array.set(new Uint8Array(fileBuffer), offset)
    offset += fileBuffer.byteLength
    
    // Add closing delimiter
    const closeBytes = new TextEncoder().encode(close_delim)
    uint8Array.set(closeBytes, offset)

    // Upload file to Google Drive
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.access_token}`,
        'Content-Type': `multipart/related; boundary="${boundary}"`,
      },
      body: uint8Array,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to upload file:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file to Google Drive' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const uploadedFile = await response.json()

    return new Response(
      JSON.stringify({
        id: uploadedFile.id,
        name: uploadedFile.name,
        mimeType: uploadedFile.mimeType,
        createdTime: uploadedFile.createdTime,
        modifiedTime: uploadedFile.modifiedTime,
        size: uploadedFile.size,
        webViewLink: uploadedFile.webViewLink,
        webContentLink: uploadedFile.webContentLink,
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in google-drive-upload function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})