
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotesListSection } from './NotesListSection';
import { FoldersListSection } from './FoldersListSection';
import { FavoritesListSection } from './FavoritesListSection';
import { DraggableSidebarContent } from './DraggableSidebarContent';
import { SortableSection } from './SortableSection';
import { useOptimizedNotes } from '../../../contexts/OptimizedNotesContext';
import { useFolders } from '../../../contexts/FoldersContext';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSidebarCollapse } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import { Star, Folder, FileText, Plus } from 'lucide-react';

const contentVariants = {
  expanded: {
    opacity: 1,
    height: 'auto',
    transition: {
      delay: 0.1,
      duration: 0.3
    }
  },
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2
    }
  }
};

export function NotesSection() {
  const { notes, createNote, setCurrentNote } = useOptimizedNotes();
  const { folders, createFolder } = useFolders();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isCollapsed } = useSidebarCollapse();
  const sidebarOpen = !isCollapsed;

  // Section order state for drag and drop
  const [sectionOrder, setSectionOrder] = useState(['favorites', 'folders', 'notes']);

  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    folders: true,
    notes: true
  });

  const handleCreateNote = async () => {
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
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleCreateFolder = async () => {
    try {
      await createFolder({
        name: 'New Folder',
        color: '#64748b',
      });
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSectionReorder = (newOrder: string[]) => {
    setSectionOrder(newOrder);
    // Optionally save to localStorage or user preferences
    localStorage.setItem('sidebarSectionOrder', JSON.stringify(newOrder));
  };

  // Load saved section order on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('sidebarSectionOrder');
    if (saved) {
      try {
        const parsedOrder = JSON.parse(saved);
        if (Array.isArray(parsedOrder)) {
          setSectionOrder(parsedOrder);
        }
      } catch (error) {
        console.warn('Failed to parse saved section order:', error);
      }
    }
  }, []);

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'favorites':
        return (
          <FavoritesListSection
            notes={favoriteNotes}
            isExpanded={expandedSections.favorites}
            onToggle={() => toggleSection('favorites')}
            onCreateNote={handleCreateNote}
            isMobile={isMobile}
          />
        );
      case 'folders':
        return (
          <FoldersListSection
            folders={folders}
            notes={notes}
            isExpanded={expandedSections.folders}
            onToggle={() => toggleSection('folders')}
            onCreateFolder={handleCreateFolder}
            isMobile={isMobile}
          />
        );
      case 'notes':
        return (
          <NotesListSection
            notes={notes}
            isExpanded={expandedSections.notes}
            onToggle={() => toggleSection('notes')}
            onCreateNote={handleCreateNote}
            onCreateFolder={handleCreateFolder}
            isMobile={isMobile}
          />
        );
      default:
        return null;
    }
  };

  const favoriteNotes = notes.filter(note => note.isFavorite);

  // Collapsed icon-only view with enhanced animations
  if (!sidebarOpen && !isMobile) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center py-4 space-y-3">
        {/* Favorites icon */}
        {favoriteNotes.length > 0 && (
          <Button
            variant="ghost" 
            size="sm"
            className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent hover:scale-110 transition-all duration-200 group"
            onClick={() => {/* Navigate to favorites */}}
          >
            <Star className="w-5 h-5 text-sidebar-foreground group-hover:text-yellow-500 transition-colors duration-200" />
          </Button>
        )}
        
        {/* Folders icon */}
        <Button
          variant="ghost"
          size="sm" 
          className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent hover:scale-110 transition-all duration-200 group"
          onClick={handleCreateFolder}
        >
          <Folder className="w-5 h-5 text-sidebar-foreground group-hover:text-blue-500 transition-colors duration-200" />
        </Button>
        
        {/* Notes icon */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent hover:scale-110 transition-all duration-200 group" 
          onClick={handleCreateNote}
        >
          <FileText className="w-5 h-5 text-sidebar-foreground group-hover:text-green-500 transition-colors duration-200" />
        </Button>
        
        {/* Add icon */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 rounded-xl hover:bg-sidebar-accent hover:scale-110 transition-all duration-200 group"
          onClick={handleCreateNote}
        >
          <Plus className="w-5 h-5 text-sidebar-foreground group-hover:text-primary transition-colors duration-200" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0">
      {!isMobile && (
        <div className="p-2">
          <h3 className="text-sm font-medium text-sidebar-foreground mb-3 transition-colors duration-200">
            Content
          </h3>
        </div>
      )}
      <div className="h-full">
        <AnimatePresence>
          <motion.div
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="h-full overflow-hidden space-y-2"
          >
            <DraggableSidebarContent
              items={sectionOrder}
              onReorder={handleSectionReorder}
            >
              <div className="h-full overflow-y-auto space-y-1 px-2 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent hover:scrollbar-thumb-sidebar-accent/50">
                {sectionOrder.map((sectionId, index) => (
                  <SortableSection 
                    key={sectionId} 
                    id={sectionId}
                    className="transition-all duration-200"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      {renderSection(sectionId)}
                    </motion.div>
                  </SortableSection>
                ))}
              </div>
            </DraggableSidebarContent>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
