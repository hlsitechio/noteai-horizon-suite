import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Document {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

interface PreviewPanelProps {
  document: Document | null;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ document }) => {
  if (!document) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a document to preview
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{document.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {document.content}
        </div>
        {document.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {document.tags.map(tag => (
              <span key={tag} className="bg-muted px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { PreviewPanel };
export default PreviewPanel;