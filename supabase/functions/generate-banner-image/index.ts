
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
    const { prompt, pagePath, saveToGallery = true } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Check if OpenAI API key is available
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log('[banner-generation] Generating banner with prompt:', prompt)

    // Use OpenAI's image generation API (more reliable than Hugging Face)
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `Create a beautiful banner image: ${prompt}. Make it suitable for a dashboard header with a 16:9 aspect ratio.`,
        n: 1,
        size: '1792x1024', // Banner-friendly aspect ratio
        quality: 'high',
        response_format: 'url'
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('[banner-generation] OpenAI API error:', errorData)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate banner image', 
          details: errorData 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const data = await response.json()
    const imageUrl = data.data[0].url

    console.log('[banner-generation] Image generated successfully')

    // If saving to gallery and we have auth, save it
    if (saveToGallery) {
      try {
        const authHeader = req.headers.get('Authorization')
        if (authHeader) {
          const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          )

          const { data: { user } } = await supabaseClient.auth.getUser(
            authHeader.replace('Bearer ', '')
          )

          if (user) {
            // Download the image and save to storage
            const imageResponse = await fetch(imageUrl)
            const imageBlob = await imageResponse.blob()
            const fileName = `generated-banner-${Date.now()}.png`
            
            const { data: uploadData, error: uploadError } = await supabaseClient.storage
              .from('user-gallery')
              .upload(`${user.id}/${fileName}`, imageBlob, {
                contentType: 'image/png',
                upsert: false
              })

            if (!uploadError && uploadData) {
              const { data: publicUrlData } = supabaseClient.storage
                .from('user-gallery')
                .getPublicUrl(uploadData.path)

              // Save to gallery table
              await supabaseClient
                .from('user_gallery')
                .insert({
                  user_id: user.id,
                  file_name: fileName,
                  file_url: publicUrlData.publicUrl,
                  storage_path: uploadData.path,
                  file_type: 'image/png',
                  file_size: imageBlob.size,
                  title: `Generated Banner: ${prompt.slice(0, 50)}...`,
                  description: `AI-generated banner image from prompt: ${prompt}`,
                  tags: ['ai-generated', 'banner', 'dashboard']
                })

              console.log('[banner-generation] Image saved to gallery')
              
              return new Response(
                JSON.stringify({ 
                  image: publicUrlData.publicUrl,
                  success: true,
                  savedToGallery: true
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              )
            }
          }
        }
      } catch (galleryError) {
        console.warn('[banner-generation] Failed to save to gallery:', galleryError)
        // Continue with just the image URL
      }
    }

    return new Response(
      JSON.stringify({ 
        image: imageUrl,
        success: true,
        savedToGallery: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[banner-generation] Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate banner image', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
