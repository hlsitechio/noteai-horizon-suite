
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFolders } from '../contexts/FoldersContext';
import { useNotes } from '../contexts/NotesContext';
import { Folder as FolderType } from '../types/folder';
import { Note } from '../types/note';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  ArrowLeft, 
  FileText, 
  Plus, 
  Star,
  Calendar,
  Tag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const FolderDetail: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();
  const { folders } = useFolders();
  const { notes, createNote, setCurrentNote } = useNotes();
  const [folder, setFolder] = useState<FolderType | null>(null);
  const [folderNotes, setFolderNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (folderId) {
      const foundFolder = folders.find(f => f.id === folderId);
      if (foundFolder) {
        setFolder(foundFolder);
        const notesInFolder = notes.filter(note => note.folder_id === folderId);
        setFolderNotes(notesInFolder);
      } else {
        navigate('/app/notes');
      }
    }
  }, [folderId, folders, notes, navigate]);

  const handleCreateNote = async () => {
    if (!folder) return;
    
    const newNote = await createNote({
      title: 'Untitled Note',
      content: '',
      category: 'general',
      tags: [],
      isFavorite: false,
      folder_id: folder.id
    });
    
    setCurrentNote(newNote);
    navigate('/app/editor');
  };

  const handleNoteClick = (note: Note) => {
    setCurrentNote(note);
    navigate(`/app/notes?note=${note.id}`);
  };

  if (!folder) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading folder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/notes')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: folder.color }}
            >
              <Folder className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{folder.name}</h1>
              <p className="text-sm text-muted-foreground">
                {folderNotes.length} {folderNotes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={handleCreateNote}>
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folderNotes.length > 0 ? (
          folderNotes.map((note) => (
            <Card 
              key={note.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleNoteClick(note)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2 flex-1">
                    {note.title}
                  </CardTitle>
                  {note.isFavorite && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0 ml-2" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {note.content && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {note.content.replace(/[#*_`]/g, '').substring(0, 150)}
                      {note.content.length > 150 ? '...' : ''}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {note.category}
                    </Badge>
                  </div>
                  
                  {note.tags.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {note.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{note.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No notes in this folder</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start organizing your thoughts by creating your first note in this folder.
                </p>
                <Button onClick={handleCreateNote}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Note
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderDetail;
