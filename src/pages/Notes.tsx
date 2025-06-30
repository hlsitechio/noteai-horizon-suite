
import React, { useState } from 'react';
import { BookOpen, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Welcome to Notes',
      content: 'This is your first note. You can create, edit, and manage your notes here.',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Getting Started',
      content: 'Click the "New Note" button to create your first note.',
      createdAt: new Date().toISOString(),
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notes</h1>
            <p className="text-muted-foreground">Manage your notes and ideas</p>
          </div>
        </div>
        <Button onClick={handleCreateNote} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <CardDescription>
                {new Date(note.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {note.content || 'No content yet...'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No notes found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try a different search term" : "Create your first note to get started"}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreateNote}>
              <Plus className="w-4 h-4 mr-2" />
              Create your first note
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;
