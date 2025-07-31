import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavigationBar } from './TopNavigationBar';
import ResizableBannerSetup from './ResizableBanner/ResizableBannerSetup';

import { Button } from '@/components/ui/button';
import { Edit3, Settings } from 'lucide-react';
import DashboardSettings from './DashboardSettings';
import { useIsMobile } from '@/hooks/use-mobile';

interface BannerWithTopNavProps {
  onImageUpload?: (file: File) => void;
  onAIGenerate?: (prompt: string) => void;
  onVideoUpload?: (file: File) => void;
  onImageSelect?: (imageUrl: string) => void;
  selectedImageUrl?: string | null;
  isEditMode?: boolean;
  onEditLayoutClick?: () => void;
}

export const BannerWithTopNav: React.FC<BannerWithTopNavProps> = ({
  onImageUpload,
  onAIGenerate,
  onVideoUpload,
  onImageSelect,
  selectedImageUrl,
  isEditMode = false,
  onEditLayoutClick
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex-shrink-0">
        <TopNavigationBar />
      </div>
      
      {/* Banner Content */}
      <div className="flex-1 relative overflow-visible">
        {/* Control buttons positioned in banner area - hidden on mobile */}
        {!isMobile && onEditLayoutClick && (
          <div className="absolute top-4 right-4 z-50 flex items-center gap-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border/50 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditLayoutClick}
              className="gap-2 transition-all duration-200 hover:bg-accent bg-transparent text-foreground hover:text-accent-foreground"
            >
              <Edit3 className="h-4 w-4" />
              Edit Layout
            </Button>
          </div>
        )}
        
        <ResizableBannerSetup
          onImageUpload={onImageUpload}
          onAIGenerate={onAIGenerate}
          onVideoUpload={onVideoUpload}
          onImageSelect={onImageSelect}
          selectedImageUrl={selectedImageUrl}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
};