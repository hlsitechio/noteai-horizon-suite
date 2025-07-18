import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Optimized sidebar hook for performance and memoization
 */
export function useSidebarOptimization() {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebarCollapse();
  const isMobile = useIsMobile();

  // Memoize the current path to prevent unnecessary re-renders
  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  // Memoize the sidebar state
  const sidebarState = useMemo(() => ({
    isCollapsed,
    isMobile,
    showLabels: !isCollapsed && !isMobile,
    showTooltips: isCollapsed || isMobile
  }), [isCollapsed, isMobile]);

  // Memoized navigation checker
  const isActiveRoute = useCallback((path: string) => {
    return currentPath === path;
  }, [currentPath]);

  // Optimized toggle function
  const optimizedToggle = useCallback(() => {
    toggleCollapse();
  }, [toggleCollapse]);

  return {
    currentPath,
    sidebarState,
    isActiveRoute,
    toggleCollapse: optimizedToggle
  };
}