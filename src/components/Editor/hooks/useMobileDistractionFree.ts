
import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '../../../hooks/use-mobile';

interface UseMobileDistractionFreeProps {
  onHeaderHiddenChange: (hidden: boolean) => void;
  onAssistantCollapsedChange: (collapsed: boolean) => void;
  onFocusModeChange: (focusMode: boolean) => void;
}

export const useMobileDistractionFree = ({
  onHeaderHiddenChange,
  onAssistantCollapsedChange,
  onFocusModeChange,
}: UseMobileDistractionFreeProps) => {
  const isMobile = useIsMobile();
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [autoEnabledOnMobile, setAutoEnabledOnMobile] = useState(false);

  // Auto-enable distraction-free mode on mobile
  useEffect(() => {
    if (isMobile && !autoEnabledOnMobile) {
      setIsDistractionFree(true);
      setAutoEnabledOnMobile(true);
      onHeaderHiddenChange(true);
      onAssistantCollapsedChange(true);
    } else if (!isMobile && autoEnabledOnMobile) {
      // Reset when switching back to desktop
      setIsDistractionFree(false);
      setAutoEnabledOnMobile(false);
      onHeaderHiddenChange(false);
      onAssistantCollapsedChange(false);
    }
  }, [isMobile, autoEnabledOnMobile, onHeaderHiddenChange, onAssistantCollapsedChange]);

  const toggleDistractionFree = useCallback(() => {
    const newDistractionFree = !isDistractionFree;
    setIsDistractionFree(newDistractionFree);
    
    if (newDistractionFree) {
      onHeaderHiddenChange(true);
      onAssistantCollapsedChange(true);
      if (isMobile) {
        onFocusModeChange(true);
      }
    } else {
      if (!isMobile) {
        onHeaderHiddenChange(false);
        onAssistantCollapsedChange(false);
      }
      onFocusModeChange(false);
    }
  }, [isDistractionFree, isMobile, onHeaderHiddenChange, onAssistantCollapsedChange, onFocusModeChange]);

  const enterFocusMode = useCallback(() => {
    if (isMobile) {
      setIsDistractionFree(true);
      onHeaderHiddenChange(true);
      onAssistantCollapsedChange(true);
    }
    onFocusModeChange(true);
  }, [isMobile, onHeaderHiddenChange, onAssistantCollapsedChange, onFocusModeChange]);

  const exitFocusMode = useCallback(() => {
    onFocusModeChange(false);
    // On mobile, maintain distraction-free state
    if (!isMobile) {
      setIsDistractionFree(false);
      onHeaderHiddenChange(false);
      onAssistantCollapsedChange(false);
    }
  }, [isMobile, onHeaderHiddenChange, onAssistantCollapsedChange, onFocusModeChange]);

  return {
    isDistractionFree,
    isMobile,
    toggleDistractionFree,
    enterFocusMode,
    exitFocusMode,
    autoEnabledOnMobile,
  };
};
