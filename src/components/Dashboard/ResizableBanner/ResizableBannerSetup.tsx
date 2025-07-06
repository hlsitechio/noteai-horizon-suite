import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Image, Play, Maximize2, Settings, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResizableBannerSetupProps {
  onImageUpload?: (file: File) => void;
  onAIGenerate?: (prompt: string) => void;
  onVideoUpload?: (file: File) => void;
  className?: string;
}

const ResizableBannerSetup: React.FC<ResizableBannerSetupProps> = ({
  onImageUpload,
  onAIGenerate,
  onVideoUpload,
  className = ''
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
    } else if (file && file.type.startsWith('video/')) {
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
          {/* Header Section */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Maximize2 className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Customize Your Banner
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transform your dashboard with a personalized banner. Upload your own media, 
              generate with AI, or choose from our curated collection.
            </p>
          </motion.div>

          {/* Action Cards Grid - Full Width */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            variants={itemVariants}
          >
            {/* Upload Card */}
            <Card className="relative group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-dashed border-border hover:border-primary/50">
              <CardContent className="p-6 text-center">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="p-4 bg-blue-500/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">Upload Media</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Drag & drop or click to upload images or videos
                </p>
                <div className="flex gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs">JPG</Badge>
                  <Badge variant="secondary" className="text-xs">PNG</Badge>
                  <Badge variant="secondary" className="text-xs">MP4</Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Generate Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-primary/50">
              <CardContent className="p-6 text-center">
                <Button
                  onClick={handleAIGenerate}
                  disabled={isGenerating}
                  className="w-full h-full p-0 bg-transparent hover:bg-transparent text-inherit"
                  variant="ghost"
                >
                  <div className="w-full">
                    <div className="p-4 bg-purple-500/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Sparkles className={`w-8 h-8 text-purple-500 ${isGenerating ? 'animate-spin' : ''}`} />
                    </div>
                    <h3 className="font-semibold mb-2">AI Generate</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {isGenerating ? 'Creating your banner...' : 'Let AI create a unique banner for you'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Badge variant="secondary" className="text-xs">Landscapes</Badge>
                      <Badge variant="secondary" className="text-xs">Abstract</Badge>
                    </div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Gallery Card */}
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-primary/50">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-green-500/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Image className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Browse Gallery</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Choose from our curated collection of banners
                </p>
                <div className="flex gap-2 justify-center">
                  <Badge variant="secondary" className="text-xs">Curated</Badge>
                  <Badge variant="secondary" className="text-xs">HD</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Settings Row - Full Width */}
          <motion.div 
            className="flex flex-wrap gap-3 justify-center"
            variants={itemVariants}
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Banner Settings
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Palette className="w-4 h-4" />
              Color Themes
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="w-4 h-4" />
              Preview Mode
            </Button>
          </motion.div>

          {/* Drop Zone Indicator */}
          {dragOver && (
            <motion.div
              className="absolute inset-4 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center backdrop-blur-sm"
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
    </div>
  );
};

export default ResizableBannerSetup;