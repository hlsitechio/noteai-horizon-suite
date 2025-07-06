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
    <div className="w-full min-h-screen bg-background overflow-y-auto">
      {/* Clean Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-8 w-8 p-0" />
            <div className="text-sm text-muted-foreground font-medium">Dashboard</div>
          </div>
        </div>
      </div>
      
      {/* Resizable Dashboard Container */}
      <ResizableDashboardContainer
        bannerDefaultSize={40}
        bannerMinSize={25}
        bannerMaxSize={80}
        bannerContent={
          <ResizableBannerSetup
            onImageUpload={handleImageUpload}
            onAIGenerate={handleAIGenerate}
            onVideoUpload={handleVideoUpload}
            className="rounded-lg border"
          />
        }
        mainContent={
          <div className="p-6">
            <div className="text-center text-muted-foreground">
              <p>Clean dashboard ready for components</p>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default React.memo(OptimizedDashboard);