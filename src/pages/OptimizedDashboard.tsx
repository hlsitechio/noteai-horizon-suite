import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ResizableDashboardContainer } from '@/components/Dashboard/ResizableDashboard';
import { ResizableBannerSetup } from '@/components/Dashboard/ResizableBanner';

const OptimizedDashboard: React.FC = () => {
  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file.name);
    // Handle image upload logic here
  };

  const handleAIGenerate = (prompt: string) => {
    console.log('AI Generate with prompt:', prompt);
    // Handle AI generation logic here
  };

  const handleVideoUpload = (file: File) => {
    console.log('Video uploaded:', file.name);
    // Handle video upload logic here
  };

  return (
    <div className="w-full h-screen bg-background">
      {/* Resizable Dashboard Container - Full Height */}
      <div className="h-full w-full">
        <ResizableDashboardContainer
          bannerDefaultSize={40}
          bannerMinSize={25}
          bannerMaxSize={80}
          bannerContent={
            <ResizableBannerSetup
              onImageUpload={handleImageUpload}
              onAIGenerate={handleAIGenerate}
              onVideoUpload={handleVideoUpload}
            />
          }
          mainContent={
            <div className="p-6 h-full">
              <div className="text-center text-muted-foreground">
                <p>Clean dashboard ready for components</p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default React.memo(OptimizedDashboard);