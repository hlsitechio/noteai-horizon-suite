import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import PlainTextEditor from './PlainTextEditor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EditorContentProps {
  title: string;
  content: string;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  isSaving: boolean;
  isMobile: boolean;
  isTablet: boolean;
  canSave: boolean;
  placeholder?: string;
}

const EditorContent: React.FC<EditorContentProps> = ({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  isSaving,
  isMobile,
  isTablet,
  canSave,
  placeholder = "Start writing your masterpiece..."
}) => {
  const [useRichEditor, setUseRichEditor] = useState(!isMobile);

  const toggleEditor = () => {
    setUseRichEditor(!useRichEditor);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Type Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant={useRichEditor ? "default" : "outline"}
            size="sm"
            onClick={toggleEditor}
          >
            {useRichEditor ? "Rich Editor" : "Simple Editor"}
          </Button>
          
          {isMobile && (
            <Badge variant="outline" className="text-xs">
              Mobile Mode
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
          <span>Characters: {content.length}</span>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 min-h-0">
        {useRichEditor ? (
          <RichTextEditor
            value={content}
            onChange={onContentChange}
            placeholder={placeholder}
            onSave={onSave}
            canSave={canSave}
            isSaving={isSaving}
            isMobile={isMobile}
          />
        ) : (
          <PlainTextEditor
            value={content}
            onChange={onContentChange}
            placeholder={placeholder}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
};

export default EditorContent;