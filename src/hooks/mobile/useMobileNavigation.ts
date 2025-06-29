
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export const useMobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToDashboard = useCallback(() => {
    navigate('/mobile/dashboard');
  }, [navigate]);

  const navigateToNotes = useCallback(() => {
    navigate('/mobile/notes');
  }, [navigate]);

  const navigateToEditor = useCallback((noteId?: string) => {
    if (noteId) {
      navigate(`/mobile/editor?note=${noteId}`);
    } else {
      navigate('/mobile/editor');
    }
  }, [navigate]);

  const navigateToChat = useCallback(() => {
    navigate('/mobile/chat');
  }, [navigate]);

  const navigateToProjects = useCallback(() => {
    navigate('/mobile/projects');
  }, [navigate]);

  const navigateToAnalytics = useCallback(() => {
    navigate('/mobile/analytics');
  }, [navigate]);

  const navigateToSettings = useCallback(() => {
    navigate('/mobile/settings');
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const isCurrentRoute = useCallback((route: string) => {
    return location.pathname === route;
  }, [location.pathname]);

  // Helper to check if we're in mobile mode
  const isMobileRoute = useCallback(() => {
    return location.pathname.startsWith('/mobile');
  }, [location.pathname]);

  return {
    navigateToDashboard,
    navigateToNotes,
    navigateToEditor,
    navigateToChat,
    navigateToProjects,
    navigateToAnalytics,
    navigateToSettings,
    goBack,
    isCurrentRoute,
    isMobileRoute,
    currentPath: location.pathname,
  };
};
