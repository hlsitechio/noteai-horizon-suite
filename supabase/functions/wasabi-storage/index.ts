import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    // Get the Authorization header from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the user from the JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authorization token')
    }

    console.log('Authenticated user:', user.id)

    const requestBody = await req.json()
    const { action, fileData, fileName, fileType, bucketPath } = requestBody

    // Get Wasabi configuration
    const wasabiAccessKeyId = Deno.env.get('WASABI_ACCESS_KEY_ID')!
    const wasabiSecretAccessKey = Deno.env.get('WASABI_SECRET_ACCESS_KEY')!
    const wasabiEndpoint = Deno.env.get('WASABI_ENDPOINT')!
    const wasabiRegion = Deno.env.get('WASABI_REGION') || 'us-east-1'

    if (!wasabiAccessKeyId || !wasabiSecretAccessKey || !wasabiEndpoint) {
      throw new Error('Missing Wasabi configuration')
    }

    console.log('Wasabi config loaded, endpoint:', wasabiEndpoint)

    // User-specific bucket name
    const userBucketName = `user-${user.id}-storage`

    if (action === 'create-bucket') {
      console.log('Creating user bucket:', userBucketName)
      
      try {
        const bucketCreated = await createWasabiBucket(userBucketName, wasabiAccessKeyId, wasabiSecretAccessKey, wasabiEndpoint, wasabiRegion)
        
        if (bucketCreated) {
          // Initialize storage quota tracking
          const { error: quotaError } = await supabase
            .from('user_storage_quotas')
            .upsert({
              user_id: user.id,
              total_quota_mb: 1024, // 1GB default quota
              used_storage_mb: 0,
              bucket_name: userBucketName
            })

          if (quotaError) {
            console.error('Failed to initialize storage quota:', quotaError)
          }

          return new Response(JSON.stringify({
            success: true,
            bucketName: userBucketName,
            message: 'User bucket created successfully'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        } else {
          throw new Error('Failed to create bucket')
        }
      } catch (error) {
        console.error('Bucket creation failed:', error)
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    if (action === 'check-quota') {
      const { data: quota } = await supabase
        .from('user_storage_quotas')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      return new Response(JSON.stringify({
        success: true,
        quota: quota || { total_quota_mb: 1024, used_storage_mb: 0 }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'upload') {
      if (!fileData || !fileName) {
        throw new Error('Missing file data or filename')
      }

      console.log('Processing upload for file:', fileName)

      // Check storage quota first
      const { data: quota } = await supabase
        .from('user_storage_quotas')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      const fileBuffer = Uint8Array.from(atob(fileData), c => c.charCodeAt(0))
      const fileSizeMB = fileBuffer.length / (1024 * 1024)
      
      if (quota && (quota.used_storage_mb + fileSizeMB) > quota.total_quota_mb) {
        throw new Error(`Storage quota exceeded. Used: ${quota.used_storage_mb.toFixed(2)}MB, Available: ${quota.total_quota_mb}MB, Trying to upload: ${fileSizeMB.toFixed(2)}MB`)
      }

      // Decode base64 file data
      const blob = new Blob([fileBuffer], { type: fileType || 'application/octet-stream' })

      // Create a unique file path
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const uniqueFileName = `${timestamp}-${fileName}`
      const fullPath = bucketPath ? `${bucketPath}/${uniqueFileName}` : uniqueFileName

      console.log('Full path for upload:', fullPath)

      // Upload to user-specific bucket
      const uploadResult = await uploadToWasabi(
        userBucketName,
        fullPath,
        blob,
        fileType || 'application/octet-stream',
        wasabiAccessKeyId,
        wasabiSecretAccessKey,
        wasabiEndpoint,
        wasabiRegion
      )

      if (!uploadResult.success) {
        throw new Error(uploadResult.error)
      }

      console.log('File uploaded successfully')

      const fileUrl = `${wasabiEndpoint}/${userBucketName}/${fullPath}`

      // Save file metadata to Supabase
      const { error: insertError } = await supabase
        .from('user_gallery')
        .insert({
          user_id: user.id,
          file_name: uniqueFileName,
          file_url: fileUrl,
          file_type: fileType || 'application/octet-stream',
          file_size: blob.size,
          storage_path: fullPath
        })

      if (insertError) {
        console.error('Failed to save metadata:', insertError)
        throw new Error(`Failed to save file metadata: ${insertError.message}`)
      }

      // Update storage quota
      if (quota) {
        const { error: quotaUpdateError } = await supabase
          .from('user_storage_quotas')
          .update({
            used_storage_mb: quota.used_storage_mb + fileSizeMB
          })
          .eq('user_id', user.id)

        if (quotaUpdateError) {
          console.error('Failed to update storage quota:', quotaUpdateError)
        }
      }

      console.log('Metadata saved successfully')

      return new Response(JSON.stringify({
        success: true,
        url: fileUrl,
        path: fullPath,
        fileName: uniqueFileName,
        fileType: fileType || 'application/octet-stream',
        quotaUsed: quota ? quota.used_storage_mb + fileSizeMB : fileSizeMB
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    } else if (action === 'list') {
      console.log('Listing files from user bucket:', userBucketName)
      
      const listResult = await listWasabiFiles(
        userBucketName,
        bucketPath || '',
        wasabiAccessKeyId,
        wasabiSecretAccessKey,
        wasabiEndpoint,
        wasabiRegion
      )

      if (!listResult.success) {
        throw new Error(listResult.error)
      }

      console.log('Files listed successfully')

      return new Response(JSON.stringify({
        success: true,
        data: listResult.data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

// Create Wasabi bucket with proper configuration
async function createWasabiBucket(
  bucketName: string,
  accessKeyId: string,
  secretAccessKey: string,
  endpoint: string,
  region: string
): Promise<boolean> {
  try {
    console.log(`Creating bucket: ${bucketName}`)
    
    const host = new URL(endpoint).hostname
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const timeStr = now.toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z'
    
    const method = 'PUT'
    const canonicalUri = `/${bucketName}`
    const canonicalQueryString = ''
    
    const canonicalHeaders = [
      `host:${host}`,
      `x-amz-date:${timeStr}`
    ].join('\n') + '\n'
    
    const signedHeaders = 'host;x-amz-date'
    const payloadHash = await sha256('')
    
    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n')

    const credentialScope = `${dateStr}/${region}/s3/aws4_request`
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timeStr,
      credentialScope,
      await sha256(canonicalRequest)
    ].join('\n')

    const signingKey = await getSignatureKey(secretAccessKey, dateStr, region, 's3')
    const signature = await hmacSha256(signingKey, stringToSign)
    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    const createUrl = `${endpoint}/${bucketName}`
    
    const response = await fetch(createUrl, {
      method: 'PUT',
      headers: {
        'Authorization': authorization,
        'X-Amz-Date': timeStr,
        'Content-Length': '0'
      }
    })

    if (response.ok || response.status === 409) { // 409 means bucket already exists
      console.log('Bucket created or already exists')
      return true
    } else {
      const errorText = await response.text()
      console.error('Bucket creation failed:', response.status, errorText)
      return false
    }
  } catch (error) {
    console.error('Error creating bucket:', error)
    return false
  }
}

// Upload file to Wasabi
async function uploadToWasabi(
  bucketName: string,
  filePath: string,
  blob: Blob,
  contentType: string,
  accessKeyId: string,
  secretAccessKey: string,
  endpoint: string,
  region: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const host = new URL(endpoint).hostname
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const timeStr = now.toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z'
    
    const method = 'PUT'
    const canonicalUri = `/${bucketName}/${filePath}`
    const canonicalQueryString = ''
    
    const canonicalHeaders = [
      `host:${host}`,
      `x-amz-content-sha256:UNSIGNED-PAYLOAD`,
      `x-amz-date:${timeStr}`
    ].join('\n') + '\n'
    
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'
    const payloadHash = 'UNSIGNED-PAYLOAD'
    
    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n')

    const credentialScope = `${dateStr}/${region}/s3/aws4_request`
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timeStr,
      credentialScope,
      await sha256(canonicalRequest)
    ].join('\n')

    const signingKey = await getSignatureKey(secretAccessKey, dateStr, region, 's3')
    const signature = await hmacSha256(signingKey, stringToSign)
    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    const uploadUrl = `${endpoint}/${bucketName}/${filePath}`
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': authorization,
        'X-Amz-Date': timeStr,
        'X-Amz-Content-Sha256': payloadHash,
        'Content-Type': contentType
      },
      body: blob
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Upload failed:', uploadResponse.status, errorText)
      return { success: false, error: `Upload failed: ${uploadResponse.status} ${errorText}` }
    }

    return { success: true }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }
}

// List files from Wasabi bucket
async function listWasabiFiles(
  bucketName: string,
  prefix: string,
  accessKeyId: string,
  secretAccessKey: string,
  endpoint: string,
  region: string
): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const host = new URL(endpoint).hostname
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const timeStr = now.toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z'
    
    const method = 'GET'
    const canonicalUri = `/${bucketName}/`
    const canonicalQueryString = prefix ? `prefix=${encodeURIComponent(prefix)}` : ''
    
    const canonicalHeaders = [
      `host:${host}`,
      `x-amz-date:${timeStr}`
    ].join('\n') + '\n'
    
    const signedHeaders = 'host;x-amz-date'
    const payloadHash = await sha256('')
    
    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n')

    const credentialScope = `${dateStr}/${region}/s3/aws4_request`
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timeStr,
      credentialScope,
      await sha256(canonicalRequest)
    ].join('\n')

    const signingKey = await getSignatureKey(secretAccessKey, dateStr, region, 's3')
    const signature = await hmacSha256(signingKey, stringToSign)
    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    const listUrl = `${endpoint}/${bucketName}/${canonicalQueryString ? '?' + canonicalQueryString : ''}`
    
    const listResponse = await fetch(listUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'X-Amz-Date': timeStr
      }
    })

    if (!listResponse.ok) {
      const errorText = await listResponse.text()
      console.error('List failed:', listResponse.status, errorText)
      return { success: false, error: `Failed to list files: ${listResponse.status} ${errorText}` }
    }

    const xmlData = await listResponse.text()
    return { success: true, data: xmlData }
  } catch (error) {
    console.error('List error:', error)
    return { success: false, error: error.message }
  }
}

// Helper functions for AWS Signature Version 4
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
  const signatureArray = Array.from(new Uint8Array(signature))
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('')
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