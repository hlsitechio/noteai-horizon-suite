import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    console.log(`Initializing dashboard for user: ${user.id}`);

    // 1. Create user-specific storage bucket for dashboard banners
    const bannerBucketName = `user-${user.id}-banners`;
    
    // Check if bucket already exists
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bannerBucketName);
    
    if (!bucketExists) {
      const { error: bucketError } = await supabase.storage.createBucket(bannerBucketName, {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*'],
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (bucketError) {
        console.error('Error creating banner bucket:', bucketError);
      } else {
        console.log(`Created banner bucket: ${bannerBucketName}`);
      }
    }

    // 2. Create user-specific storage bucket for notes attachments
    const attachmentsBucketName = `user-${user.id}-attachments`;
    const attachmentBucketExists = existingBuckets?.some(bucket => bucket.name === attachmentsBucketName);
    
    if (!attachmentBucketExists) {
      const { error: attachmentBucketError } = await supabase.storage.createBucket(attachmentsBucketName, {
        public: false,
        allowedMimeTypes: ['image/*', 'application/pdf', 'text/*', 'audio/*'],
        fileSizeLimit: 104857600 // 100MB
      });
      
      if (attachmentBucketError) {
        console.error('Error creating attachments bucket:', attachmentBucketError);
      } else {
        console.log(`Created attachments bucket: ${attachmentsBucketName}`);
      }
    }

    // 3. Create user-specific Wasabi bucket and initialize storage quota
    const wasabiInitialized = await initializeWasabiStorage(user.id, supabase);
    console.log('Wasabi storage initialization:', wasabiInitialized ? 'Success' : 'Failed');

    // 4. Initialize default dashboard settings
    const { error: dashboardError } = await supabase
      .from('dashboard_settings')
      .upsert({
        user_id: user.id,
        settings: {
          initialized: true,
          theme: 'default',
          layout: 'standard'
        },
        sidebar_panel_sizes: {
          banner: 30,
          content: 70
        }
      }, { onConflict: 'user_id' });

    if (dashboardError) {
      console.error('Error creating dashboard settings:', dashboardError);
    } else {
      console.log('Dashboard settings initialized');
    }

    // 5. Create default user preferences
    const { error: preferencesError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        ai_suggestions_enabled: true,
        auto_save_enabled: true,
        smart_formatting_enabled: true,
        context_awareness_enabled: true,
        backup_to_cloud_enabled: true,
        weather_enabled: true,
        weather_city: 'New York',
        weather_units: 'celsius',
        ai_model: 'gpt-4o-mini'
      }, { onConflict: 'user_id' });

    if (preferencesError) {
      console.error('Error creating user preferences:', preferencesError);
    } else {
      console.log('User preferences initialized');
    }

    // 6. Create a default "Getting Started" folder
    const { error: folderError } = await supabase
      .from('folders')
      .insert({
        user_id: user.id,
        name: 'Getting Started',
        parent_folder_id: null
      });

    if (folderError) {
      console.error('Error creating default folder:', folderError);
    } else {
      console.log('Default folder created');
    }

    // 7. Create a welcome note
    const { error: noteError } = await supabase
      .from('notes_v2')
      .insert({
        user_id: user.id,
        title: 'Welcome to Your Dashboard!',
        content: `# Welcome to Online Note AI! 🎉

Congratulations! Your dashboard has been successfully initialized. Here's what has been set up for you:

## 🗂️ Storage & Organization
- **Personal storage buckets** for your banners and attachments
- **Personal Wasabi cloud storage** with 1GB quota for file uploads
- **Default folder structure** to keep your notes organized
- **Smart tagging system** to help you find content quickly

## ⚙️ Customization Options
- **Dashboard settings** configured with optimal defaults
- **Personal preferences** tailored for productivity
- **Flexible layout options** to match your workflow

## 🚀 Getting Started
1. **Create your first note** by clicking the + button
2. **Customize your banner** in the layout settings
3. **Explore AI features** for smart note assistance
4. **Set up folders** to organize your content
5. **Upload files** to your personal cloud storage

## 💡 Pro Tips
- Use the search function to quickly find any note
- Try the AI-powered suggestions for better organization
- Customize your dashboard layout to fit your needs
- Enable notifications for important reminders
- Your cloud storage quota resets monthly

Ready to boost your productivity? Start creating amazing content!`,
        content_type: 'rich_text',
        is_favorite: true
      });

    if (noteError) {
      console.error('Error creating welcome note:', noteError);
    } else {
      console.log('Welcome note created');
    }

    // 8. Initialize user activity tracking
    const { error: activityError } = await supabase
      .from('user_activities')
      .insert({
        user_id: user.id,
        activity_type: 'dashboard_initialization',
        activity_title: 'Dashboard Initialized',
        activity_description: 'User dashboard has been successfully set up with all necessary resources',
        metadata: {
          timestamp: new Date().toISOString(),
          buckets_created: [bannerBucketName, attachmentsBucketName],
          wasabi_storage_initialized: wasabiInitialized,
          settings_initialized: true
        }
      });

    if (activityError) {
      console.error('Error logging initialization activity:', activityError);
    }

    const response = {
      success: true,
      message: 'Dashboard initialized successfully!',
      data: {
        user_id: user.id,
        buckets_created: [bannerBucketName, attachmentsBucketName],
        wasabi_storage_initialized: wasabiInitialized,
        settings_initialized: true,
        welcome_note_created: !noteError,
        timestamp: new Date().toISOString()
      }
    };

    console.log('Dashboard initialization completed:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Error in initialize-user-dashboard function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Initialize Wasabi storage for user
async function initializeWasabiStorage(userId: string, supabase: any): Promise<boolean> {
  try {
    // Get Wasabi configuration
    const wasabiAccessKeyId = Deno.env.get('WASABI_ACCESS_KEY_ID');
    const wasabiSecretAccessKey = Deno.env.get('WASABI_SECRET_ACCESS_KEY');
    const wasabiEndpoint = Deno.env.get('WASABI_ENDPOINT');
    const wasabiRegion = Deno.env.get('WASABI_REGION') || 'us-east-1';

    if (!wasabiAccessKeyId || !wasabiSecretAccessKey || !wasabiEndpoint) {
      console.error('Missing Wasabi configuration');
      return false;
    }

    const userBucketName = `user-${userId}-storage`;

    // Create Wasabi bucket
    const bucketCreated = await createWasabiBucket(
      userBucketName,
      wasabiAccessKeyId,
      wasabiSecretAccessKey,
      wasabiEndpoint,
      wasabiRegion
    );

    if (!bucketCreated) {
      console.error('Failed to create Wasabi bucket');
      return false;
    }

    // Initialize storage quota tracking
    const { error: quotaError } = await supabase
      .from('user_storage_quotas')
      .upsert({
        user_id: userId,
        total_quota_mb: 1024, // 1GB default quota
        used_storage_mb: 0,
        bucket_name: userBucketName
      });

    if (quotaError) {
      console.error('Failed to initialize storage quota:', quotaError);
      return false;
    }

    console.log(`Wasabi storage initialized for user: ${userId}, bucket: ${userBucketName}`);
    return true;
  } catch (error) {
    console.error('Error initializing Wasabi storage:', error);
    return false;
  }
}

// Create Wasabi bucket with proper configuration
async function createWasabiBucket(
  bucketName: string,
  accessKeyId: string,
  secretAccessKey: string,
  endpoint: string,
  region: string
): Promise<boolean> {
  try {
    console.log(`Creating Wasabi bucket: ${bucketName}`);
    
    const host = new URL(endpoint).hostname;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const timeStr = now.toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z';
    
    const method = 'PUT';
    const canonicalUri = `/${bucketName}`;
    const canonicalQueryString = '';
    
    const canonicalHeaders = [
      `host:${host}`,
      `x-amz-date:${timeStr}`
    ].join('\n') + '\n';
    
    const signedHeaders = 'host;x-amz-date';
    const payloadHash = await sha256('');
    
    const canonicalRequest = [
      method,
      canonicalUri,
      canonicalQueryString,
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n');

    const credentialScope = `${dateStr}/${region}/s3/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timeStr,
      credentialScope,
      await sha256(canonicalRequest)
    ].join('\n');

    const signingKey = await getSignatureKey(secretAccessKey, dateStr, region, 's3');
    const signature = await hmacSha256(signingKey, stringToSign);
    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const createUrl = `${endpoint}/${bucketName}`;
    
    const response = await fetch(createUrl, {
      method: 'PUT',
      headers: {
        'Authorization': authorization,
        'X-Amz-Date': timeStr,
        'Content-Length': '0'
      }
    });

    if (response.ok || response.status === 409) { // 409 means bucket already exists
      console.log('Wasabi bucket created or already exists');
      return true;
    } else {
      const errorText = await response.text();
      console.error('Wasabi bucket creation failed:', response.status, errorText);
      return false;
    }
  } catch (error) {
    console.error('Error creating Wasabi bucket:', error);
    return false;
  }
}

// Helper functions for AWS Signature Version 4
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(key: ArrayBuffer, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
  const signatureArray = Array.from(new Uint8Array(signature));
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Promise<ArrayBuffer> {
  const kDate = await hmacSha256ArrayBuffer(new TextEncoder().encode('AWS4' + key), dateStamp);
  const kRegion = await hmacSha256ArrayBuffer(kDate, regionName);
  const kService = await hmacSha256ArrayBuffer(kRegion, serviceName);
  const kSigning = await hmacSha256ArrayBuffer(kService, 'aws4_request');
  return kSigning;
}

async function hmacSha256ArrayBuffer(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  return await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}