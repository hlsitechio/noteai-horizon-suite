import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Sparkles, 
  Image, 
  Settings, 
  Palette, 
  Play,
  Maximize2,
  Plus,
  Save,
  CheckCircle
} from 'lucide-react';
import BannerSettingsModal from './BannerSettingsModal';
import ColorThemesModal from './ColorThemesModal';
import BannerGalleryModal from './BannerGalleryModal';
import AIGenerateModal from './AIGenerateModal';
import PreviewModeModal from './PreviewModeModal';
import LayoutEditToggle from './LayoutEditToggle';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';

interface EditLayoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUpload?: (file: File) => void;
  onAIGenerate?: (prompt: string) => void;
  onVideoUpload?: (file: File) => void;
  onImageSelect?: (imageUrl: string) => void;
}

const EditLayoutModal: React.FC<EditLayoutModalProps> = ({
  open,
  onOpenChange,
  onImageUpload,
  onAIGenerate,
  onVideoUpload,
  onImageSelect
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { isDashboardEditMode, isSidebarEditMode } = useEditMode();
  const { toast } = useToast();
  
  // Modal states for nested modals
  const [showBannerSettings, setShowBannerSettings] = useState(false);
  const [showColorThemes, setShowColorThemes] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showAIGenerate, setShowAIGenerate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Track if any edit modes are active
  const hasActiveEditMode = isDashboardEditMode || isSidebarEditMode;

  const handleEditModeEnabled = () => {
    // Close modal when edit mode is enabled
    onOpenChange(false);
  };

  const handleConfirmLayout = () => {
    toast({
      title: "Layout Saved",
      description: "Your layout changes have been saved successfully.",
    });
    onOpenChange(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        onImageUpload?.(file);
      } else if (file.type.startsWith('video/')) {
        onVideoUpload?.(file);
      }
      onOpenChange(false); // Close modal after upload
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
    setTimeout(() => {
      setIsGenerating(false);
      onOpenChange(false); // Close modal after generation
    }, 2000);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Maximize2 className="h-5 w-5" />
              Edit Layout Settings
            </DialogTitle>
            <DialogDescription>
              Customize your banner, manage settings, and configure your dashboard layout.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[75vh]">
            <Tabs defaultValue="banner" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="banner">Banner Setup</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              {/* Banner Setup Tab */}
              <TabsContent value="banner" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Banner Configuration</h3>
                  <p className="text-muted-foreground">
                    Upload media, generate with AI, or choose from your gallery
                  </p>
                </div>

                {/* Action Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <h4 className="font-semibold mb-2">Upload Media</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Drag & drop or click to upload
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
                        onClick={() => setShowAIGenerate(true)}
                        disabled={isGenerating}
                        className="w-full h-full p-0 bg-transparent hover:bg-transparent text-inherit"
                        variant="ghost"
                      >
                        <div className="w-full">
                          <div className="p-4 bg-purple-500/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <Sparkles className={`w-8 h-8 text-purple-500 ${isGenerating ? 'animate-spin' : ''}`} />
                          </div>
                          <h4 className="font-semibold mb-2">AI Generate</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {isGenerating ? 'Creating banner...' : 'Generate unique banner'}
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
                  <Card 
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-primary/50"
                    onClick={() => setShowGallery(true)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="p-4 bg-green-500/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Image className="w-8 h-8 text-green-500" />
                      </div>
                      <h4 className="font-semibold mb-2">Browse Gallery</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Choose from your images
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Badge variant="secondary" className="text-xs">Your Images</Badge>
                        <Badge variant="secondary" className="text-xs">HD</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Banner Settings</h3>
                  <p className="text-muted-foreground">
                    Configure appearance, themes, and display options
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-primary/50"
                    onClick={() => setShowBannerSettings(true)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="p-4 bg-orange-500/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Settings className="w-8 h-8 text-orange-500" />
                      </div>
                      <h4 className="font-semibold mb-2">Banner Settings</h4>
                      <p className="text-sm text-muted-foreground">
                        Configure banner properties and behavior
                      </p>
                    </CardContent>
                  </Card>

                  <Card 
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-primary/50"
                    onClick={() => setShowColorThemes(true)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="p-4 bg-pink-500/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Palette className="w-8 h-8 text-pink-500" />
                      </div>
                      <h4 className="font-semibold mb-2">Color Themes</h4>
                      <p className="text-sm text-muted-foreground">
                        Customize colors and visual themes
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Layout Settings</h3>
                  <p className="text-muted-foreground">
                    Enable editing for dashboard and sidebar layouts
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="group hover:shadow-lg transition-all duration-300 border hover:border-primary/50">
                    <CardContent className="p-6 text-center">
                      <LayoutEditToggle 
                        type="dashboard" 
                        onEditModeEnabled={handleEditModeEnabled}
                      />
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-lg transition-all duration-300 border hover:border-primary/50">
                    <CardContent className="p-6 text-center">
                      <LayoutEditToggle 
                        type="sidebar" 
                        onEditModeEnabled={handleEditModeEnabled}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Advanced Options</h3>
                  <p className="text-muted-foreground">
                    Preview modes and advanced configuration
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-primary/50"
                    onClick={() => setShowPreview(true)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="p-4 bg-cyan-500/10 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-cyan-500" />
                      </div>
                      <h4 className="font-semibold mb-2">Preview Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Preview your banner configurations
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-lg transition-all duration-300 border border-dashed">
                    <CardContent className="p-6 text-center">
                      <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                        <Plus className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold mb-2 text-muted-foreground">Coming Soon</h4>
                      <p className="text-sm text-muted-foreground">
                        More advanced features coming
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nested Modals */}
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
    </>
  );
};

export default EditLayoutModal;