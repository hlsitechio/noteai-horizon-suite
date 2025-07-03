import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RichTextEditor from './RichTextEditor';

const EditorControlsTest: React.FC = () => {
  const [content, setContent] = useState('');

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Live Editor Test</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)]">
          <div className="h-full">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Test all the editor features here! Try keyboard shortcuts, formatting buttons, and all the tools."
              canSave={true}
              isSaving={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorControlsTest;