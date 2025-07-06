
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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
      
      {/* Test Resizable Panels */}
      <PanelGroup direction="vertical" className="w-full h-[calc(100vh-4rem)]">
        {/* Top Panel - Test Banner Area */}
        <Panel defaultSize={30} minSize={20} maxSize={60}>
          <div className="w-full h-full bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Resizable Banner Area</h2>
              <p className="text-muted-foreground">Drag the handle below to resize this section</p>
            </div>
          </div>
        </Panel>
        
        {/* Resize Handle */}
        <PanelResizeHandle className="h-3 bg-border hover:bg-primary/20 transition-colors duration-200 flex items-center justify-center group cursor-row-resize relative">
          <div className="w-16 h-1 bg-muted-foreground/50 group-hover:bg-primary rounded-full transition-all duration-200" />
        </PanelResizeHandle>
        
        {/* Bottom Panel - Test Content Area */}
        <Panel>
          <div className="w-full h-full bg-muted/10 border-2 border-dashed border-muted/30 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Main Content Area</h2>
              <p className="text-muted-foreground">This area will contain KPI stats and other content</p>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Dashboard;
