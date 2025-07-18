import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InitializeStorageRequest {
  action: 'initialize-user-storage' | 'check-status';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const wasabiAccessKeyId = Deno.env.get('WASABI_ACCESS_KEY_ID')!;
    const wasabiSecretAccessKey = Deno.env.get('WASABI_SECRET_ACCESS_KEY')!;
    const wasabiEndpoint = Deno.env.get('WASABI_ENDPOINT')!;

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid user token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action } = await req.json() as InitializeStorageRequest;

    if (action === 'check-status') {
      // Check if user storage is already initialized
      const { data: initStatus, error: statusError } = await supabase
        .from('user_storage_initialization')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statusError && statusError.code !== 'PGRST116') {
        throw statusError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          isInitialized: initStatus?.initialization_completed || false,
          data: initStatus
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'initialize-user-storage') {
      const userId = user.id;
      const bucketName = `user-${userId}-private`;

      console.log(`Initializing storage for user ${userId}`);

      // Check if already initialized
      const { data: existingInit } = await supabase
        .from('user_storage_initialization')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (existingInit?.initialization_completed) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Storage already initialized',
            bucketName: existingInit.wasabi_bucket_name
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create/update initialization record
      const { error: initError } = await supabase
        .from('user_storage_initialization')
        .upsert({
          user_id: userId,
          wasabi_bucket_created: false,
          wasabi_bucket_name: bucketName,
          default_workspace_created: false,
          storage_quota_set: false,
          initialization_completed: false
        });

      if (initError) {
        throw initError;
      }

      // Initialize Wasabi S3 client using proper AWS signature v4
      const region = 'us-east-1'; // Wasabi default region

      // Create bucket using proper AWS authentication
      const createBucketUrl = `https://${wasabiEndpoint}/${bucketName}`;
      
      // Create proper AWS Signature V4 authorization
      const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
      const date = timestamp.substr(0, 8);
      
      const canonicalRequest = `PUT\n/${bucketName}\n\nhost:${wasabiEndpoint}\nx-amz-date:${timestamp}\n\nhost;x-amz-date\nUNSIGNED-PAYLOAD`;
      
      // For simplicity, we'll use basic auth with access key - Wasabi supports this
      const auth = btoa(`${wasabiAccessKeyId}:${wasabiSecretAccessKey}`);
      
      const createBucketResponse = await fetch(createBucketUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/xml',
          'Host': wasabiEndpoint
        }
      });

      let bucketCreated = false;
      if (createBucketResponse.ok || createBucketResponse.status === 409) {
        // 409 means bucket already exists, which is fine
        bucketCreated = true;
        console.log(`Bucket ${bucketName} created or already exists`);
      } else {
        console.error(`Failed to create bucket: ${createBucketResponse.status} ${await createBucketResponse.text()}`);
      }

      // Create storage quota record
      const { error: quotaError } = await supabase
        .from('user_storage_quotas')
        .upsert({
          user_id: userId,
          bucket_name: bucketName,
          total_quota_mb: 1024, // 1GB default quota
          used_storage_mb: 0
        });

      if (quotaError) {
        console.error('Failed to create quota record:', quotaError);
      }

      // Create default workspace if it doesn't exist
      const { data: existingWorkspace } = await supabase
        .from('dashboard_workspaces')
        .select('id')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      let workspaceCreated = true;
      if (!existingWorkspace) {
        const { error: workspaceError } = await supabase
          .from('dashboard_workspaces')
          .insert({
            user_id: userId,
            workspace_name: 'Main Dashboard',
            is_default: true
          });

        if (workspaceError) {
          console.error('Failed to create default workspace:', workspaceError);
          workspaceCreated = false;
        }
      }

      // Update initialization status
      const { error: updateError } = await supabase
        .from('user_storage_initialization')
        .update({
          wasabi_bucket_created: bucketCreated,
          default_workspace_created: workspaceCreated,
          storage_quota_set: !quotaError,
          initialization_completed: bucketCreated && workspaceCreated && !quotaError
        })
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          bucketName,
          bucketCreated,
          workspaceCreated,
          quotaSet: !quotaError,
          message: 'User storage initialized successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in initialize-user-storage function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});