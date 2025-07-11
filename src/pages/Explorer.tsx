import React, { useState, useEffect } from 'react';
import { Plus, Home, FolderOpen, Cloud, HardDrive, Upload, Download, Search, MoreHorizontal, Grid3X3, List, ArrowUp, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { supabase } from '@/integrations/supabase/client';
import { GoogleDriveService } from '@/services/googleDriveService';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modifiedDate: string;
  source: 'supabase' | 'google-drive';
  path?: string;
  mimeType?: string;
  url?: string;
}

interface ExplorerTab {
  id: string;
  title: string;
  path: string;
  isActive: boolean;
}

const Explorer: React.FC = () => {
  const [tabs, setTabs] = useState<ExplorerTab[]>([
    { id: '1', title: 'Explorer', path: '/', isActive: true }
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [leftPanelFiles, setLeftPanelFiles] = useState<FileItem[]>([]);
  const [rightPanelFiles, setRightPanelFiles] = useState<FileItem[]>([]);
  const [currentLeftPath, setCurrentLeftPath] = useState('/');
  const [currentRightPath, setCurrentRightPath] = useState('/');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Load files from Supabase buckets
  const loadSupabaseFiles = async () => {
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) throw bucketsError;

      const allFiles: FileItem[] = [];
      
      for (const bucket of buckets) {
        if (bucket.public) {
          const { data: files, error: filesError } = await supabase.storage
            .from(bucket.name)
            .list('', { limit: 100 });
          
          if (!filesError && files) {
            const bucketFiles: FileItem[] = files.map(file => ({
              id: `supabase-${bucket.name}-${file.name}`,
              name: file.name,
              type: (file.metadata ? 'file' : 'folder') as 'file' | 'folder',
              size: file.metadata?.size,
              modifiedDate: file.updated_at || file.created_at,
              source: 'supabase' as const,
              path: `/${bucket.name}/${file.name}`,
              mimeType: file.metadata?.mimetype,
              url: file.metadata ? supabase.storage.from(bucket.name).getPublicUrl(file.name).data.publicUrl : undefined
            }));
            allFiles.push(...bucketFiles);
          }
        }
      }
      
      return allFiles;
    } catch (error) {
      console.error('Error loading Supabase files:', error);
      return [];
    }
  };

  // Load files from Google Drive
  const loadGoogleDriveFiles = async (): Promise<FileItem[]> => {
    try {
      const files = await GoogleDriveService.listFiles();
      return files.map(file => ({
        id: `gdrive-${file.id}`,
        name: file.name,
        type: (file.mimeType.includes('folder') ? 'folder' : 'file') as 'file' | 'folder',
        size: file.size ? parseInt(file.size) : undefined,
        modifiedDate: file.modifiedTime,
        source: 'google-drive' as const,
        path: `/${file.name}`,
        mimeType: file.mimeType,
        url: file.webViewLink
      }));
    } catch (error) {
      console.error('Error loading Google Drive files:', error);
      return [];
    }
  };

  // Load all files
  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const [supabaseFiles, googleDriveFiles] = await Promise.all([
        loadSupabaseFiles(),
        loadGoogleDriveFiles()
      ]);
      
      const allFiles = [...supabaseFiles, ...googleDriveFiles];
      
      // Split files between left and right panels (example logic)
      const midPoint = Math.ceil(allFiles.length / 2);
      setLeftPanelFiles(allFiles.slice(0, midPoint));
      setRightPanelFiles(allFiles.slice(midPoint));
    } catch (error) {
      toast({
        title: "Error loading files",
        description: "Failed to load files from storage sources",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Add new tab
  const addTab = () => {
    const newTabId = Date.now().toString();
    const newTab: ExplorerTab = {
      id: newTabId,
      title: 'New Tab',
      path: '/',
      isActive: true
    };
    
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: false })).concat(newTab));
    setActiveTab(newTabId);
  };

  // Close tab
  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return; // Don't close the last tab
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    if (activeTab === tabId) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTab(newActiveTab.id);
    }
    
    setTabs(newTabs);
  };

  // Handle file drag and drop
  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    e.dataTransfer.setData('text/plain', fileId);
  };

  const handleDrop = (e: React.DragEvent, targetPanel: 'left' | 'right') => {
    e.preventDefault();
    const fileId = e.dataTransfer.getData('text/plain');
    
    if (targetPanel === 'left') {
      const file = rightPanelFiles.find(f => f.id === fileId);
      if (file) {
        setRightPanelFiles(prev => prev.filter(f => f.id !== fileId));
        setLeftPanelFiles(prev => [...prev, file]);
      }
    } else {
      const file = leftPanelFiles.find(f => f.id === fileId);
      if (file) {
        setLeftPanelFiles(prev => prev.filter(f => f.id !== fileId));
        setRightPanelFiles(prev => [...prev, file]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Filter files based on search
  const getFilteredFiles = (files: FileItem[]) => {
    if (!searchTerm) return files;
    return files.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // File icon based on type and source
  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return FolderOpen;
    if (file.source === 'google-drive') return Cloud;
    return HardDrive;
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Render file item
  const renderFileItem = (file: FileItem, panel: 'left' | 'right') => {
    const Icon = getFileIcon(file);
    const isSelected = selectedFiles.has(file.id);
    
    return (
      <div
        key={file.id}
        draggable
        onDragStart={(e) => handleDragStart(e, file.id)}
        onClick={() => {
          if (isSelected) {
            setSelectedFiles(prev => {
              const newSet = new Set(prev);
              newSet.delete(file.id);
              return newSet;
            });
          } else {
            setSelectedFiles(prev => new Set(prev).add(file.id));
          }
        }}
        className={cn(
          "group p-3 rounded-lg border cursor-pointer transition-all duration-200",
          "hover:shadow-md hover:border-primary/20",
          isSelected ? "bg-primary/10 border-primary" : "bg-card border-border",
          viewMode === 'grid' ? "min-h-[100px]" : "flex items-center space-x-3 min-h-[60px]"
        )}
      >
        <div className={cn(
          "flex items-center",
          viewMode === 'grid' ? "flex-col space-y-2" : "space-x-3 flex-1"
        )}>
          <Icon className={cn(
            "text-muted-foreground",
            viewMode === 'grid' ? "w-8 h-8" : "w-6 h-6",
            file.source === 'google-drive' ? "text-blue-500" : "text-green-500"
          )} />
          
          <div className={cn(
            viewMode === 'grid' ? "text-center" : "flex-1"
          )}>
            <p className="font-medium text-sm truncate max-w-[120px]">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
            {viewMode === 'list' && (
              <p className="text-xs text-muted-foreground">
                {new Date(file.modifiedDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        {/* Tab Bar */}
        <div className="flex items-center space-x-1 px-4 pt-2">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-t-lg cursor-pointer",
                "border-t border-l border-r",
                activeTab === tab.id 
                  ? "bg-background border-border" 
                  : "bg-muted/50 border-muted text-muted-foreground hover:bg-muted"
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">{tab.title}</span>
              {tabs.length > 1 && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-4 h-4 p-0 hover:bg-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={addTab}
            className="w-8 h-8 p-0 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost">
              <ArrowUp className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={loadFiles}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            <Button size="sm" variant="ghost">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button size="sm" variant="ghost">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Sort by name</DropdownMenuItem>
                <DropdownMenuItem>Sort by date</DropdownMenuItem>
                <DropdownMenuItem>Sort by size</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div 
              className="h-full border-r bg-background"
              onDrop={(e) => handleDrop(e, 'left')}
              onDragOver={handleDragOver}
            >
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold text-sm flex items-center">
                  <HardDrive className="w-4 h-4 mr-2" />
                  Local Storage ({leftPanelFiles.length} items)
                </h3>
              </div>
              
              <ScrollArea className="h-[calc(100%-60px)] p-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground mt-8">
                    Loading files...
                  </div>
                ) : (
                  <div className={cn(
                    "gap-3",
                    viewMode === 'grid' 
                      ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                      : "space-y-2"
                  )}>
                    {getFilteredFiles(leftPanelFiles).map(file => 
                      renderFileItem(file, 'left')
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <div 
              className="h-full bg-background"
              onDrop={(e) => handleDrop(e, 'right')}
              onDragOver={handleDragOver}
            >
              <div className="p-4 border-b bg-muted/30">
                <h3 className="font-semibold text-sm flex items-center">
                  <Cloud className="w-4 h-4 mr-2" />
                  Cloud Storage ({rightPanelFiles.length} items)
                </h3>
              </div>
              
              <ScrollArea className="h-[calc(100%-60px)] p-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground mt-8">
                    Loading files...
                  </div>
                ) : (
                  <div className={cn(
                    "gap-3",
                    viewMode === 'grid' 
                      ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                      : "space-y-2"
                  )}>
                    {getFilteredFiles(rightPanelFiles).map(file => 
                      renderFileItem(file, 'right')
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <div className="border-t bg-card/50 px-4 py-2 text-xs text-muted-foreground">
        <div className="flex justify-between items-center">
          <span>
            {selectedFiles.size} selected • {leftPanelFiles.length + rightPanelFiles.length} total items
          </span>
          <span>
            Ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default Explorer;