import React, { useState } from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { SidebarCollapseProvider } from '@/contexts/SidebarContext';

import BannerLayout from './BannerLayout';
import FloatingNotesContainer from '../FloatingNotes/FloatingNotesContainer';
import { ReminderManager } from '../ReminderManager';
import { useThemeManager } from '@/hooks/useThemeManager';
import { Windows11Taskbar } from './Sidebar/Windows11Taskbar';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';

type TaskbarPosition = 'top' | 'bottom' | 'right';

const Windows11Layout: React.FC = () => {
  const [taskbarPosition, setTaskbarPosition] = useState<TaskbarPosition>('bottom');
  
  // Apply user themes only in the authenticated dashboard area
  useThemeManager();
  
  const getMainContentClass = () => {
    switch (taskbarPosition) {
      case 'top':
        return 'pt-16'; // Account for top taskbar
      case 'bottom':
        return 'pb-20'; // Account for bottom taskbar
      case 'right':
        return 'pr-20'; // Account for right sidebar
      default:
        return '';
    }
  };

  return (
    <SidebarCollapseProvider>
        <TooltipProvider delayDuration={200} skipDelayDuration={100}>
          <div className="h-full w-full bg-background overflow-hidden">
            {/* Position Controls - Floating in top-right */}
            <div className="fixed top-4 right-4 z-50 flex gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2">
              <Button
                variant={taskbarPosition === 'top' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTaskbarPosition('top')}
                className="gap-2"
              >
                <ArrowUp className="w-4 h-4" />
                Top
              </Button>
              <Button
                variant={taskbarPosition === 'bottom' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTaskbarPosition('bottom')}
                className="gap-2"
              >
                <ArrowDown className="w-4 h-4" />
                Bottom
              </Button>
              <Button
                variant={taskbarPosition === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTaskbarPosition('right')}
                className="gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Right
              </Button>
            </div>

            {/* Windows 11 Taskbar */}
            <Windows11Taskbar position={taskbarPosition} />
            
            {/* Main Content */}
            <main className={`h-full w-full overflow-hidden ${getMainContentClass()}`}>
              <BannerLayout />
            </main>
            
            <Toaster />
            <FloatingNotesContainer />
            <ReminderManager />
          </div>
        </TooltipProvider>
      </SidebarCollapseProvider>
  );
};

export default Windows11Layout;