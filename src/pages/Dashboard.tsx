
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ResizableDashboardContainer } from '@/components/Dashboard/ResizableDashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-background">
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
          <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center rounded-lg">
            <div className="text-center p-6">
              <h2 className="text-xl font-bold mb-2">Welcome Banner</h2>
              <p className="text-muted-foreground">This resizable banner can contain your welcome components</p>
            </div>
          </div>
        }
        mainContent={
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">KPI Stats</h3>
                <p className="text-sm text-muted-foreground">Stats components will go here</p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Activity components will go here</p>
              </div>
              <div className="bg-card p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Smart Recommendations</h3>
                <p className="text-sm text-muted-foreground">Recommendation components will go here</p>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Dashboard;
