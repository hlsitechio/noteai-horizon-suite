import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-id, x-app-version',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

interface DesktopAppRequest {
  action: string;
  deviceId: string;
  appVersion: string;
  platform: string;
  data?: any;
  lastSyncTime?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from auth token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const requestBody: DesktopAppRequest = await req.json()
    const { action, deviceId, appVersion, platform, data, lastSyncTime } = requestBody

    // Validate required fields
    if (!action || !deviceId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: action, deviceId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let response: any = { success: false }

    switch (action) {
      case 'connect':
        // Register desktop app connection
        response = await handleConnect(supabaseClient, user.id, deviceId, appVersion, platform)
        break

      case 'sync_notes':
        // Sync notes with desktop app
        response = await handleSyncNotes(supabaseClient, user.id, lastSyncTime)
        break

      case 'sync_folders':
        // Sync folders with desktop app
        response = await handleSyncFolders(supabaseClient, user.id, lastSyncTime)
        break

      case 'sync_all':
        // Sync all data
        response = await handleSyncAll(supabaseClient, user.id, lastSyncTime)
        break

      case 'create_note':
        // Create new note from desktop
        response = await handleCreateNote(supabaseClient, user.id, data)
        break

      case 'update_note':
        // Update note from desktop
        response = await handleUpdateNote(supabaseClient, user.id, data)
        break

      case 'delete_note':
        // Delete note from desktop
        response = await handleDeleteNote(supabaseClient, user.id, data.noteId)
        break

      case 'get_status':
        // Get sync status
        response = await handleGetStatus(supabaseClient, user.id, deviceId)
        break

      default:
        response = { success: false, error: `Unknown action: ${action}` }
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: response.success ? 200 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Desktop API Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleConnect(supabase: any, userId: string, deviceId: string, appVersion: string, platform: string) {
  try {
    // Log desktop app connection
    console.log(`Desktop app connecting: ${deviceId} (${platform} v${appVersion})`)
    
    return {
      success: true,
      data: {
        userId,
        deviceId,
        connectionTime: new Date().toISOString(),
        serverTime: new Date().toISOString()
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function handleSyncNotes(supabase: any, userId: string, lastSyncTime?: string) {
  try {
    const query = supabase
      .from('notes_v2')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (lastSyncTime) {
      query.gte('updated_at', lastSyncTime)
    }

    const { data: notes, error } = await query

    if (error) throw error

    return {
      success: true,
      data: notes,
      lastSyncTime: new Date().toISOString(),
      count: notes?.length || 0
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function handleSyncFolders(supabase: any, userId: string, lastSyncTime?: string) {
  try {
    const query = supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (lastSyncTime) {
      query.gte('updated_at', lastSyncTime)
    }

    const { data: folders, error } = await query

    if (error) throw error

    return {
      success: true,
      data: folders,
      lastSyncTime: new Date().toISOString(),
      count: folders?.length || 0
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function handleSyncAll(supabase: any, userId: string, lastSyncTime?: string) {
  try {
    const [notesResult, foldersResult] = await Promise.all([
      handleSyncNotes(supabase, userId, lastSyncTime),
      handleSyncFolders(supabase, userId, lastSyncTime)
    ])

    return {
      success: notesResult.success && foldersResult.success,
      data: {
        notes: notesResult.data,
        folders: foldersResult.data
      },
      lastSyncTime: new Date().toISOString(),
      counts: {
        notes: notesResult.count || 0,
        folders: foldersResult.count || 0
      },
      errors: [
        ...(notesResult.success ? [] : [notesResult.error]),
        ...(foldersResult.success ? [] : [foldersResult.error])
      ].filter(Boolean)
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function handleCreateNote(supabase: any, userId: string, noteData: any) {
  try {
    const { data: note, error } = await supabase
      .from('notes_v2')
      .insert({
        ...noteData,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: note,
      lastSyncTime: new Date().toISOString()
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function handleUpdateNote(supabase: any, userId: string, noteData: any) {
  try {
    const { id, ...updateData } = noteData

    const { data: note, error } = await supabase
      .from('notes_v2')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data: note,
      lastSyncTime: new Date().toISOString()
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function handleDeleteNote(supabase: any, userId: string, noteId: string) {
  try {
    const { error } = await supabase
      .from('notes_v2')
      .delete()
      .eq('id', noteId)
      .eq('user_id', userId)

    if (error) throw error

    return {
      success: true,
      data: { id: noteId, deleted: true },
      lastSyncTime: new Date().toISOString()
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function handleGetStatus(supabase: any, userId: string, deviceId: string) {
  try {
    // Get user's latest activity
    const { data: notes, error: notesError } = await supabase
      .from('notes_v2')
      .select('updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)

    const { data: folders, error: foldersError } = await supabase
      .from('folders')
      .select('updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)

    if (notesError || foldersError) {
      throw new Error('Failed to get status')
    }

    return {
      success: true,
      data: {
        userId,
        deviceId,
        serverTime: new Date().toISOString(),
        lastNoteUpdate: notes?.[0]?.updated_at || null,
        lastFolderUpdate: folders?.[0]?.updated_at || null
      }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}