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
import { Button } from '@/components/ui/button';
import { Edit3, Lock, Unlock, Settings } from 'lucide-react';
import DashboardSettings from '@/components/Dashboard/DashboardSettings';
import { DashboardComponentRenderer } from '@/components/Dashboard/ComponentRegistry';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

const OptimizedDashboard: React.FC = () => {
  const { notes } = useOptimizedNotes();
  const { getPanelConfiguration, getPanelSizes } = useDashboardLayout();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [selectedBannerUrl, setSelectedBannerUrl] = React.useState<string | null>(null);

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
      {/* Edit Mode Toggle Button */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <DashboardSettings>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Components
          </Button>
        </DashboardSettings>
        
        <Button
          variant={isEditMode ? "default" : "outline"}
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
          className={`gap-2 transition-all duration-200 ${
            isEditMode 
              ? 'bg-primary text-primary-foreground shadow-lg' 
              : 'hover:bg-accent'
          }`}
        >
          {isEditMode ? (
            <>
              <Lock className="h-4 w-4" />
              Lock Layout
            </>
          ) : (
            <>
              <Edit3 className="h-4 w-4" />
              Edit Layout
            </>
          )}
        </Button>
      </div>

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="absolute top-16 right-4 z-40 animate-fade-in">
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 text-sm text-primary">
            <div className="flex items-center gap-2">
              <Unlock className="h-3 w-3" />
              Edit mode active - Resize panels as needed
            </div>
          </div>
        </div>
      )}
      
      {/* Resizable Dashboard Container - Full Height */}
      <div className={`h-full w-full transition-all duration-200 ${
        isEditMode ? 'ring-2 ring-primary/20 ring-inset' : ''
      }`}>
        <ResizableDashboardContainer
          bannerDefaultSize={40}
          bannerMinSize={25}
          bannerMaxSize={80}
          isEditMode={isEditMode}
          bannerContent={
            <ResizableBannerSetup
              onImageUpload={handleImageUpload}
              onAIGenerate={handleAIGenerate}
              onVideoUpload={handleVideoUpload}
              onImageSelect={(imageUrl) => {
                setSelectedBannerUrl(imageUrl);
              }}
              selectedImageUrl={selectedBannerUrl}
              isEditMode={isEditMode}
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
                
                {/* Horizontal Resize Handle */}
                {isEditMode && <HorizontalResizableHandle />}
                
                {/* Middle Panel - Two Boxes */}
                <Panel defaultSize={35} minSize={25}>
                  <div className="h-full">
                    <PanelGroup direction="horizontal" className="h-full">
                      {/* Left Box */}
                      <Panel defaultSize={50} minSize={30}>
                        <div className="p-6 h-full">
                          {(() => {
                            const config = getPanelConfiguration('topLeft');
                            return config?.enabled ? (
                              <DashboardComponentRenderer 
                                componentKey={config.component_key}
                                props={config.props}
                              />
                            ) : (
                              <Card className="h-full">
                                <CardHeader>
                                  <CardTitle>Empty Panel</CardTitle>
                                </CardHeader>
                                <CardContent className="h-full">
                                  <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <p>Configure this panel in settings</p>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })()}
                        </div>
                      </Panel>
                      
                      {/* Horizontal Resize Handle */}
                      {isEditMode && <HorizontalResizableHandle />}
                      
                      {/* Right Box */}
                      <Panel defaultSize={50} minSize={30}>
                        <div className="p-6 h-full">
                          {(() => {
                            const config = getPanelConfiguration('topRight');
                            return config?.enabled ? (
                              <DashboardComponentRenderer 
                                componentKey={config.component_key}
                                props={config.props}
                              />
                            ) : (
                              <Card className="h-full">
                                <CardHeader>
                                  <CardTitle>Empty Panel</CardTitle>
                                </CardHeader>
                                <CardContent className="h-full">
                                  <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <p>Configure this panel in settings</p>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })()}
                        </div>
                      </Panel>
                    </PanelGroup>
                  </div>
                </Panel>
                
                {/* Horizontal Resize Handle */}
                {isEditMode && <HorizontalResizableHandle />}
                
                {/* Bottom Panel - Two More Boxes */}
                <Panel defaultSize={35} minSize={25}>
                  <div className="h-full">
                    <PanelGroup direction="horizontal" className="h-full">
                      {/* Left Box */}
                      <Panel defaultSize={50} minSize={30}>
                        <div className="p-6 h-full">
                          {(() => {
                            const config = getPanelConfiguration('bottomLeft');
                            return config?.enabled ? (
                              <DashboardComponentRenderer 
                                componentKey={config.component_key}
                                props={config.props}
                              />
                            ) : (
                              <Card className="h-full">
                                <CardHeader>
                                  <CardTitle>Empty Panel</CardTitle>
                                </CardHeader>
                                <CardContent className="h-full">
                                  <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <p>Configure this panel in settings</p>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })()}
                        </div>
                      </Panel>
                      
                      {/* Horizontal Resize Handle */}
                      {isEditMode && <HorizontalResizableHandle />}
                      
                      {/* Right Box */}
                      <Panel defaultSize={50} minSize={30}>
                        <div className="p-6 h-full">
                          {(() => {
                            const config = getPanelConfiguration('bottomRight');
                            return config?.enabled ? (
                              <DashboardComponentRenderer 
                                componentKey={config.component_key}
                                props={config.props}
                              />
                            ) : (
                              <Card className="h-full">
                                <CardHeader>
                                  <CardTitle>Empty Panel</CardTitle>
                                </CardHeader>
                                <CardContent className="h-full">
                                  <div className="flex items-center justify-center h-full text-muted-foreground">
                                    <p>Configure this panel in settings</p>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })()}
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