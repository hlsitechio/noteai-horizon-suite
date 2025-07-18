import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { toast } from 'sonner';

/**
 * Optimized keyboard shortcuts for sidebar navigation
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleCollapse } = useSidebarCollapse();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only process shortcuts when not typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      const cmdOrCtrl = e.metaKey || e.ctrlKey;

      // Sidebar toggle: Cmd/Ctrl + B
      if (cmdOrCtrl && e.key === 'b') {
        e.preventDefault();
        toggleCollapse();
        return;
      }

      // Navigation shortcuts with Cmd/Ctrl + Shift
      if (cmdOrCtrl && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'd':
            e.preventDefault();
            navigate('/app/dashboard');
            toast.success('Navigated to Dashboard');
            break;
          case 'e':
            e.preventDefault();
            navigate('/app/explorer');
            toast.success('Navigated to Explorer');
            break;
          case 'p':
            e.preventDefault();
            navigate('/app/projects');
            toast.success('Navigated to Projects');
            break;
          case 'w':
            e.preventDefault();
            navigate('/app/editor');
            toast.success('Navigated to Editor');
            break;
          case 'c':
            e.preventDefault();
            navigate('/app/chat');
            toast.success('Navigated to AI Chat');
            break;
          case 'a':
            e.preventDefault();
            navigate('/app/analytics');
            toast.success('Navigated to Analytics');
            break;
          case 's':
            e.preventDefault();
            navigate('/app/settings');
            toast.success('Navigated to Settings');
            break;
        }
      }

      // Quick new note: Cmd/Ctrl + N
      if (cmdOrCtrl && e.key === 'n') {
        e.preventDefault();
        navigate('/app/editor');
        toast.success('Opening Editor');
        return;
      }

      // Search: Cmd/Ctrl + K
      if (cmdOrCtrl && e.key === 'k') {
        e.preventDefault();
        navigate('/app/explorer');
        // Focus search input if available
        setTimeout(() => {
          const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
        }, 100);
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, toggleCollapse]);
}