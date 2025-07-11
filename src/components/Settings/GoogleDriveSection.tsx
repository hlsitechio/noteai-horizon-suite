import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { GoogleDriveService, GoogleDriveFile, GoogleDriveFolder } from '@/services/googleDriveService';
import { useToast } from '@/hooks/use-toast';
import { 
  Cloud, 
  CloudOff, 
  FolderPlus, 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  Image, 
  Video,
  Music,
  Archive,
  File,
  ExternalLink,
  Loader2
} from 'lucide-react';

export const GoogleDriveSection: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [folderName, setFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
    
    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const authParam = urlParams.get('auth');
    
    if (code && state && authParam === 'callback') {
      handleOAuthCallback(code, state);
    }
  }, []);

  useEffect(() => {
    if (isConnected && settings) {
      loadFiles();
    }
  }, [isConnected, settings]);

  const loadSettings = async () => {
    try {
      const userSettings = await GoogleDriveService.getUserSettings();
      setSettings(userSettings);
      setIsConnected(!!userSettings?.access_token);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFiles = async () => {
    try {
      const fileList = await GoogleDriveService.listFiles();
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load files from Google Drive",
        variant: "destructive"
      });
    }
  };

  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      const success = await GoogleDriveService.handleOAuthCallback(code, state);
      if (success) {
        toast({
          title: "Success",
          description: "Google Drive connected successfully!"
        });
        await loadSettings();
        // Remove URL parameters
        window.history.replaceState({}, document.title, window.location.pathname + '?tab=drive');
      } else {
        toast({
          title: "Error",
          description: "Failed to connect Google Drive",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      toast({
        title: "Error",
        description: "Failed to connect Google Drive",
        variant: "destructive"
      });
    }
  };

  const handleConnect = async () => {
    try {
      const authUrl = await GoogleDriveService.initiateOAuth();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating OAuth:', error);
      toast({
        title: "Error",
        description: "Failed to initiate Google Drive connection",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      const success = await GoogleDriveService.disconnectAccount();
      if (success) {
        setIsConnected(false);
        setSettings(null);
        setFiles([]);
        toast({
          title: "Success",
          description: "Google Drive disconnected successfully"
        });
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect Google Drive",
        variant: "destructive"
      });
    }
  };

  const handleSyncToggle = async (enabled: boolean) => {
    try {
      const success = await GoogleDriveService.saveSettings({ sync_enabled: enabled });
      if (success) {
        setSettings({ ...settings, sync_enabled: enabled });
        toast({
          title: "Success",
          description: enabled ? "Sync enabled" : "Sync disabled"
        });
      }
    } catch (error) {
      console.error('Error toggling sync:', error);
      toast({
        title: "Error",
        description: "Failed to update sync settings",
        variant: "destructive"
      });
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    
    setIsCreatingFolder(true);
    try {
      const folder = await GoogleDriveService.createFolder(folderName);
      if (folder) {
        setFolderName('');
        await loadFiles();
        toast({
          title: "Success",
          description: `Folder "${folderName}" created successfully`
        });
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive"
      });
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedFile = await GoogleDriveService.uploadFile(file);
      if (uploadedFile) {
        await loadFiles();
        toast({
          title: "Success",
          description: `File "${file.name}" uploaded successfully`
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDownloadFile = async (file: GoogleDriveFile) => {
    try {
      const blob = await GoogleDriveService.downloadFile(file.id);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFile = async (file: GoogleDriveFile) => {
    try {
      const success = await GoogleDriveService.deleteFile(file.id);
      if (success) {
        await loadFiles();
        toast({
          title: "Success",
          description: `File "${file.name}" deleted successfully`
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (mimeType.startsWith('video/')) return <Video className="h-4 w-4" />;
    if (mimeType.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (mimeType.includes('text') || mimeType.includes('document')) return <FileText className="h-4 w-4" />;
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return 'Unknown size';
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Google Drive Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? <Cloud className="h-5 w-5" /> : <CloudOff className="h-5 w-5" />}
            Google Drive Integration
          </CardTitle>
          <CardDescription>
            Connect your Google Drive to backup and sync your notes and documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Connection Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? "Connected" : "Not Connected"}
                </Badge>
                {isConnected && settings?.sync_enabled && (
                  <Badge variant="outline">Sync Enabled</Badge>
                )}
              </div>
            </div>
            <Button 
              onClick={isConnected ? handleDisconnect : handleConnect}
              variant={isConnected ? "outline" : "default"}
            >
              {isConnected ? "Disconnect" : "Connect Google Drive"}
            </Button>
          </div>

          {isConnected && (
            <>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sync-enabled">Auto-sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync notes and documents with Google Drive
                  </p>
                </div>
                <Switch
                  id="sync-enabled"
                  checked={settings?.sync_enabled || false}
                  onCheckedChange={handleSyncToggle}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderPlus className="h-5 w-5" />
                Create Folder
              </CardTitle>
              <CardDescription>
                Create a new folder in your Google Drive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
                <Button 
                  onClick={handleCreateFolder}
                  disabled={!folderName.trim() || isCreatingFolder}
                >
                  {isCreatingFolder ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FolderPlus className="h-4 w-4" />
                  )}
                  Create
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload File
              </CardTitle>
              <CardDescription>
                Upload files to your Google Drive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isUploading ? 'Uploading...' : 'Choose File to Upload'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Files in Google Drive</CardTitle>
              <CardDescription>
                Manage your files stored in Google Drive
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No files found in Google Drive
                </p>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div 
                      key={file.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.mimeType)}
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • Modified {new Date(file.modifiedTime).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.webViewLink && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(file.webViewLink, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};