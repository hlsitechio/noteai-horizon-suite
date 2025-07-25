import React, { useState, useMemo, useEffect } from 'react';
import { Search, Grid3X3, List, MoreHorizontal, SortAsc, Filter, Star, Clock, FileText, Folder, Plus, ArrowLeft, ArrowRight, ChevronDown, Eye, EyeOff, Calendar, Heart, Upload, Database } from 'lucide-react';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { useFolders } from '@/contexts/FoldersContext';
import { useQuantumAIIntegration } from '@/hooks/useQuantumAIIntegration';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { useDocuments } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CreateItemDialog } from '@/components/Explorer/CreateItemDialog';
import { CreateItemDropdown } from '@/components/Explorer/CreateItemDropdown';
import { DocumentImportDialog } from '@/components/Explorer/DocumentImportDialog';
import { PreviewPanel } from '@/components/Explorer/PreviewPanel';
import { FolderTree } from '@/components/Explorer/FolderTree';
import { NotesSection } from '@/components/Layout/Sidebar/NotesSection';
import { StorageIndicator } from '@/components/Storage/StorageIndicator';

type ViewMode = 'extra-large' | 'large' | 'medium' | 'small' | 'list' | 'details';
type SortBy = 'name' | 'modified' | 'created' | 'size' | 'category';
type SortOrder = 'asc' | 'desc';

const NotesExplorer: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const { filteredNotes, filters, notes, selectedNote } = useOptimizedNotes();
  const { folders } = useFolders();
  const { documents, fetchDocuments } = useDocuments();

  // Listen for settings sync events to refresh data
  useEffect(() => {
    const handleSettingsSync = () => {
      console.log('Settings sync detected - refreshing NotesExplorer data');
      fetchDocuments();
      // Note: notes are managed by OptimizedNotesContext which may have its own refresh mechanism
    };

    window.addEventListener('settingsSync', handleSettingsSync);
    return () => window.removeEventListener('settingsSync', handleSettingsSync);
  }, [fetchDocuments]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Explorer state
  const [viewMode, setViewMode] = useState<ViewMode>('large');
  const [sortBy, setSortBy] = useState<SortBy>('modified');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [previewVisible, setPreviewVisible] = useState(true);
  const [treeVisible, setTreeVisible] = useState(true);
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(folderId || null);

  // Update selectedFolderId when URL parameter changes
  useEffect(() => {
    setSelectedFolderId(folderId || null);
  }, [folderId]);

  useQuantumAIIntegration({
    page: '/app/explorer',
    content: `Notes Explorer with ${notes.length} notes and ${folders.length} folders. Current view: ${viewMode}`,
    metadata: {
      hasNotes: notes.length > 0,
      selectedNote: selectedNote?.id,
      folders: folders.length,
      totalNotes: notes.length,
      viewMode,
      sortBy,
      selectedItems: selectedItems.size
    }
  });

  // Combined and sorted items (filtered by selected folder if any)
  const sortedItems = useMemo(() => {
    type CombinedItem = {
      id: string;
      type: 'folder' | 'note' | 'document';
      displayName: string;
      modifiedDate: Date;
      createdAt?: Date | string; // Made optional to match Note interface
      [key: string]: any;
    };

    // Filter notes by selected folder
    let notesToShow = filteredNotes;
    if (selectedFolderId) {
      if (selectedFolderId === 'unorganized') {
        notesToShow = filteredNotes.filter(note => !note.folder_id);
      } else {
        notesToShow = filteredNotes.filter(note => note.folder_id === selectedFolderId);
      }
    }

    // Filter documents by selected folder
    let documentsToShow = documents;
    if (selectedFolderId) {
      if (selectedFolderId === 'unorganized') {
        documentsToShow = documents.filter(doc => !doc.folder_id);
      } else {
        documentsToShow = documents.filter(doc => doc.folder_id === selectedFolderId);
      }
    }

    // Filter by search term
    notesToShow = notesToShow.filter(note => 
      searchTerm === '' || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    documentsToShow = documentsToShow.filter(doc => 
      searchTerm === '' || 
      doc.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    let allItems: CombinedItem[] = [
      // Only show folders if no specific folder is selected
      ...(selectedFolderId ? [] : folders.map(folder => ({ 
        ...folder, 
        type: 'folder' as const, 
        displayName: folder.name,
        modifiedDate: folder.updatedAt 
      }))),
      ...notesToShow.map(note => ({ 
        ...note, 
        type: 'note' as const, 
        displayName: note.title,
        modifiedDate: new Date(note.updatedAt) 
      })),
      ...documentsToShow.map(doc => ({ 
        ...doc, 
        type: 'document' as const, 
        displayName: doc.original_name,
        modifiedDate: new Date(doc.updated_at) 
      }))
    ];

    // Sort items
    allItems.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.displayName;
          bValue = b.displayName;
          break;
        case 'modified':
          aValue = new Date(a.modifiedDate);
          bValue = new Date(b.modifiedDate);
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'category':
          aValue = a.type === 'note' ? a.category : 'folder';
          bValue = b.type === 'note' ? b.category : 'folder';
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    // Folders first if sorting by name
    if (sortBy === 'name') {
      const folders = allItems.filter(item => item.type === 'folder');
      const notes = allItems.filter(item => item.type === 'note');
      return [...folders, ...notes];
    }

    return allItems;
  }, [folders, filteredNotes, searchTerm, sortBy, sortOrder, selectedFolderId]);

  // Get current folder info for breadcrumb
  const currentFolder = selectedFolderId ? folders.find(f => f.id === selectedFolderId) : null;

  const handleItemClick = (item: any, event: React.MouseEvent) => {
    // Handle selection first
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      toggleItemSelection(item.id);
    } else {
      // Single select
      setSelectedItems(new Set([item.id]));
    }
  };

  const handleItemDoubleClick = (item: any) => {
    if (item.type === 'folder') {
      // Navigate into the folder
      navigate(`/app/explorer/${item.id}`);
    } else if (item.type === 'document') {
      // Open document in new tab
      window.open(item.file_url, '_blank');
    } else if (item.type === 'note') {
      // Open note in editor
      navigate(`/app/editor/${item.id}`);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getItemIcon = (item: any) => {
    if (item.type === 'folder') return Folder;
    if (item.isFavorite) return Star;
    return FileText;
  };

  const getItemPreview = (item: any) => {
    if (item.type === 'folder') {
      const noteCount = notes.filter(note => note.folder_id === item.id).length;
      return `${noteCount} notes`;
    }
    return item.content ? item.content.substring(0, 150) + '...' : 'Empty note';
  };

  const getGridColumns = () => {
    switch (viewMode) {
      case 'extra-large': return 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'large': return 'grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6';
      case 'medium': return 'grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10';
      case 'small': return 'grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 2xl:grid-cols-16';
      default: return 'grid-cols-1';
    }
  };

  const getItemSize = () => {
    switch (viewMode) {
      case 'extra-large': return 'min-h-[180px]';
      case 'large': return 'min-h-[140px]';
      case 'medium': return 'min-h-[100px]';
      case 'small': return 'min-h-[80px]';
      default: return 'min-h-[60px]';
    }
  };

  const renderGridItem = (item: any) => {
    const Icon = getItemIcon(item);
    const isSelected = selectedItems.has(item.id);
    const displayName = item.displayName;

    return (
      <Card
        key={item.id}
        className={cn(
          "group cursor-pointer transition-all duration-200 hover:shadow-lg",
          "border-2 hover:border-primary/30 active:scale-95",
          isSelected ? "border-primary bg-primary/5" : "border-border",
          getItemSize()
        )}
        onClick={(e) => handleItemClick(item, e)}
        onDoubleClick={() => handleItemDoubleClick(item)}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleItemSelection(item.id);
        }}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Icon and badges */}
          <div className="flex items-start justify-between mb-3">
            <div className="relative">
              <Icon className={cn(
                "transition-colors",
                item.type === 'folder' ? "text-blue-500" : "text-foreground",
                item.isFavorite && "text-yellow-500",
                viewMode === 'extra-large' ? "w-8 h-8" :
                viewMode === 'large' ? "w-6 h-6" :
                viewMode === 'medium' ? "w-5 h-5" : "w-4 h-4"
              )} />
              {item.type === 'note' && item.isFavorite && (
                <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
            
            {item.type === 'note' && (
              <div className="flex flex-col gap-1">
                {item.reminder_enabled && (
                  <Clock className="w-4 h-4 text-orange-500" />
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={cn(
            "font-medium text-foreground line-clamp-2 mb-2",
            viewMode === 'extra-large' ? "text-base" :
            viewMode === 'large' ? "text-sm" : "text-xs"
          )}>
            {displayName}
          </h3>

          {/* Preview text for larger views */}
          {(viewMode === 'extra-large' || viewMode === 'large') && (
            <p className="text-xs text-muted-foreground line-clamp-3 mb-auto">
              {getItemPreview(item)}
            </p>
          )}

          {/* Tags and metadata */}
          <div className="mt-auto space-y-2">
            {item.type === 'note' && item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
                {item.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{item.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              {new Date(item.modifiedDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderListItem = (item: any) => {
    const Icon = getItemIcon(item);
    const isSelected = selectedItems.has(item.id);
    const displayName = item.displayName;

    return (
      <div
        key={item.id}
        className={cn(
          "group flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all",
          "hover:bg-accent/50 active:bg-accent",
          isSelected ? "bg-primary/5 border border-primary" : "border border-transparent"
        )}
        onClick={(e) => handleItemClick(item, e)}
        onDoubleClick={() => handleItemDoubleClick(item)}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleItemSelection(item.id);
        }}
      >
        <Icon className={cn(
          "flex-shrink-0 w-4 h-4",
          item.type === 'folder' ? "text-blue-500" : "text-foreground",
          item.isFavorite && "text-yellow-500"
        )} />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{displayName}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {getItemPreview(item)}
          </p>
        </div>
        
        {item.type === 'note' && item.tags && item.tags.length > 0 && (
          <div className="flex gap-1">
            {item.tags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          {new Date(item.modifiedDate).toLocaleDateString()}
        </div>
        
        {item.type === 'note' && item.isFavorite && (
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left side - Navigation and actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Button size="sm" variant="ghost" disabled>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" disabled>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <CreateItemDialog type="note">
              <Button size="sm" variant="ghost">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </CreateItemDialog>
            
            <CreateItemDialog type="folder">
              <Button size="sm" variant="ghost">
                <Folder className="w-4 h-4 mr-2" />
                New Folder
              </Button>
            </CreateItemDialog>
            
            <DocumentImportDialog onImportComplete={fetchDocuments}>
              <Button size="sm" variant="ghost">
                <Upload className="w-4 h-4 mr-2" />
                Import Documents
              </Button>
            </DocumentImportDialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Plus className="w-4 h-4 mr-2" />
                  More
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <CreateItemDropdown type="favorite">
                  <DropdownMenuItem>
                    <Star className="w-4 h-4 mr-2" />
                    New Favorite
                  </DropdownMenuItem>
                </CreateItemDropdown>
                <CreateItemDropdown type="event">
                  <DropdownMenuItem>
                    <Calendar className="w-4 h-4 mr-2" />
                    New Event
                  </DropdownMenuItem>
                </CreateItemDropdown>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center - Breadcrumb and Search */}
          <div className="flex-1 max-w-md mx-8">
            {/* Breadcrumb */}
            {currentFolder && (
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <span 
                  className="hover:text-foreground cursor-pointer"
                  onClick={() => {
                    setSelectedFolderId(null);
                    navigate('/app/explorer');
                  }}
                >
                  All Notes
                </span>
                <span>/</span>
                <span className="text-foreground font-medium">{currentFolder.name}</span>
              </div>
            )}
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={selectedFolderId ? `Search in ${currentFolder?.name || 'folder'}...` : "Search notes and folders..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Right side - View controls */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant={treeVisible ? "default" : "ghost"}
              onClick={() => setTreeVisible(!treeVisible)}
              title={treeVisible ? "Hide Content Sidebar" : "Show Content Sidebar"}
            >
              <Folder className="w-4 h-4 mr-1" />
              Content
            </Button>
            
            <Button
              size="sm"
              variant={previewVisible ? "default" : "ghost"}
              onClick={() => setPreviewVisible(!previewVisible)}
              title={previewVisible ? "Hide Preview Panel" : "Show Preview Panel"}
            >
              {previewVisible ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              Preview
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open('/app/settings?tab=integrations', '_blank')}
              title="Storage Management"
            >
              <Database className="w-4 h-4 mr-1" />
              Storage
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="modified">Modified</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <SortAsc className={cn("w-4 h-4", sortOrder === 'desc' && "rotate-180")} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewMode('extra-large')}>
                  Extra Large Icons
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode('large')}>
                  Large Icons
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode('medium')}>
                  Medium Icons
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode('small')}>
                  Small Icons
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setViewMode('list')}>
                  <List className="w-4 h-4 mr-2" />
                  List
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setViewMode('details')}>
                  Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Content Sidebar */}
          {treeVisible && (
            <>
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                <div className="h-full border-r bg-background flex flex-col">
                  <ScrollArea className="flex-1">
                    <NotesSection onFolderSelect={(folderId) => setSelectedItems(new Set([folderId]))} />
                  </ScrollArea>
                  
                  {/* Storage Indicator at bottom of sidebar */}
                  <div className="p-4 border-t bg-card/50">
                    <StorageIndicator variant="compact" showUpgrade={true} />
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle 
                withHandle 
                onDoubleClick={() => setTreeVisible(false)}
                className="cursor-pointer"
                title="Double-click to hide Content Sidebar"
              />
            </>
          )}

          {/* Main explorer area */}
          <ResizablePanel defaultSize={previewVisible ? (treeVisible ? 50 : 70) : (treeVisible ? 80 : 100)} minSize={40}>
            <div className="h-full p-6 overflow-auto">
              {sortedItems.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {selectedFolderId ? 
                      (selectedFolderId === 'unorganized' ? 'No unorganized notes' : `No items in ${currentFolder?.name}`) : 
                      'No items found'
                    }
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 
                      'No notes or folders match your search.' : 
                      (selectedFolderId ? 'This folder is empty.' : 'Create your first note or folder.')
                    }
                  </p>
                </div>
              ) : viewMode === 'list' || viewMode === 'details' ? (
                <div className="space-y-1">
                  {sortedItems.map(renderListItem)}
                </div>
              ) : (
                <div className={cn("grid gap-4", getGridColumns())}>
                  {sortedItems.map(renderGridItem)}
                </div>
              )}
            </div>
          </ResizablePanel>

          {/* Preview panel */}
          {previewVisible && (
            <>
              <ResizableHandle 
                withHandle 
                onDoubleClick={() => setPreviewVisible(false)}
                className="cursor-pointer"
                title="Double-click to hide Preview Panel"
              />
              <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                <div className="h-full border-l bg-card/30">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Preview</h3>
                  </div>
                  <div className="h-[calc(100%-60px)]">
                    <PreviewPanel 
                      selectedItems={selectedItems} 
                      allItems={sortedItems}
                    />
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Status bar */}
      <div className="border-t bg-card/50 px-6 py-2 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>
            {selectedItems.size > 0 ? `${selectedItems.size} selected • ` : ''}
            {sortedItems.length} items • {notes.length} notes • {folders.length} folders
            {selectedFolderId && currentFolder && ` • in ${currentFolder.name}`}
          </span>
          <span>Ready</span>
        </div>
      </div>
    </div>
  );
};

export default NotesExplorer;