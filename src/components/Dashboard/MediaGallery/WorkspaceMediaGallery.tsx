import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Images, 
  Video, 
  FileText, 
  Upload, 
  Trash2, 
  Download,
  Eye,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { useDashboardWorkspace } from '@/hooks/useDashboardWorkspace';
import { WorkspaceMediaFile } from '@/services/workspaceMediaService';
import { toast } from 'sonner';

interface MediaGalleryProps {
  onSelectBanner?: (url: string, type: 'image' | 'video') => void;
  showBannerSelection?: boolean;
}

export const WorkspaceMediaGallery: React.FC<MediaGalleryProps> = ({
  onSelectBanner,
  showBannerSelection = false
}) => {
  const { 
    getWorkspaceMedia, 
    getWorkspaceBanners, 
    uploadBanner, 
    cleanupMedia,
    updateBannerSelection 
  } = useDashboardWorkspace();
  
  const [mediaFiles, setMediaFiles] = useState<WorkspaceMediaFile[]>([]);
  const [bannerFiles, setBannerFiles] = useState<WorkspaceMediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'images' | 'videos' | 'documents'>('all');
  const [selectedFile, setSelectedFile] = useState<WorkspaceMediaFile | null>(null);

  // Load media files
  const loadMedia = async () => {
    setLoading(true);
    try {
      const [allMedia, banners] = await Promise.all([
        getWorkspaceMedia(),
        getWorkspaceBanners()
      ]);
      
      setMediaFiles(allMedia);
      setBannerFiles(banners);
    } catch (error) {
      console.error('Error loading media:', error);
      toast.error('Failed to load media files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          await uploadBanner(file);
        }
      }
      
      // Reload media after upload
      await loadMedia();
      toast.success(`Uploaded ${files.length} file(s) successfully`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  // Handle banner selection
  const handleSelectBanner = async (file: WorkspaceMediaFile) => {
    try {
      if (onSelectBanner) {
        onSelectBanner(file.url, file.type as 'image' | 'video');
      } else {
        await updateBannerSelection(file.url, file.type as 'image' | 'video');
        toast.success('Banner updated successfully');
      }
    } catch (error) {
      console.error('Error selecting banner:', error);
      toast.error('Failed to update banner');
    }
  };

  // Handle cleanup
  const handleCleanup = async () => {
    try {
      const deletedCount = await cleanupMedia();
      await loadMedia(); // Reload after cleanup
    } catch (error) {
      console.error('Error during cleanup:', error);
      toast.error('Failed to cleanup files');
    }
  };

  // Filter files based on selected tab
  const filteredFiles = mediaFiles.filter(file => {
    switch (selectedTab) {
      case 'images':
        return file.type === 'image';
      case 'videos':
        return file.type === 'video';
      case 'documents':
        return file.type === 'document' || file.type === 'note-attachment';
      default:
        return true;
    }
  });

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading media...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Workspace Media Gallery</h3>
          <p className="text-sm text-muted-foreground">
            Manage your images, videos, and documents
          </p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="file"
            id="media-upload"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="media-upload">
            <Button 
              variant="outline" 
              disabled={uploading}
              className="cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </>
              )}
            </Button>
          </label>
          
          <Button 
            variant="outline" 
            onClick={handleCleanup}
            title="Clean up unused files"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* File Tabs */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            All ({mediaFiles.length})
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Images className="h-4 w-4" />
            Images ({mediaFiles.filter(f => f.type === 'image').length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Videos ({mediaFiles.filter(f => f.type === 'video').length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents ({mediaFiles.filter(f => f.type === 'document' || f.type === 'note-attachment').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No {selectedTab === 'all' ? 'files' : selectedTab} found in your workspace
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Upload some files to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square relative bg-muted/30">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    ) : file.type === 'video' ? (
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* File type badge */}
                    <Badge 
                      className="absolute top-2 left-2 text-xs"
                      variant={file.type === 'image' ? 'default' : file.type === 'video' ? 'secondary' : 'outline'}
                    >
                      {file.type}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedFile(file)}
                          className="flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        
                        {showBannerSelection && (file.type === 'image' || file.type === 'video') && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleSelectBanner(file)}
                            className="flex-1"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Select
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* File Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="font-semibold">{selectedFile.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4 max-h-[70vh] overflow-auto">
              {selectedFile.type === 'image' ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.name}
                  className="max-w-full h-auto"
                />
              ) : selectedFile.type === 'video' ? (
                <video
                  src={selectedFile.url}
                  controls
                  className="max-w-full h-auto"
                />
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p>Document preview not available</p>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedFile.url, '_blank')}
                    className="mt-4"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download File
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};