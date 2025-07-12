import React from 'react';
import { FileText, Folder, Star, Clock, Calendar, Tag, User, Edit3 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { cn } from '@/lib/utils';

interface PreviewPanelProps {
  selectedItems: Set<string>;
  allItems: any[];
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ selectedItems, allItems }) => {
  const navigate = useNavigate();
  const { notes } = useOptimizedNotes();

  if (selectedItems.size === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-muted/20">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-foreground mb-2">Select an item to preview</h3>
        <p className="text-sm text-muted-foreground">
          Click on a note or folder to see its details here
        </p>
      </div>
    );
  }

  if (selectedItems.size > 1) {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Multiple items selected</h3>
          <p className="text-sm text-muted-foreground">
            {selectedItems.size} items selected
          </p>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-2">
            {Array.from(selectedItems).map((itemId) => {
              const item = allItems.find(i => i.id === itemId);
              if (!item) return null;
              
              const Icon = item.type === 'folder' ? Folder : FileText;
              return (
                <Card key={itemId} className="p-3">
                  <div className="flex items-center gap-3">
                    <Icon className={cn(
                      "w-5 h-5",
                      item.type === 'folder' ? "text-blue-500" : "text-foreground"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type === 'folder' ? 'Folder' : 'Note'}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Single item selected
  const selectedItemId = Array.from(selectedItems)[0];
  const selectedItem = allItems.find(item => item.id === selectedItemId);

  if (!selectedItem) {
    return (
      <div className="h-full flex items-center justify-center text-center p-6">
        <div>
          <p className="text-muted-foreground">Item not found</p>
        </div>
      </div>
    );
  }

  if (selectedItem.type === 'folder') {
    const folderNotes = notes.filter(note => note.folder_id === selectedItem.id);
    
    return (
      <div className="h-full flex flex-col">
        {/* Folder Header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: selectedItem.color }}
            >
              <Folder className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{selectedItem.name}</h2>
              <p className="text-sm text-muted-foreground">
                {folderNotes.length} {folderNotes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created {new Date(selectedItem.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Edit3 className="w-4 h-4" />
              Modified {new Date(selectedItem.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Folder Content */}
        <ScrollArea className="flex-1 p-4">
          {folderNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">This folder is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Notes in this folder
              </h3>
              {folderNotes.map((note) => (
                <Card 
                  key={note.id} 
                  className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/app/editor/${note.id}`)}
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{note.title}</p>
                        {note.isFavorite && (
                          <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {note.content || 'No content'}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {note.category}
                        </Badge>
                        {note.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{note.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

  // Note preview
  return (
    <div className="h-full flex flex-col">
      {/* Note Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-foreground" />
            {selectedItem.isFavorite && (
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
            )}
            {selectedItem.reminder_enabled && (
              <Clock className="w-5 h-5 text-orange-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-lg leading-tight">{selectedItem.title}</h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{selectedItem.category}</span>
              <span>•</span>
              <span>{new Date(selectedItem.modifiedDate).toLocaleDateString()}</span>
              <span>•</span>
              <span>{selectedItem.content?.length || 0} characters</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {selectedItem.tags && selectedItem.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedItem.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => navigate(`/app/editor/${selectedItem.id}`)}
            className="flex-1"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Note
          </Button>
          {selectedItem.reminder_enabled && selectedItem.reminder_date && (
            <Button size="sm" variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              {new Date(selectedItem.reminder_date).toLocaleDateString()}
            </Button>
          )}
        </div>
      </div>

      {/* Note Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {selectedItem.content ? (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedItem.content}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">This note is empty</p>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-3"
                onClick={() => navigate(`/app/editor/${selectedItem.id}`)}
              >
                Start writing
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Note Footer Info */}
      <div className="border-t bg-muted/30 p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Created {new Date(selectedItem.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>Modified {new Date(selectedItem.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>You</span>
          </div>
        </div>
      </div>
    </div>
  );
};