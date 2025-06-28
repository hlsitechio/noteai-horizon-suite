
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Folder, Star } from 'lucide-react';
import { useNotes } from '../../../contexts/NotesContext';
import { useFolders } from '../../../contexts/FoldersContext';
import { useSidebar } from '@/components/ui/sidebar';

export function CollapsedSummary() {
  const { state } = useSidebar();
  const { notes } = useNotes();
  const { folders } = useFolders();
  const isCollapsed = state === 'collapsed';

  if (!isCollapsed) {
    return null;
  }

  const favoriteCount = notes.filter(note => note.isFavorite).length;
  const notesCount = notes.length;
  const foldersCount = folders.length;

  const summaryItems = [
    { icon: FileText, count: notesCount, label: 'Notes' },
    { icon: Folder, count: foldersCount, label: 'Folders' },
    { icon: Star, count: favoriteCount, label: 'Favorites' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-2 space-y-2"
    >
      {summaryItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
          >
            <Icon className="w-4 h-4 text-sidebar-foreground/70 mb-1" />
            <span className="text-xs font-medium text-sidebar-foreground">{item.count}</span>
          </div>
        );
      })}
    </motion.div>
  );
}
