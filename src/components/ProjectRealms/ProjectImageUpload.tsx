
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';
import { useProjectRealms } from '../../contexts/ProjectRealmsContext';

interface ProjectImageUploadProps {
  projectId: string;
  currentImageUrl?: string;
  onImageUpdate?: (imageUrl: string) => void;
}

const ProjectImageUpload: React.FC<ProjectImageUploadProps> = ({ 
  projectId, 
  currentImageUrl,
  onImageUpdate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProject } = useProjectRealms();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      // For now, we'll store the base64 image in the project settings
      // In a production app, you'd want to upload to a storage service
      await updateProject(projectId, {
        settings: {
          banner_image: selectedImage
        }
      });

      onImageUpdate?.(selectedImage);
      setIsOpen(false);
      setSelectedImage(null);
      toast.success('Project banner updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to update project banner');
    } finally {
      setIsUploading(false);
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Upload className="h-4 w-4 mr-2" />
          {currentImageUrl ? 'Change Banner' : 'Upload Banner'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Project Banner</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {!selectedImage ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Select a banner image for your project</p>
              <p className="text-sm text-gray-500 mb-4">Recommended: 1200x400px, max 5MB</p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Image Preview */}
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                <div className="flex justify-center mb-4">
                  <img
                    src={selectedImage}
                    alt="Banner preview"
                    className="max-w-full h-64 object-cover border rounded"
                  />
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetImage}
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleUploadImage} 
                  disabled={isUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUploading ? 'Uploading...' : 'Update Banner'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectImageUpload;
