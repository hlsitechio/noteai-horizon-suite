import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { AIResponse as AIResponseType } from '../types/ai';
import { toast } from 'sonner';

interface AIResponseProps {
  response: AIResponseType;
  onInsert: () => void;
  onReplace: () => void;
  onRate: (interactionId: string, rating: number) => void;
  showActions: boolean;
}

const AIResponse: React.FC<AIResponseProps> = ({
  response,
  onInsert,
  onReplace,
  onRate,
  showActions
}) => {
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response.result);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleRate = (rating: number) => {
    onRate(response.sessionId, rating);
    setRated(true);
    toast.success('Thanks for your feedback!');
  };

  return (
    <div className="space-y-3">
      {/* Response Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            AI Result
          </Badge>
          <Badge variant="outline" className="text-xs">
            {response.model}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {response.processingTime}ms
          </Badge>
          {response.confidence && (
            <Badge variant="outline" className="text-xs">
              {Math.round(response.confidence * 100)}% confidence
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2"
        >
          <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : ''}`} />
        </Button>
      </div>
      
      {/* Response Content */}
      <div className="bg-muted/50 p-4 rounded-lg text-sm max-h-40 overflow-y-auto border">
        <pre className="whitespace-pre-wrap font-sans">{response.result}</pre>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onInsert}
            className="flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            Insert
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onReplace}
            className="flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Replace
          </Button>
        </div>
      )}

      {/* Similar Notes Context */}
      {response.similarNotes && response.similarNotes.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <Separator className="my-2" />
          <p className="font-medium mb-1">Context from {response.similarNotes.length} similar notes:</p>
          <div className="space-y-1">
            {response.similarNotes.slice(0, 2).map((note, idx) => (
              <div key={idx} className="truncate">
                • {note.title} ({Math.round(note.relevance * 100)}% relevant)
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating Section */}
      {!rated && (
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-xs text-muted-foreground">Rate this response:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRate(1)}
            className="h-6 w-6 p-0 hover:text-green-600"
          >
            <ThumbsUp className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRate(-1)}
            className="h-6 w-6 p-0 hover:text-red-600"
          >
            <ThumbsDown className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIResponse;