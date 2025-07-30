import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DraggableNotesContext } from './DraggableSidebarContent';
import { Note } from '../../../types/note';
import { Folder as FolderType } from '../../../types/folder';
import { SectionRenderer } from './SectionRenderer';

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

interface ExpandedNotesViewProps {
  notes: Note[];
  folders: FolderType[];
  favoriteNotes: Note[];
  sectionOrder: string[];
  expandedSections: {
    favorites: boolean;
    folders: boolean;
    notes: boolean;
  };
  onToggleSection: (section: 'favorites' | 'folders' | 'notes') => void;
  onCreateNote: () => void;
  onCreateFolder: () => Promise<void>;
  onMoveToFolder: (noteId: string, folderId: string | null) => void;
  onToggleFavorite: (noteId: string, isFavorite: boolean) => void;
  onFolderSelect?: (folderId: string) => void;
  isMobile: boolean;
}

export function ExpandedNotesView({
  notes,
  folders,
  favoriteNotes,
  sectionOrder,
  expandedSections,
  onToggleSection,
  onCreateNote,
  onCreateFolder,
  onMoveToFolder,
  onToggleFavorite,
  onFolderSelect,
  isMobile
}: ExpandedNotesViewProps) {
  return (
    <div className="flex-1 min-h-0">
      {!isMobile && (
        <div className="p-2">
          <h3 className="text-xs font-medium text-sidebar-foreground mb-3 transition-colors duration-200">
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
            <DraggableNotesContext
              notes={notes}
              onMoveToFolder={onMoveToFolder}
              onToggleFavorite={onToggleFavorite}
            >
              <div className="h-full overflow-y-auto space-y-1 px-2 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent hover:scrollbar-thumb-sidebar-accent/50">
                {sectionOrder.map((sectionId, index) => (
                  <div key={sectionId} className="transition-all duration-200">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <SectionRenderer
                        sectionId={sectionId}
                        notes={notes}
                        folders={folders}
                        favoriteNotes={favoriteNotes}
                        expandedSections={expandedSections}
                        onToggleSection={onToggleSection}
                        onCreateNote={onCreateNote}
                        onCreateFolder={onCreateFolder}
                        onMoveToFolder={onMoveToFolder}
                        onFolderSelect={onFolderSelect}
                        isMobile={isMobile}
                      />
                    </motion.div>
                  </div>
                ))}
              </div>
            </DraggableNotesContext>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}