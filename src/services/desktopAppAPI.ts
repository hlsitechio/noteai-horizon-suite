import { supabase } from '@/integrations/supabase/client';

// Desktop App API Bridge
// This service provides APIs that a Windows desktop app can connect to

export interface DesktopAppConnection {
  userId: string;
  deviceId: string;
  appVersion: string;
  platform: 'windows' | 'macos' | 'linux';
  connectionTime: Date;
}

export interface SyncRequest {
  action: 'sync_notes' | 'sync_folders' | 'sync_settings' | 'sync_all';
  lastSyncTime?: string;
  data?: any;
}

export interface SyncResponse {
  success: boolean;
  data?: any;
  lastSyncTime: string;
  errors?: string[];
}

class DesktopAppAPIService {
  private connections = new Map<string, DesktopAppConnection>();
  private realtimeChannel: any = null;

  // Initialize connection for desktop app
  async initializeConnection(deviceId: string, appVersion: string, platform: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const connection: DesktopAppConnection = {
        userId: user.id,
        deviceId,
        appVersion,
        platform: platform as any,
        connectionTime: new Date()
      };

      this.connections.set(deviceId, connection);

      // Real-time connection removed - WebSockets not supported
      console.warn('Desktop app real-time connection removed');

      console.log(`Desktop app connected: ${deviceId}`);
      return true;
    } catch (error) {
      console.error('Failed to initialize desktop connection:', error);
      return false;
    }
  }

  // Real-time sync functionality removed
  private setupRealtimeConnection(userId: string, deviceId: string) {
    // Real-time connection completely removed
    this.realtimeChannel = null;
  }

  // Handle real-time changes for desktop app
  private handleRealtimeChange(type: string, payload: any) {
    console.log(`Realtime change for desktop app - ${type}:`, payload);
    
    // This would notify connected desktop apps
    // For now, we'll just log the changes
    this.broadcastToDesktopApps({
      type: 'realtime_update',
      table: type,
      action: payload.eventType,
      data: payload.new || payload.old
    });
  }

  // Broadcast updates to all connected desktop apps
  private broadcastToDesktopApps(message: any) {
    this.connections.forEach((connection, deviceId) => {
      console.log(`Broadcasting to desktop app ${deviceId}:`, message);
      // In a real implementation, this would use WebSockets or Server-Sent Events
    });
  }

  // Sync notes with desktop app
  async syncNotes(deviceId: string, lastSyncTime?: string): Promise<SyncResponse> {
    try {
      const connection = this.connections.get(deviceId);
      if (!connection) {
        throw new Error('Desktop app not connected');
      }

      const { data: notes, error } = await supabase
        .from('notes_v2')
        .select('*')
        .eq('user_id', connection.userId)
        .gte('updated_at', lastSyncTime || '1970-01-01')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: notes,
        lastSyncTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to sync notes:', error);
      return {
        success: false,
        lastSyncTime: new Date().toISOString(),
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Sync folders with desktop app
  async syncFolders(deviceId: string, lastSyncTime?: string): Promise<SyncResponse> {
    try {
      const connection = this.connections.get(deviceId);
      if (!connection) {
        throw new Error('Desktop app not connected');
      }

      const { data: folders, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', connection.userId)
        .gte('updated_at', lastSyncTime || '1970-01-01')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: folders,
        lastSyncTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to sync folders:', error);
      return {
        success: false,
        lastSyncTime: new Date().toISOString(),
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Handle sync request from desktop app
  async handleSyncRequest(deviceId: string, request: SyncRequest): Promise<SyncResponse> {
    switch (request.action) {
      case 'sync_notes':
        return this.syncNotes(deviceId, request.lastSyncTime);
      
      case 'sync_folders':
        return this.syncFolders(deviceId, request.lastSyncTime);
      
      case 'sync_all':
        const [notesResult, foldersResult] = await Promise.all([
          this.syncNotes(deviceId, request.lastSyncTime),
          this.syncFolders(deviceId, request.lastSyncTime)
        ]);
        
        return {
          success: notesResult.success && foldersResult.success,
          data: {
            notes: notesResult.data,
            folders: foldersResult.data
          },
          lastSyncTime: new Date().toISOString(),
          errors: [...(notesResult.errors || []), ...(foldersResult.errors || [])]
        };
      
      default:
        return {
          success: false,
          lastSyncTime: new Date().toISOString(),
          errors: [`Unknown sync action: ${request.action}`]
        };
    }
  }

  // Create new note from desktop app
  async createNoteFromDesktop(deviceId: string, noteData: any): Promise<SyncResponse> {
    try {
      const connection = this.connections.get(deviceId);
      if (!connection) {
        throw new Error('Desktop app not connected');
      }

      const { data: note, error } = await supabase
        .from('notes_v2')
        .insert({
          ...noteData,
          user_id: connection.userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: note,
        lastSyncTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to create note from desktop:', error);
      return {
        success: false,
        lastSyncTime: new Date().toISOString(),
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Update note from desktop app
  async updateNoteFromDesktop(deviceId: string, noteId: string, noteData: any): Promise<SyncResponse> {
    try {
      const connection = this.connections.get(deviceId);
      if (!connection) {
        throw new Error('Desktop app not connected');
      }

      const { data: note, error } = await supabase
        .from('notes_v2')
        .update({
          ...noteData,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .eq('user_id', connection.userId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: note,
        lastSyncTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to update note from desktop:', error);
      return {
        success: false,
        lastSyncTime: new Date().toISOString(),
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // Get connection status
  getConnectionStatus(deviceId: string): DesktopAppConnection | null {
    return this.connections.get(deviceId) || null;
  }

  // Disconnect desktop app
  disconnect(deviceId: string): boolean {
    const connection = this.connections.get(deviceId);
    if (connection) {
      this.connections.delete(deviceId);
      
      if (this.realtimeChannel) {
        supabase.removeChannel(this.realtimeChannel);
        this.realtimeChannel = null;
      }
      
      console.log(`Desktop app disconnected: ${deviceId}`);
      return true;
    }
    return false;
  }

  // Get all active connections
  getActiveConnections(): DesktopAppConnection[] {
    return Array.from(this.connections.values());
  }
}

// Export singleton instance
export const desktopAppAPI = new DesktopAppAPIService();