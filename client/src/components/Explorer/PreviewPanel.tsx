import React from 'react';
import { FileText, Folder, Star, Clock, Calendar, Tag, User, Edit3 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useDocuments } from '@/hooks/useDocuments';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PreviewPanelProps {
  selectedItems: Set<string>;
  allItems: any[];
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ selectedItems, allItems }) => {
  const navigate = useNavigate();
  const { notes } = useOptimizedNotes();
  const { documents } = useDocuments();

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
                        {item.type === 'folder' ? 'Folder' : item.type === 'document' ? 'Document' : 'Note'}
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
    const folderDocuments = documents.filter(doc => doc.folder_id === selectedItem.id);
    const totalItems = folderNotes.length + folderDocuments.length;
    
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
                {totalItems} {totalItems === 1 ? 'item' : 'items'} ({folderNotes.length} notes, {folderDocuments.length} documents)
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
          {totalItems === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">This folder is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {folderNotes.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Notes ({folderNotes.length})
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
              
              {folderDocuments.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Documents ({folderDocuments.length})
                  </h3>
                  {folderDocuments.map((doc) => (
                    <Card 
                      key={doc.id} 
                      className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => window.open(doc.file_url, '_blank')}
                    >
                      <div className="flex items-start gap-3">
                        <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm truncate">{doc.original_name}</p>
                            {doc.mime_type?.startsWith('image/') && (
                              <Badge variant="outline" className="text-xs">IMAGE</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                            {doc.description || `${doc.file_type} file - ${(doc.file_size / 1024 / 1024).toFixed(2)} MB`}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {doc.file_type}
                            </Badge>
                            {doc.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {doc.tags.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{doc.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }

  // Handle different item types
  if (selectedItem.type === 'note') {
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
  }

  // Document preview
  if (selectedItem.type === 'document') {
    const isImage = selectedItem.mime_type?.startsWith('image/');
    
    return (
      <div className="h-full flex flex-col">
        {/* Document Header */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold truncate">{selectedItem.original_name}</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Modified: {format(new Date(selectedItem.updated_at), 'MMM dd, yyyy HH:mm')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Created: {format(new Date(selectedItem.created_at), 'MMM dd, yyyy HH:mm')}</span>
              </div>
            </div>

            {selectedItem.tags && selectedItem.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedItem.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.open(selectedItem.file_url, '_blank')}
              >
                <FileText className="w-4 h-4 mr-1" />
                Open
              </Button>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {/* Image preview */}
            {isImage ? (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <img 
                    src={selectedItem.file_url} 
                    alt={selectedItem.original_name}
                    className="max-w-full max-h-96 rounded-lg object-contain mx-auto"
                    loading="lazy"
                  />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Image preview - Click "Open" to view full size
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 border text-sm">
                  <div className="space-y-2">
                    <div><strong>Type:</strong> {selectedItem.file_type}</div>
                    <div><strong>Size:</strong> {(selectedItem.file_size / 1024 / 1024).toFixed(2)} MB</div>
                    <div><strong>MIME Type:</strong> {selectedItem.mime_type}</div>
                  </div>
                </div>
                
                {selectedItem.description && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Description</span>
                    <div className="bg-muted/50 rounded-lg p-3 border text-sm">
                      {selectedItem.description}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Fallback
  return (
    <div className="h-full flex items-center justify-center text-center p-6">
      <div>
        <p className="text-muted-foreground">Unknown item type</p>
      </div>
    </div>
  );
};