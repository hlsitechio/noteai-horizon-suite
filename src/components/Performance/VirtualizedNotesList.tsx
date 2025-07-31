import React, { useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Note } from '@/types/note';

interface VirtualizedNotesListProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  height?: number;
  itemHeight?: number;
}

/**
 * Virtualized notes list for optimal performance with large datasets
 * Only renders visible items to prevent DOM bloat
 */
export const VirtualizedNotesList: React.FC<VirtualizedNotesListProps> = ({
  notes,
  onNoteSelect,
  height = 600,
  itemHeight = 120,
}) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: notes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5, // Render 5 extra items above and below visible area
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className="w-full overflow-auto border rounded-lg"
      style={{ height }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const note = notes[virtualItem.index];
          
          return (
            <motion.div
              key={virtualItem.key}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: virtualItem.size,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="p-2 h-full">
                <Card 
                  className="h-full cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onNoteSelect(note)}
                >
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-medium truncate flex-1">
                          {note.title || 'Untitled Note'}
                        </h3>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {formatDistanceToNow(new Date(note.updatedAt || note.createdAt), { 
                          addSuffix: true 
                        })}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <div className="flex gap-1 flex-wrap">
                          {note.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {note.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{note.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};