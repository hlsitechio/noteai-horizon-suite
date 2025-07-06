import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ResizableDashboardContainer } from '@/components/Dashboard/ResizableDashboard';
import { ResizableBannerSetup } from '@/components/Dashboard/ResizableBanner';
import KPIStats from '@/components/Dashboard/KPIStats';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';

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
            <div className="p-6 h-full overflow-y-auto">
              <KPIStats
                totalNotes={totalNotes}
                favoriteNotes={favoriteNotes}
                categoryCounts={categoryCounts}
                weeklyNotes={weeklyNotes}
                notes={notes}
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default React.memo(OptimizedDashboard);