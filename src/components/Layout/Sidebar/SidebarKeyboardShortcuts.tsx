import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { toast } from 'sonner';

export function useSidebarKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleCollapse } = useSidebarCollapse();
  const { createNote, setCurrentNote } = useOptimizedNotes();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Cmd/Ctrl is pressed
      const cmdOrCtrl = e.metaKey || e.ctrlKey;
      
      // Ignore if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement || 
          e.target instanceof HTMLElement && e.target.isContentEditable) {
        return;
      }

      // Sidebar shortcuts
      if (cmdOrCtrl && e.key === 'b') {
        e.preventDefault();
        toggleCollapse();
        toast.success('Sidebar toggled');
        return;
      }

      // Navigation shortcuts
      if (cmdOrCtrl && e.shiftKey) {
        switch (e.key) {
          case 'D':
            e.preventDefault();
            navigate('/app/dashboard');
            toast.success('Navigated to Dashboard');
            break;
          case 'N':
            e.preventDefault();
            navigate('/app/notes');
            toast.success('Navigated to Notes');
            break;
          case 'E':
            e.preventDefault();
            navigate('/app/editor');
            toast.success('Navigated to Editor');
            break;
          case 'C':
            e.preventDefault();
            navigate('/app/chat');
            toast.success('Navigated to AI Chat');
            break;
          case 'P':
            e.preventDefault();
            navigate('/app/projects');
            toast.success('Navigated to Projects');
            break;
          case 'A':
            e.preventDefault();
            navigate('/app/analytics');
            toast.success('Navigated to Analytics');
            break;
          case 'S':
            e.preventDefault();
            navigate('/app/settings');
            toast.success('Navigated to Settings');
            break;
        }
      }

      // Quick action shortcuts
      if (cmdOrCtrl && e.key === 'n') {
        e.preventDefault();
        handleCreateNewNote();
        return;
      }

      // Search shortcut
      if (cmdOrCtrl && e.key === 'k') {
        e.preventDefault();
        navigate('/app/notes');
        toast.success('Search opened');
        return;
      }
    };

    const handleCreateNewNote = async () => {
      try {
        const newNote = await createNote({
          title: 'Untitled Note',
          content: '',
          category: 'general',
          tags: [],
          isFavorite: false,
          folder_id: null,
        });
        setCurrentNote(newNote);
        navigate(`/app/editor/${newNote.id}`);
        toast.success('New note created');
      } catch (error) {
        console.error('Failed to create note:', error);
        toast.error('Failed to create note');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, toggleCollapse, createNote, setCurrentNote]);
}