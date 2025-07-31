import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface PreviewNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isNew?: boolean;
}

interface NotePreviewPanelProps {
  note?: PreviewNote | null;
}

const NotePreviewPanel: React.FC<NotePreviewPanelProps> = ({ note }) => {
  if (!note) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No note selected
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{note.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {note.content}
        </div>
      </CardContent>
    </Card>
  );
};

export { NotePreviewPanel };
export default NotePreviewPanel;