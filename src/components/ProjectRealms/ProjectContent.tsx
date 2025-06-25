
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FolderOpen, Plus, Folder, FileText, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ProjectFolder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

interface ProjectNote {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

const ProjectContent: React.FC = () => {
  const [folders, setFolders] = useState<ProjectFolder[]>([]);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [isAddContentOpen, setIsAddContentOpen] = useState(false);
  const [contentType, setContentType] = useState<'folder' | 'note'>('folder');
  const [folderName, setFolderName] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    
    const newFolder: ProjectFolder = {
      id: Date.now().toString(),
      name: folderName.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString(),
    };
    
    setFolders(prev => [...prev, newFolder]);
    setFolderName('');
    setIsAddContentOpen(false);
    toast.success('Folder created successfully');
  };

  const handleCreateNote = async () => {
    if (!noteTitle.trim()) return;
    
    const newNote: ProjectNote = {
      id: Date.now().toString(),
      title: noteTitle.trim(),
      content: noteContent.trim(),
      folderId: selectedFolder || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setNotes(prev => [...prev, newNote]);
    setNoteTitle('');
    setNoteContent('');
    setSelectedFolder('');
    setIsAddContentOpen(false);
    toast.success('Note created successfully');
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('Are you sure you want to delete this folder? All notes in this folder will be moved to unorganized.')) {
      setFolders(prev => prev.filter(f => f.id !== folderId));
      setNotes(prev => prev.map(note => 
        note.folderId === folderId 
          ? { ...note, folderId: undefined }
          : note
      ));
      toast.success('Folder deleted successfully');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
      toast.success('Note deleted successfully');
    }
  };

  const getNotesInFolder = (folderId?: string) => {
    return notes.filter(note => note.folderId === folderId);
  };

  const unorganizedNotes = getNotesInFolder(undefined);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FolderOpen className="h-5 w-5 mr-2" />
            Folders & Notes
          </CardTitle>
          <Dialog open={isAddContentOpen} onOpenChange={setIsAddContentOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={contentType === 'folder' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContentType('folder')}
                  >
                    <Folder className="h-4 w-4 mr-2" />
                    Folder
                  </Button>
                  <Button
                    variant={contentType === 'note' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setContentType('note')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Note
                  </Button>
                </div>

                {contentType === 'folder' ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Folder name"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleCreateFolder} className="flex-1">
                        Create Folder
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddContentOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Input
                      placeholder="Note title"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Note content"
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      rows={4}
                    />
                    {folders.length > 0 && (
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                      >
                        <option value="">No folder (Unorganized)</option>
                        {folders.map(folder => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={handleCreateNote} className="flex-1">
                        Create Note
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddContentOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {folders.length === 0 && notes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No content yet</p>
              <p>Start by adding folders and notes to organize your project knowledge.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Folders */}
              {folders.map(folder => (
                <div key={folder.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: folder.color }}
                      />
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{folder.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({getNotesInFolder(folder.id).length} notes)
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit3 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteFolder(folder.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Notes in folder */}
                  <div className="space-y-2 ml-6">
                    {getNotesInFolder(folder.id).map(note => (
                      <div key={note.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{note.title}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Unorganized Notes */}
              {unorganizedNotes.length > 0 && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Unorganized Notes</span>
                    <span className="text-xs text-muted-foreground">
                      ({unorganizedNotes.length} notes)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {unorganizedNotes.map(note => (
                      <div key={note.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{note.title}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteNote(note.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectContent;
