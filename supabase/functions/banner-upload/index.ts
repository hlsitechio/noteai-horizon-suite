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
      console.error('[banner-upload] Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { fileData, fileName, fileType, pagePath } = await req.json()

    if (!fileData || !fileName) {
      return new Response(
        JSON.stringify({ error: 'File data and name are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`[banner-upload] Processing upload for user ${user.id}: ${fileName}`)

    // Convert base64 to blob
    let fileBlob: Blob
    try {
      if (fileData.startsWith('data:')) {
        // Handle data URL format
        const base64Data = fileData.split(',')[1]
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        fileBlob = new Blob([byteArray], { type: fileType || 'image/jpeg' })
      } else {
        // Handle raw base64
        const byteCharacters = atob(fileData)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        fileBlob = new Blob([byteArray], { type: fileType || 'image/jpeg' })
      }
    } catch (decodeError) {
      console.error('[banner-upload] Error decoding file data:', decodeError)
      return new Response(
        JSON.stringify({ error: 'Invalid file data format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Determine storage bucket based on file type
    const storageFolder = fileType?.startsWith('video/') ? 'banner-videos' : 'dashboard-banners'
    const cleanFileName = `${user.id}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '')}`

    console.log(`[banner-upload] Uploading to ${storageFolder}/${cleanFileName}`)

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(storageFolder)
      .upload(cleanFileName, fileBlob, {
        contentType: fileType || 'image/jpeg',
        upsert: true
      })

    if (uploadError) {
      console.error('[banner-upload] Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Get public URL
    const { data: publicUrlData } = supabaseClient.storage
      .from(storageFolder)
      .getPublicUrl(uploadData.path)

    console.log(`[banner-upload] File uploaded successfully: ${publicUrlData.publicUrl}`)

    // Save to user gallery for future reference
    try {
      await supabaseClient
        .from('user_gallery')
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_url: publicUrlData.publicUrl,
          storage_path: uploadData.path,
          file_type: fileType || 'image/jpeg',
          file_size: fileBlob.size,
          title: `Banner Upload: ${fileName}`,
          description: `Uploaded banner file${pagePath ? ` for ${pagePath}` : ''}`,
          tags: ['banner', 'upload', ...(fileType?.startsWith('video/') ? ['video'] : ['image'])]
        })

      console.log('[banner-upload] File saved to gallery')
    } catch (galleryError) {
      console.warn('[banner-upload] Failed to save to gallery:', galleryError)
      // Continue without gallery save
    }

    // If pagePath is provided, automatically set as banner for that page
    if (pagePath) {
      try {
        await supabaseClient
          .from('page_banner_settings')
          .upsert({
            user_id: user.id,
            page_path: pagePath,
            banner_url: publicUrlData.publicUrl,
            banner_type: fileType?.startsWith('video/') ? 'video' : 'image',
            is_enabled: true,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,page_path'
          })

        console.log(`[banner-upload] Banner set for page: ${pagePath}`)
      } catch (pageSettingsError) {
        console.warn('[banner-upload] Failed to set page banner:', pageSettingsError)
        // Continue without setting page banner
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        url: publicUrlData.publicUrl,
        path: uploadData.path,
        fileName: fileName,
        fileType: fileType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[banner-upload] Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})