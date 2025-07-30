import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CopilotResponse } from '@/hooks/useAICopilot';

interface AIResultDisplayProps {
  result: string;
  response: CopilotResponse | null;
  copied: boolean;
  selectedText: string;
  onCopy: () => void;
  onInsert: () => void;
  onReplace: () => void;
  onFeedback: (rating: number) => void;
  mode?: 'bar' | 'popup';
}

const AIResultDisplay: React.FC<AIResultDisplayProps> = ({
  result,
  response,
  copied,
  selectedText,
  onCopy,
  onInsert,
  onReplace,
  onFeedback,
  mode = 'popup'
}) => {
  if (!result) return null;

  if (mode === 'bar') {
    return (
      <div className="mt-4 p-3 bg-gray-800 border border-gray-600 rounded-md">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">AI Result</Badge>
          <div className="flex gap-2">
            <Button size="sm" onClick={onInsert}>Insert</Button>
            {selectedText && (
              <Button size="sm" variant="outline" onClick={onReplace}>Replace</Button>
            )}
            <Button variant="ghost" size="sm" onClick={onCopy}>
              {copied ? '✓' : 'Copy'}
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-200 max-h-32 overflow-y-auto">
          {result}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">AI Result</Badge>
          {response && (
            <>
              <Badge variant="outline" className="text-xs">
                {response.model}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {response.processingTime}ms
              </Badge>
            </>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onCopy}>
          {copied ? '✓' : 'Copy'}
        </Button>
      </div>
      
      <div className="bg-muted/50 p-3 rounded-md text-sm max-h-40 overflow-y-auto">
        {result}
      </div>

      {/* Similar Notes Context */}
      {response?.similarNotes && response.similarNotes.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <Separator className="my-2" />
          <p className="font-medium mb-1">Context from {response.similarNotes.length} similar notes:</p>
          {response.similarNotes.map((note, idx) => (
            <p key={idx} className="truncate">• {note.title}</p>
          ))}
        </div>
      )}
      
      <div className="flex gap-2">
        <Button size="sm" onClick={onInsert} className="flex-1">
          Insert Below
        </Button>
        {selectedText && (
          <Button size="sm" variant="outline" onClick={onReplace} className="flex-1">
            Replace Selected
          </Button>
        )}
      </div>

      {/* Feedback */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <span className="text-xs text-muted-foreground">How was this result?</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFeedback(5)}
          className="h-6 w-6 p-0"
        >
          👍
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFeedback(1)}
          className="h-6 w-6 p-0"
        >
          👎
        </Button>
      </div>
    </div>
  );
};

export default AIResultDisplay;