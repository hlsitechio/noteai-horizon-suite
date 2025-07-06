import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ResizableDashboardContainer } from '@/components/Dashboard/ResizableDashboard';
import { ResizableBannerSetup } from '@/components/Dashboard/ResizableBanner';
import KPIStats from '@/components/Dashboard/KPIStats';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { PanelGroup, Panel } from 'react-resizable-panels';
import { ResizableHandle } from '@/components/Dashboard/ResizableDashboard';
import { ResizableHandle as HorizontalResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OptimizedDashboard: React.FC = () => {
  const { notes } = useOptimizedNotes();

  // Calculate stats for KPIStats
  const totalNotes = notes.length;
  const favoriteNotes = notes.filter(note => note.tags?.includes('favorite')).length;
  
  // Calculate category counts from tags
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => {
          if (tag !== 'favorite') { // Exclude 'favorite' from categories
            counts[tag] = (counts[tag] || 0) + 1;
          }
        });
      }
    });
    return counts;
  }, [notes]);

  // Calculate weekly notes (last 7 days)
  const weeklyNotes = React.useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return notes.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate > oneWeekAgo;
    }).length;
  }, [notes]);
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
            <div className="h-full">
              <PanelGroup direction="vertical" className="h-full">
                {/* Top Panel - KPI Stats */}
                <Panel defaultSize={30} minSize={20} maxSize={50}>
                  <div className="p-6 h-full overflow-y-auto">
                    <KPIStats
                      totalNotes={totalNotes}
                      favoriteNotes={favoriteNotes}
                      categoryCounts={categoryCounts}
                      weeklyNotes={weeklyNotes}
                      notes={notes}
                    />
                  </div>
                </Panel>
                
                {/* Resize Handle */}
                <ResizableHandle />
                
                {/* Bottom Panel - Two Boxes */}
                <Panel defaultSize={70} minSize={50}>
                  <div className="h-full">
                    <PanelGroup direction="horizontal" className="h-full">
                      {/* Left Box */}
                      <Panel defaultSize={50} minSize={30}>
                        <div className="p-6 h-full">
                          <Card className="h-full">
                            <CardHeader>
                              <CardTitle>Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="h-full">
                              <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>Recent activity component goes here</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </Panel>
                      
                      {/* Horizontal Resize Handle */}
                      <HorizontalResizableHandle />
                      
                      {/* Right Box */}
                      <Panel defaultSize={50} minSize={30}>
                        <div className="p-6 h-full">
                          <Card className="h-full">
                            <CardHeader>
                              <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="h-full">
                              <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>Quick actions component goes here</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </Panel>
                    </PanelGroup>
                  </div>
                </Panel>
              </PanelGroup>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default React.memo(OptimizedDashboard);