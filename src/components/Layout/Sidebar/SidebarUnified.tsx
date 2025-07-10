import React from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import NavigationMenu from './NavigationMenu';
import { NotesSection } from './NotesSection';
import { SidebarFooter } from './SidebarFooter';

export function SidebarUnified() {
  const { isCollapsed } = useSidebarCollapse();
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <div className="h-full bg-sidebar flex flex-col">
        {/* Navigation Section */}
        <div className="flex-shrink-0 p-2">
          <NavigationMenu />
        </div>

        <Separator className="mx-2" />

        {/* Content Section - Notes */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <NotesSection />
        </div>

        <Separator className="mx-2" />

        {/* Footer Section */}
        <div className="flex-shrink-0 p-2 border-t border-sidebar-border">
          <SidebarFooter />
        </div>
      </div>
    </TooltipProvider>
  );
}