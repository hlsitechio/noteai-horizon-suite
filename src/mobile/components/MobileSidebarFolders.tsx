
import React from 'react';
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFolders } from '../../contexts/FoldersContext';
import { useNotes } from '../../contexts/NotesContext';

interface MobileSidebarFoldersProps {
  expandedFolders: Set<string>;
  onToggleFolder: (folderId: string) => void;
  onNavigate: (path: string) => void;
}

const MobileSidebarFolders: React.FC<MobileSidebarFoldersProps> = ({
  expandedFolders,
  onToggleFolder,
  onNavigate,
}) => {
  const { folders } = useFolders();
  const { notes } = useNotes();

  const renderFolder = (folder: any) => {
    const folderNotes = notes.filter(note => note.folder_id === folder.id);
    const isFolderExpanded = expandedFolders.has(folder.id);

    return (
      <div key={folder.id} className="space-y-1">
        <div className="flex items-center w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFolder(folder.id)}
            className="p-1 h-8 w-8 flex-shrink-0"
          >
            {isFolderExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => onNavigate(`/app/folders/${folder.id}`)}
            className="flex-1 justify-start h-10 px-2"
          >
            <div 
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
              style={{ backgroundColor: folder.color }}
            />
            <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate text-sm flex-1">{folder.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {folderNotes.length}
            </span>
          </Button>
        </div>
        
        {/* Folder Notes */}
        {isFolderExpanded && folderNotes.length > 0 && (
          <div className="ml-6 space-y-1">
            {folderNotes.slice(0, 5).map((note) => (
              <Button
                key={note.id}
                variant="ghost"
                onClick={() => onNavigate(`/mobile/notes?note=${note.id}`)}
                className="w-full justify-start h-8 px-2 text-xs"
              >
                <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{note.title}</span>
              </Button>
            ))}
            {folderNotes.length > 5 && (
              <div className="text-xs text-muted-foreground px-2">
                +{folderNotes.length - 5} more notes
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (folders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center px-2 py-1">
        <Folder className="w-4 h-4 mr-2" />
        <span className="text-sm font-medium text-muted-foreground">Folders</span>
      </div>
      <div className="space-y-1">
        {folders.map(renderFolder)}
      </div>
    </div>
  );
};

export default MobileSidebarFolders;
