
import React, { useState } from 'react';
import { PencilIcon, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Editor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log('Saving note:', { title, content });
    // Here you would typically save to local storage or a backend
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <PencilIcon className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Editor</h1>
            <p className="text-muted-foreground">Create and edit your notes</p>
          </div>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Note
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Note Editor
          </CardTitle>
          <CardDescription>
            Write your thoughts, ideas, and notes here
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content
            </label>
            <Textarea
              id="content"
              placeholder="Start writing your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Editor;
