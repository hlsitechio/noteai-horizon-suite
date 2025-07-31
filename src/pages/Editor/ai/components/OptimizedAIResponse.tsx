import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
import { AIResponse as AIResponseType } from '../types/ai';
import { toast } from 'sonner';

interface OptimizedAIResponseProps {
  response: AIResponseType;
  onInsert: () => void;
  onReplace: () => void;
  onRate: (interactionId: string, rating: number) => void;
  showActions: boolean;
}

const OptimizedAIResponse: React.FC<OptimizedAIResponseProps> = ({
  response,
  onInsert,
  onReplace,
  onRate,
  showActions
}) => {
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState(false);

  // Memoized response stats
  const responseStats = useMemo(() => ({
    confidence: response.confidence ? Math.round(response.confidence * 100) : null,
    processingTime: response.processingTime,
    model: response.model,
    similarNotesCount: response.similarNotes?.length || 0
  }), [response]);

  // Optimized copy handler
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(response.result);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  }, [response.result]);

  // Optimized rating handler
  const handleRate = useCallback((rating: number) => {
    onRate(response.sessionId, rating);
    setRated(true);
    toast.success('Thanks for your feedback!');
  }, [onRate, response.sessionId]);

  // Memoized similar notes display
  const similarNotesPreview = useMemo(() => {
    if (!response.similarNotes?.length) return null;
    
    return response.similarNotes.slice(0, 2).map((note, idx) => (
      <div key={idx} className="truncate">
        • {note.title} ({Math.round(note.relevance * 100)}% relevant)
      </div>
    ));
  }, [response.similarNotes]);

  return (
    <div className="space-y-3">
      {/* Response Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            AI Result
          </Badge>
          <Badge variant="outline" className="text-xs">
            {responseStats.model}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {responseStats.processingTime}ms
          </Badge>
          {responseStats.confidence && (
            <Badge variant="outline" className="text-xs">
              {responseStats.confidence}% confidence
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-2"
          aria-label="Copy response to clipboard"
        >
          <Copy className={`w-4 h-4 transition-colors ${copied ? 'text-green-600' : ''}`} />
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
            aria-label="Insert AI response"
          >
            <Download className="w-3 h-3" />
            Insert
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onReplace}
            className="flex items-center gap-1"
            aria-label="Replace selected text with AI response"
          >
            <RotateCcw className="w-3 h-3" />
            Replace
          </Button>
        </div>
      )}

      {/* Similar Notes Context */}
      {responseStats.similarNotesCount > 0 && (
        <div className="text-xs text-muted-foreground">
          <Separator className="my-2" />
          <p className="font-medium mb-1">Context from {responseStats.similarNotesCount} similar notes:</p>
          <div className="space-y-1">
            {similarNotesPreview}
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
            className="h-6 w-6 p-0 hover:text-green-600 transition-colors"
            aria-label="Rate response positively"
          >
            <ThumbsUp className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRate(-1)}
            className="h-6 w-6 p-0 hover:text-red-600 transition-colors"
            aria-label="Rate response negatively"
          >
            <ThumbsDown className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedAIResponse);