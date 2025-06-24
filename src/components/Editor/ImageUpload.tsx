
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { ImageIcon, Upload, X, RotateCcw, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageInsert: (imageData: string, width?: number, height?: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageInsert }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState([300]);
  const [rotation, setRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleInsertImage = () => {
    if (!selectedImage) return;

    // Calculate aspect ratio and resize
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.height / img.width;
      const width = imageSize[0];
      const height = width * aspectRatio;
      
      onImageInsert(selectedImage, width, height);
      setIsOpen(false);
      setSelectedImage(null);
      setImageSize([300]);
      setRotation(0);
      toast.success('Image inserted successfully!');
    };
    img.src = selectedImage;
  };

  const handleRotate = (direction: 'left' | 'right') => {
    const newRotation = direction === 'left' ? rotation - 90 : rotation + 90;
    setRotation(newRotation % 360);
  };

  const resetImage = () => {
    setSelectedImage(null);
    setImageSize([300]);
    setRotation(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-blue-100 text-blue-600 hover:text-blue-700 dark:hover:bg-slate-600 dark:text-blue-400"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
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
              <p className="text-gray-600 mb-4">Select an image to upload</p>
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
                    alt="Preview"
                    style={{
                      width: `${imageSize[0]}px`,
                      height: 'auto',
                      transform: `rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease'
                    }}
                    className="max-w-full border rounded"
                  />
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRotate('left')}
                      title="Rotate Left"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRotate('right')}
                      title="Rotate Right"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  </div>
                  
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

              {/* Size Control */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Image Width</label>
                  <span className="text-sm text-gray-500">{imageSize[0]}px</span>
                </div>
                <Slider
                  value={imageSize}
                  onValueChange={setImageSize}
                  max={800}
                  min={100}
                  step={10}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInsertImage} className="bg-blue-600 hover:bg-blue-700">
                  Insert Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUpload;
