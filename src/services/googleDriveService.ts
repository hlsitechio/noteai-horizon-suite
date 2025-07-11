import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type GoogleDriveSettings = Tables<'google_drive_settings'>;
type GoogleDriveSettingsInsert = TablesInsert<'google_drive_settings'>;
type GoogleDriveSettingsUpdate = TablesUpdate<'google_drive_settings'>;

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink?: string;
}

export class GoogleDriveService {
  static async getUserSettings(): Promise<GoogleDriveSettings | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return null;

      const { data, error } = await supabase
        .from('google_drive_settings')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching Google Drive settings:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching Google Drive settings:', error);
      return null;
    }
  }

  static async saveSettings(settings: Partial<GoogleDriveSettingsInsert & GoogleDriveSettingsUpdate>): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const existingSettings = await this.getUserSettings();

      if (existingSettings) {
        const { error } = await supabase
          .from('google_drive_settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.user.id);

        if (error) {
          console.error('Error updating Google Drive settings:', error);
          return false;
        }
      } else {
        const { error } = await supabase
          .from('google_drive_settings')
          .insert({
            ...settings,
            user_id: user.user.id
          });

        if (error) {
          console.error('Error inserting Google Drive settings:', error);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error saving Google Drive settings:', error);
      return false;
    }
  }

  static async initiateOAuth(): Promise<string> {
    // Get client ID from edge function or environment
    const clientId = '1050262574987-ld7p7mmpd58o4aob49uf5lh0q1et8jbi.apps.googleusercontent.com'; // Replace with your actual client ID
    const redirectUri = `${window.location.origin}/settings?tab=drive&auth=callback`;
    const scope = 'https://www.googleapis.com/auth/drive.file';
    const responseType = 'code';
    const state = Math.random().toString(36).substring(2, 15);

    // Store state for verification
    sessionStorage.setItem('google_drive_oauth_state', state);

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=${responseType}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`;

    return authUrl;
  }

  static async handleOAuthCallback(code: string, state: string): Promise<boolean> {
    try {
      const storedState = sessionStorage.getItem('google_drive_oauth_state');
      if (state !== storedState) {
        console.error('OAuth state mismatch');
        return false;
      }

      // Call edge function to exchange code for tokens
      const { data, error } = await supabase.functions.invoke('google-drive-auth', {
        body: { code }
      });

      if (error) {
        console.error('Failed to exchange code for tokens:', error);
        return false;
      }

      const { access_token, refresh_token, expires_at } = data;

      // Save tokens to database
      await this.saveSettings({
        access_token,
        refresh_token,
        token_expires_at: expires_at,
        sync_enabled: true
      });

      // Clean up
      sessionStorage.removeItem('google_drive_oauth_state');

      return true;
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      return false;
    }
  }

  static async refreshToken(): Promise<boolean> {
    try {
      const settings = await this.getUserSettings();
      if (!settings?.refresh_token) return false;

      const { data, error } = await supabase.functions.invoke('google-drive-refresh', {
        body: { refresh_token: settings.refresh_token }
      });

      if (error) return false;

      const { access_token, expires_at } = data;

      await this.saveSettings({
        access_token,
        token_expires_at: expires_at
      });

      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  static async createFolder(name: string, parentId?: string): Promise<GoogleDriveFolder | null> {
    try {
      const settings = await this.getUserSettings();
      if (!settings?.access_token) return null;

      const { data, error } = await supabase.functions.invoke('google-drive-folder', {
        body: { 
          name, 
          parentId: parentId || settings.drive_folder_id 
        }
      });

      if (error) return null;

      return data;
    } catch (error) {
      console.error('Error creating folder:', error);
      return null;
    }
  }

  static async uploadFile(file: File, folderId?: string): Promise<GoogleDriveFile | null> {
    try {
      const settings = await this.getUserSettings();
      if (!settings?.access_token) return null;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderId', folderId || settings.drive_folder_id || '');

      const { data, error } = await supabase.functions.invoke('google-drive-upload', {
        body: formData
      });

      if (error) return null;

      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  static async listFiles(folderId?: string): Promise<GoogleDriveFile[]> {
    try {
      const settings = await this.getUserSettings();
      if (!settings?.access_token) return [];

      const { data, error } = await supabase.functions.invoke('google-drive-files', {
        body: { 
          folderId: folderId || settings.drive_folder_id 
        }
      });

      if (error) return [];

      return data?.files || [];
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  static async downloadFile(fileId: string): Promise<Blob | null> {
    try {
      const settings = await this.getUserSettings();
      if (!settings?.access_token) return null;

      const { data, error } = await supabase.functions.invoke('google-drive-download', {
        body: { fileId }
      });

      if (error) return null;

      // Convert the response to blob if it's not already
      if (data instanceof Blob) {
        return data;
      } else {
        return new Blob([data]);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }

  static async deleteFile(fileId: string): Promise<boolean> {
    try {
      const settings = await this.getUserSettings();
      if (!settings?.access_token) return false;

      const { error } = await supabase.functions.invoke('google-drive-delete', {
        body: { fileId }
      });

      return !error;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  static async disconnectAccount(): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const { error } = await supabase
        .from('google_drive_settings')
        .delete()
        .eq('user_id', user.user.id);

      if (error) {
        console.error('Error disconnecting Google Drive account:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error disconnecting Google Drive account:', error);
      return false;
    }
  }
}