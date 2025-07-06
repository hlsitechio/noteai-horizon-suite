import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ResizableDashboardContainer } from '@/components/Dashboard/ResizableDashboard';

const OptimizedDashboard: React.FC = () => {
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
        bannerDefaultSize={30}
        bannerMinSize={15}
        bannerMaxSize={70}
        bannerContent={
          <div className="w-full h-full bg-background/50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-medium text-muted-foreground">Banner Area</h2>
            </div>
          </div>
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