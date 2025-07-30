import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationItem, NavigationClickHandler } from '../types';

interface UseSidebarNavigationReturn {
  handleNavigate: NavigationClickHandler;
  isCurrentRoute: (path: string) => boolean;
  getNavigationItemProps: (item: NavigationItem) => {
    isActive: boolean;
    onClick: () => void;
  };
}

export function useSidebarNavigation(): UseSidebarNavigationReturn {
  const navigate = useNavigate();

  const handleNavigate: NavigationClickHandler = useCallback((path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  const isCurrentRoute = useCallback((path: string): boolean => {
    return window.location.pathname === path;
  }, []);

  const getNavigationItemProps = useCallback((item: NavigationItem) => {
    return {
      isActive: isCurrentRoute(item.path),
      onClick: () => handleNavigate(item.path)
    };
  }, [isCurrentRoute, handleNavigate]);

  return {
    handleNavigate,
    isCurrentRoute,
    getNavigationItemProps
  };
}