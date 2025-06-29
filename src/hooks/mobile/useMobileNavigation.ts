
import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

export const useMobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const navigateToSettings = useCallback(() => {
    navigate('/mobile/settings');
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const isCurrentRoute = useCallback((route: string) => {
    return location.pathname === route;
  }, [location.pathname]);

  return {
    navigateToNotes,
    navigateToEditor,
    navigateToSettings,
    goBack,
    isCurrentRoute,
    currentPath: location.pathname,
  };
};
