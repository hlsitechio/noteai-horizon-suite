
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
      console.error('[wasabi-storage] Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const { action, fileData, fileName, fileType, bucketPath } = await req.json()

    const wasabiConfig = {
      accessKeyId: Deno.env.get('WASABI_ACCESS_KEY_ID'),
      secretAccessKey: Deno.env.get('WASABI_SECRET_ACCESS_KEY'),
      endpoint: Deno.env.get('WASABI_ENDPOINT'),
      bucketName: Deno.env.get('WASABI_BUCKET_NAME'),
    }

    if (!wasabiConfig.accessKeyId || !wasabiConfig.secretAccessKey || !wasabiConfig.endpoint || !wasabiConfig.bucketName) {
      return new Response(
        JSON.stringify({ error: 'Wasabi configuration missing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log(`[wasabi-storage] Processing ${action} for user ${user.id}`)

    if (action === 'upload') {
      if (!fileData || !fileName) {
        return new Response(
          JSON.stringify({ error: 'File data and name are required for upload' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Convert base64 to blob
      let fileBlob: Blob
      try {
        if (fileData.startsWith('data:')) {
          const base64Data = fileData.split(',')[1]
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          fileBlob = new Blob([byteArray], { type: fileType || 'application/octet-stream' })
        } else {
          const byteCharacters = atob(fileData)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          fileBlob = new Blob([byteArray], { type: fileType || 'application/octet-stream' })
        }
      } catch (decodeError) {
        console.error('[wasabi-storage] Error decoding file data:', decodeError)
        return new Response(
          JSON.stringify({ error: 'Invalid file data format' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      // Create unique file path
      const timestamp = Date.now()
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${user.id}/${bucketPath || 'uploads'}/${timestamp}-${sanitizedFileName}`

      try {
        // Create AWS signature for upload
        const date = new Date()
        const dateString = date.toISOString().slice(0, 10).replace(/-/g, '')
        const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '')
        
        const region = 'us-east-1' // Wasabi uses us-east-1 for most endpoints
        const service = 's3'
        
        // Create canonical request
        const method = 'PUT'
        const canonicalUri = `/${filePath}`
        const canonicalQueryString = ''
        const canonicalHeaders = `host:${wasabiConfig.endpoint.replace('https://', '')}\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${amzDate}\n`
        const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
        const payloadHash = 'UNSIGNED-PAYLOAD'
        
        const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`
        
        // Create string to sign
        const algorithm = 'AWS4-HMAC-SHA256'
        const credentialScope = `${dateString}/${region}/${service}/aws4_request`
        const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${await sha256(canonicalRequest)}`
        
        // Calculate signature
        const signingKey = await getSignatureKey(wasabiConfig.secretAccessKey!, dateString, region, service)
        const signature = await hmacSha256(signingKey, stringToSign)
        
        // Create authorization header
        const authorizationHeader = `${algorithm} Credential=${wasabiConfig.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
        
        // Upload to Wasabi
        const uploadResponse = await fetch(`${wasabiConfig.endpoint}/${wasabiConfig.bucketName}/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': authorizationHeader,
            'x-amz-content-sha256': payloadHash,
            'x-amz-date': amzDate,
            'Content-Type': fileType || 'application/octet-stream'
          },
          body: fileBlob
        })

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text()
          console.error('[wasabi-storage] Upload failed:', errorText)
          throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`)
        }

        const publicUrl = `${wasabiConfig.endpoint}/${wasabiConfig.bucketName}/${filePath}`
        
        console.log(`[wasabi-storage] File uploaded successfully: ${publicUrl}`)

        // Save to user gallery for tracking
        try {
          await supabaseClient
            .from('user_gallery')
            .insert({
              user_id: user.id,
              file_name: fileName,
              file_url: publicUrl,
              storage_path: filePath,
              file_type: fileType || 'application/octet-stream',
              file_size: fileBlob.size,
              title: `Wasabi Upload: ${fileName}`,
              description: `File uploaded to Wasabi cloud storage`,
              tags: ['wasabi', 'cloud-storage', bucketPath || 'uploads']
            })

          console.log('[wasabi-storage] File saved to gallery')
        } catch (galleryError) {
          console.warn('[wasabi-storage] Failed to save to gallery:', galleryError)
        }

        return new Response(
          JSON.stringify({ 
            success: true,
            url: publicUrl,
            path: filePath,
            fileName: fileName,
            fileType: fileType
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      } catch (uploadError) {
        console.error('[wasabi-storage] Upload error:', uploadError)
        return new Response(
          JSON.stringify({ error: 'Failed to upload to Wasabi', details: uploadError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    if (action === 'list') {
      try {
        const prefix = `${user.id}/${bucketPath || ''}`
        
        // Create AWS signature for list operation
        const date = new Date()
        const dateString = date.toISOString().slice(0, 10).replace(/-/g, '')
        const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '')
        
        const region = 'us-east-1'
        const service = 's3'
        
        const queryParams = new URLSearchParams({
          'list-type': '2',
          'prefix': prefix
        })
        
        const canonicalRequest = `GET\n/\n${queryParams.toString()}\nhost:${wasabiConfig.endpoint.replace('https://', '')}\nx-amz-content-sha256:UNSIGNED-PAYLOAD\nx-amz-date:${amzDate}\n\nhost;x-amz-content-sha256;x-amz-date\nUNSIGNED-PAYLOAD`
        
        const algorithm = 'AWS4-HMAC-SHA256'
        const credentialScope = `${dateString}/${region}/${service}/aws4_request`
        const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${await sha256(canonicalRequest)}`
        
        const signingKey = await getSignatureKey(wasabiConfig.secretAccessKey!, dateString, region, service)
        const signature = await hmacSha256(signingKey, stringToSign)
        
        const authorizationHeader = `${algorithm} Credential=${wasabiConfig.accessKeyId}/${credentialScope}, SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=${signature}`
        
        const listResponse = await fetch(`${wasabiConfig.endpoint}/${wasabiConfig.bucketName}?${queryParams.toString()}`, {
          method: 'GET',
          headers: {
            'Authorization': authorizationHeader,
            'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
            'x-amz-date': amzDate
          }
        })

        if (!listResponse.ok) {
          throw new Error(`List failed: ${listResponse.status}`)
        }

        const listXml = await listResponse.text()
        console.log('[wasabi-storage] Files listed successfully')

        return new Response(
          JSON.stringify({ 
            success: true,
            files: listXml
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      } catch (listError) {
        console.error('[wasabi-storage] List error:', listError)
        return new Response(
          JSON.stringify({ error: 'Failed to list files', details: listError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    console.error('[wasabi-storage] Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

// Helper functions for AWS signature
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hmacSha256(key: ArrayBuffer, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message))
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Promise<ArrayBuffer> {
  const kDate = await hmacSha256ArrayBuffer(new TextEncoder().encode('AWS4' + key), dateStamp)
  const kRegion = await hmacSha256ArrayBuffer(kDate, regionName)
  const kService = await hmacSha256ArrayBuffer(kRegion, serviceName)
  const kSigning = await hmacSha256ArrayBuffer(kService, 'aws4_request')
  return kSigning
}

async function hmacSha256ArrayBuffer(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  return await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message))
}
