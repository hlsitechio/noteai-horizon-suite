import React from 'react';

export interface PreviewNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isNew?: boolean;
}

const NotePreviewPanel: React.FC = () => {
  return (
    <div className="p-4 text-center text-muted-foreground">
      <p>Note preview temporarily disabled</p>
    </div>
  );
};

export default NotePreviewPanel;