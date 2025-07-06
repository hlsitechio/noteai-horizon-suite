import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Search, Filter, Download, Star, Eye, Heart, Check, Upload, Plus, Trash2, Edit3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ImageStorageService, type GalleryImage } from '@/services/imageStorageService';
import { toast } from 'sonner';

interface BannerGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage?: (imageUrl: string) => void;
}

const BannerGalleryModal: React.FC<BannerGalleryModalProps> = ({
  open,
  onOpenChange,
  onSelectImage
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('gallery');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load user's gallery images
  const loadGalleryImages = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const images = await ImageStorageService.getUserGallery(user.id);
      setGalleryImages(images);
    } catch (error) {
      console.error('Failed to load gallery images:', error);
      toast.error('Failed to load your images');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const uploadedImage = await ImageStorageService.uploadImage(file);
      if (uploadedImage) {
        setGalleryImages(prev => [uploadedImage, ...prev]);
        toast.success('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (imageId: string) => {
    try {
      await ImageStorageService.deleteImage(imageId);
      setGalleryImages(prev => prev.filter(img => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete image');
    }
  };

  // Handle image selection
  const handleSelectImage = (image: GalleryImage) => {
    onSelectImage?.(image.file_url);
    onOpenChange(false);
    toast.success('Banner image updated!');
  };

  // Filter images based on search
  const filteredImages = galleryImages.filter(image =>
    image.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Load images when modal opens
  useEffect(() => {
    if (open && user) {
      loadGalleryImages();
    }
  }, [open, user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Your Image Gallery
          </DialogTitle>
          <DialogDescription>
            Upload and manage your banner images. Choose from your uploaded collection.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Upload Section & Search */}
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
                disabled={isUploading}
              />
              <label htmlFor="image-upload">
                <Button variant="outline" size="sm" className="gap-2 cursor-pointer" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </>
                  )}
                </Button>
              </label>
            </div>
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Images Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Images Yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first image to get started with custom banners.
              </p>
              <label htmlFor="image-upload">
                <Button className="gap-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Upload Your First Image
                </Button>
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  className="cursor-pointer group hover:shadow-lg transition-all overflow-hidden relative"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={image.file_url}
                        alt={image.title || 'Gallery image'}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                      />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSelectImage(image)}
                          className="gap-1"
                        >
                          <Check className="h-3 w-3" />
                          Use
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.id);
                          }}
                          className="gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* File size badge */}
                      <Badge className="absolute top-2 right-2 text-xs">
                        {(image.file_size / 1024 / 1024).toFixed(1)}MB
                      </Badge>
                    </div>
                    
                    <div className="p-3">
                      <h4 className="font-medium text-sm truncate">
                        {image.title || 'Untitled'}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                      {image.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {image.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {image.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              +{image.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} in your gallery
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerGalleryModal;