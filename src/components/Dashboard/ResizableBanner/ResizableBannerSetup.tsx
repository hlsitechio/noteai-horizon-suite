import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Image, Play, Maximize2, Settings, Palette, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BannerSettingsModal from '../BannerSettings/BannerSettingsModal';
import ColorThemesModal from '../BannerSettings/ColorThemesModal';
import BannerGalleryModal from '../BannerSettings/BannerGalleryModal';
import AIGenerateModal from '../BannerSettings/AIGenerateModal';
import PreviewModeModal from '../BannerSettings/PreviewModeModal';
import CompactBannerPlaceholder from '../BannerSettings/CompactBannerPlaceholder';

interface ResizableBannerSetupProps {
  onImageUpload?: (file: File) => void;
  onAIGenerate?: (prompt: string) => void;
  onVideoUpload?: (file: File) => void;
  onImageSelect?: (imageUrl: string) => void;
  selectedImageUrl?: string | null;
  className?: string;
  isEditMode?: boolean;
}

const ResizableBannerSetup: React.FC<ResizableBannerSetupProps> = ({
  onImageUpload,
  onAIGenerate,
  onVideoUpload,
  onImageSelect,
  selectedImageUrl,
  className = '',
  isEditMode = false
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Modal states
  const [showBannerSettings, setShowBannerSettings] = useState(false);
  const [showColorThemes, setShowColorThemes] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && file.type.startsWith('image/')) {
      onImageUpload?.(file);
    } else if (file.type.startsWith('video/')) {
      onVideoUpload?.(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onImageUpload?.(file);
      } else if (file.type.startsWith('video/')) {
        onVideoUpload?.(file);
      }
    }
  };

  const handleAIGenerate = () => {
    setIsGenerating(true);
    const prompts = [
      "Abstract gradient landscape with aurora colors",
      "Minimalist geometric mountain silhouette at sunset",
      "Flowing liquid gold abstract background",
      "Cosmic nebula with deep purples and blues"
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    onAIGenerate?.(randomPrompt);
    
    // Simulate generation time
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      {/* Full Size Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/5" />
      
      {/* Main Content Container - Full Size */}
      <motion.div
        className={`w-full h-full flex items-center justify-center p-6 ${
          dragOver ? 'bg-primary/10' : ''
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-4xl mx-auto">
          {/* Conditional Content - Show Image if Selected, Otherwise Show Compact Placeholder */}
          {selectedImageUrl ? (
            // Show Selected Banner Image - Full Size
            <>
              <motion.div 
                className="absolute inset-0 w-full h-full"
                variants={itemVariants}
              >
                <img
                  src={selectedImageUrl}
                  alt="Selected banner"
                  className="w-full h-full object-cover"
                />
                
                {/* Image overlay controls */}
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowBannerSettings(true)}
                      className="bg-background/80 backdrop-blur-sm"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowGallery(true)}
                      className="bg-background/80 backdrop-blur-sm"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Upload new image button */}
                  <div className="absolute bottom-4 left-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*,video/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            if (file.type.startsWith('image/')) {
                              onImageUpload?.(file);
                            } else if (file.type.startsWith('video/')) {
                              onVideoUpload?.(file);
                            }
                          }
                        };
                        input.click();
                      }}
                      className="bg-background/80 backdrop-blur-sm"
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Change
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            // Show Compact Placeholder
            <CompactBannerPlaceholder
              onUploadClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*,video/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    if (file.type.startsWith('image/')) {
                      onImageUpload?.(file);
                    } else if (file.type.startsWith('video/')) {
                      onVideoUpload?.(file);
                    }
                  }
                };
                input.click();
              }}
              onAIGenerateClick={() => setShowAIGenerate(true)}
              onGalleryClick={() => setShowGallery(true)}
              onSettingsClick={() => setShowBannerSettings(true)}
            />
          )}

          {/* Drop Zone Indicator - Only show when no image is selected */}
          {dragOver && !isEditMode && !selectedImageUrl && (
            <motion.div
              className="absolute inset-4 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center backdrop-blur-sm z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="text-center">
                <Upload className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-lg font-semibold text-primary">Drop your file here</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Corner Resize Indicator */}
      <div className="absolute bottom-2 right-2 opacity-50 hover:opacity-100 transition-opacity">
        <div className="w-6 h-6 border-r-2 border-b-2 border-muted-foreground/30" />
      </div>

      {/* Modals */}
      <BannerSettingsModal 
        open={showBannerSettings} 
        onOpenChange={setShowBannerSettings} 
      />
      
      <ColorThemesModal 
        open={showColorThemes} 
        onOpenChange={setShowColorThemes} 
      />
      
      <BannerGalleryModal 
        open={showGallery} 
        onOpenChange={setShowGallery} 
        onSelectImage={onImageSelect}
      />
      
      <AIGenerateModal 
        open={showAIGenerate} 
        onOpenChange={setShowAIGenerate}
        onImageGenerated={onImageSelect}
      />
      
      <PreviewModeModal 
        open={showPreview} 
        onOpenChange={setShowPreview} 
      />
    </div>
  );
};

export default ResizableBannerSetup;