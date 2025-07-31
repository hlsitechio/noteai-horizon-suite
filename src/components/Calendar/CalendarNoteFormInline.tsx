import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CalendarNoteFormInlineProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (noteData: { title: string; content: string }) => void;
}

export const CalendarNoteFormInline: React.FC<CalendarNoteFormInlineProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    const title = (document.getElementById('note-title') as HTMLInputElement).value;
    const content = (document.getElementById('note-content') as HTMLTextAreaElement).value;
    if (title.trim()) {
      onSubmit({ title, content });
      // Clear form
      (document.getElementById('note-title') as HTMLInputElement).value = '';
      (document.getElementById('note-content') as HTMLTextAreaElement).value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const title = (e.currentTarget as HTMLInputElement).value;
      const content = (document.getElementById('note-content') as HTMLTextAreaElement);
      if (title.trim()) {
        onSubmit({ title, content: content?.value || '' });
      }
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Create New Note</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="note-title" className="text-sm font-medium">Title</label>
            <input
              id="note-title"
              type="text"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter note title"
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="note-content" className="text-sm font-medium">Content</label>
            <textarea
              id="note-content"
              className="w-full px-3 py-2 border rounded-md h-32"
              placeholder="Enter note content"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              className="flex-1"
            >
              Create Note
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};