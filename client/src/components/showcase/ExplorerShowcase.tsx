import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Star, 
  Search,
  Calendar,
  ChevronDown,
  ChevronRight,
  Grid3x3,
  List,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExplorerItem {
  id: string;
  name: string;
  type: 'folder' | 'note';
  isFavorite?: boolean;
  isOpen?: boolean;
  children?: ExplorerItem[];
  date: string;
  preview?: string;
  noteCount?: number;
}

const mockData: ExplorerItem[] = [
  {
    id: 'favorites',
    name: 'Favorites',
    type: 'folder',
    isOpen: true,
    date: '',
    children: [
      { id: 'fav1', name: '2', type: 'note', isFavorite: true, date: '16/07/2025', preview: 'Empty note' },
      { id: 'fav2', name: '1', type: 'note', isFavorite: true, date: '15/07/2025', preview: 'Empty note' }
    ]
  },
  {
    id: 'folders',
    name: 'Folders',
    type: 'folder',
    isOpen: true,
    date: '',
    children: [
      {
        id: 'folder1',
        name: 'this is a new folder with red label',
        type: 'folder',
        date: '11/07/2025',
        noteCount: 0,
        children: []
      },
      {
        id: 'folder2',
        name: 'New Folder',
        type: 'folder',
        date: '10/07/2025',
        noteCount: 2,
        children: [
          { id: 'note1', name: '2', type: 'note', date: '11/07/2025', preview: 'Empty note' },
          { id: 'note2', name: '1', type: 'note', date: '10/07/2025', preview: 'Empty note' }
        ]
      }
    ]
  },
  {
    id: 'notes',
    name: 'Notes',
    type: 'folder',
    isOpen: true,
    date: '',
    children: [
      { id: 'note3', name: 'New Note', type: 'note', date: '16/07/2025', preview: 'Empty note' },
      { id: 'note4', name: 'New Note', type: 'note', date: '15/07/2025', preview: 'Empty note' },
      { id: 'note5', name: '2', type: 'note', isFavorite: true, date: '11/07/2025', preview: 'Empty note' },
      { id: 'note6', name: 'New Note', type: 'note', date: '10/07/2025', preview: 'Empty note' },
      { id: 'note7', name: 'test sync', type: 'note', date: '09/07/2025', preview: 'Empty note' },
      { id: 'note8', name: 'Untitled Note', type: 'note', date: '08/07/2025', preview: 'Empty note' },
      { id: 'note9', name: '1', type: 'note', isFavorite: true, date: '07/07/2025', preview: 'Empty note' }
    ]
  }
];

const gridItems = [
  { id: 'g1', name: 'New Note', type: 'note', date: '16/07/2025', preview: 'Empty note' },
  { id: 'g2', name: 'New Note', type: 'note', date: '16/07/2025', preview: 'Empty note' },
  { id: 'g3', name: '2', type: 'note', isFavorite: true, date: '15/07/2025', preview: 'Empty note' },
  { id: 'g4', name: 'New Note', type: 'note', date: '15/07/2025', preview: 'Empty note' },
  { id: 'g5', name: 'test sync', type: 'note', date: '15/07/2025', preview: 'Empty note' },
  { id: 'g6', name: 'Untitled Note', type: 'note', date: '15/07/2025', preview: 'Empty note' },
  { id: 'g7', name: '1', type: 'note', isFavorite: true, date: '15/07/2025', preview: 'Empty note' },
  { id: 'g8', name: 'this is a new...', type: 'folder', date: '11/07/2025', noteCount: 0 },
  { id: 'g9', name: '11', type: 'note', date: '11/07/2025', preview: '{{*type*:"" {{*text*:"' },
  { id: 'g10', name: 'New Folder', type: 'folder', date: '10/07/2025', noteCount: 2 }
];

export const ExplorerShowcase: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>('folder1');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['favorites', 'folders', 'notes']));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const SidebarItem: React.FC<{ item: ExplorerItem; level: number }> = ({ item, level }) => {
    const isExpanded = expandedFolders.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div>
        <motion.div
          className={cn(
            "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer text-sm transition-colors",
            selectedItem === item.id ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={() => {
            if (item.type === 'folder' && hasChildren) {
              toggleFolder(item.id);
            }
            setSelectedItem(item.id);
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {item.type === 'folder' && hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-3 h-3" />
            </motion.div>
          )}
          
          {item.type === 'folder' ? (
            isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          
          <span className="flex-1 truncate">{item.name}</span>
          
          {item.isFavorite && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
          
          {item.type === 'folder' && item.children && (
            <span className="text-xs text-muted-foreground">({item.children.length})</span>
          )}
        </motion.div>

        <AnimatePresence>
          {item.type === 'folder' && isExpanded && item.children && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {item.children.map((child) => (
                <SidebarItem key={child.id} item={child} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const GridItem: React.FC<{ item: any }> = ({ item }) => (
    <motion.div
      className={cn(
        "relative bg-card/50 border border-border/50 rounded-lg p-4 cursor-pointer transition-all duration-200",
        selectedItem === item.id ? "border-primary bg-primary/5" : "hover:border-border hover:bg-card/70"
      )}
      onClick={() => setSelectedItem(item.id)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="relative">
          {item.type === 'folder' ? (
            <Folder className="w-8 h-8 text-primary" />
          ) : (
            <FileText className="w-8 h-8 text-foreground" />
          )}
          {item.isFavorite && (
            <Star className="absolute -top-1 -right-1 w-3 h-3 fill-yellow-400 text-yellow-400" />
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium truncate max-w-full">{item.name}</p>
          {item.type === 'note' && (
            <p className="text-xs text-muted-foreground">{item.preview}</p>
          )}
          {item.type === 'folder' && item.noteCount !== undefined && (
            <p className="text-xs text-muted-foreground">{item.noteCount} notes</p>
          )}
          <p className="text-xs text-muted-foreground">{item.date}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full h-[500px] bg-background border border-border rounded-lg overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium ml-2">File Explorer</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              className="pl-7 pr-3 py-1 text-xs bg-muted/50 border border-border/50 rounded-md w-32"
              placeholder="Search..."
            />
          </div>
          <div className="flex border border-border/50 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1 text-xs transition-colors",
                viewMode === 'grid' ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
              )}
            >
              <Grid3x3 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1 text-xs transition-colors",
                viewMode === 'list' ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
              )}
            >
              <List className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(500px-60px)]">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card/20 p-3 overflow-y-auto">
          <div className="space-y-1">
            {mockData.map((item) => (
              <SidebarItem key={item.id} item={item} level={0} />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "gap-4",
              viewMode === 'grid' 
                ? "grid grid-cols-4" 
                : "flex flex-col space-y-2"
            )}
          >
            {gridItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {viewMode === 'grid' ? (
                  <GridItem item={item} />
                ) : (
                  <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    {item.type === 'folder' ? (
                      <Folder className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-foreground flex-shrink-0" />
                    )}
                    <span className="flex-1 text-sm truncate">{item.name}</span>
                    {item.isFavorite && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />}
                    <span className="text-xs text-muted-foreground flex-shrink-0">{item.date}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Preview Panel */}
        <div className="w-80 border-l border-border bg-card/20 p-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Preview</h3>
            
            <motion.div
              key={selectedItem}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">this is a new folder with red label</p>
                  <p className="text-xs text-muted-foreground">0 notes</p>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Created 11/07/2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Modified 11/07/2025</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted/30 rounded-lg text-center">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">This folder is empty</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};