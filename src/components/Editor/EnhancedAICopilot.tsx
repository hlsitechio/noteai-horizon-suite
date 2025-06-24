
import React, { useState, useCallback } from 'react';
import { Bot, Languages, Lightbulb, Sparkles, X, Send, Copy, Check, ThumbsUp, ThumbsDown, History, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAICopilot, CopilotRequest, CopilotResponse } from '@/hooks/useAICopilot';

interface EnhancedAICopilotProps {
  selectedText: string;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
  noteId?: string;
}

type AIAction = 'improve' | 'translate' | 'summarize' | 'expand' | 'simplify' | 'custom';

const languages = [
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ru', label: 'Russian' },
];

const EnhancedAICopilot: React.FC<EnhancedAICopilotProps> = ({
  selectedText,
  onTextInsert,
  onTextReplace,
  isVisible,
  onClose,
  position,
  noteId
}) => {
  const [activeAction, setActiveAction] = useState<AIAction | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [customPrompt, setCustomPrompt] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const { processText, rateFeedback, isLoading, currentSession } = useAICopilot();

  const handleAction = async (action: AIAction) => {
    if (!selectedText.trim() && action !== 'custom') {
      toast.error('Please select some text first');
      return;
    }

    setActiveAction(action);
    setResult('');
    setResponse(null);

    try {
      const request: CopilotRequest = {
        action,
        text: selectedText || 'No text selected',
        noteId,
        targetLanguage: action === 'translate' ? targetLanguage : undefined,
        customPrompt: action === 'custom' ? customPrompt : undefined,
      };

      if (action === 'custom' && !customPrompt.trim()) {
        toast.error('Please enter a custom prompt');
        return;
      }

      const aiResponse = await processText(request);
      setResult(aiResponse.result);
      setResponse(aiResponse);
      
      toast.success(`AI processing completed in ${aiResponse.processingTime}ms!`);
    } catch (error) {
      console.error('AI processing failed:', error);
      // Error handling is done in the hook
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleInsert = () => {
    onTextInsert(result);
    toast.success('Text inserted!');
    onClose();
  };

  const handleReplace = () => {
    onTextReplace(result);
    toast.success('Text replaced!');
    onClose();
  };

  const handleFeedback = async (rating: number) => {
    if (currentSession) {
      await rateFeedback(currentSession, rating);
    }
  };

  const resetView = () => {
    setActiveAction(null);
    setResult('');
    setResponse(null);
    setCustomPrompt('');
    setShowAnalytics(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 w-96 animate-scale-in"
      style={{ 
        left: position?.x || '50%',
        top: position?.y || '50%',
        transform: position ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)'
      }}
    >
      <Card className="shadow-large border-2 bg-background/95 backdrop-blur-sm max-h-[80vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="w-5 h-5 text-primary" />
              Enhanced AI Copilot
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(!showAnalytics)}>
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {selectedText && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md mt-2">
              Selected: "{selectedText.slice(0, 50)}{selectedText.length > 50 ? '...' : ''}"
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Actions */}
          {!activeAction && !showAnalytics && (
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction('improve')}
                className="h-auto p-3 flex flex-col items-center gap-1"
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Improve</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveAction('translate')}
                className="h-auto p-3 flex flex-col items-center gap-1"
                disabled={isLoading}
              >
                <Languages className="w-4 h-4" />
                <span className="text-xs">Translate</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction('summarize')}
                className="h-auto p-3 flex flex-col items-center gap-1"
                disabled={isLoading}
              >
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs">Summarize</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction('expand')}
                className="h-auto p-3 flex flex-col items-center gap-1"
                disabled={isLoading}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">Expand</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAction('simplify')}
                className="h-auto p-3 flex flex-col items-center gap-1"
                disabled={isLoading}
              >
                <Bot className="w-4 h-4" />
                <span className="text-xs">Simplify</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setActiveAction('custom')}
                className="h-auto p-3 flex flex-col items-center gap-1"
                disabled={isLoading}
              >
                <Send className="w-4 h-4" />
                <span className="text-xs">Custom</span>
              </Button>
            </div>
          )}

          {/* Translation Options */}
          {activeAction === 'translate' && !result && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Target Language</label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => handleAction('translate')} disabled={isLoading} className="w-full">
                {isLoading ? 'Translating...' : 'Translate Text'}
              </Button>
            </div>
          )}

          {/* Custom Prompt */}
          {activeAction === 'custom' && !result && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Custom Instructions</label>
                <Textarea
                  placeholder="Tell the AI what you want to do with the text..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <Button onClick={() => handleAction('custom')} disabled={isLoading || !customPrompt.trim()} className="w-full">
                {isLoading ? 'Processing...' : 'Process Text'}
              </Button>
            </div>
          )}

          {/* Processing State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="w-4 h-4 animate-pulse" />
                <span>AI is processing...</span>
              </div>
            </div>
          )}

          {/* Result */}
          {result && response && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">AI Result</Badge>
                  <Badge variant="outline" className="text-xs">
                    {response.model}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {response.processingTime}ms
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md text-sm max-h-40 overflow-y-auto">
                {result}
              </div>

              {/* Similar Notes Context */}
              {response.similarNotes && response.similarNotes.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <Separator className="my-2" />
                  <p className="font-medium mb-1">Context from {response.similarNotes.length} similar notes:</p>
                  {response.similarNotes.map((note, idx) => (
                    <p key={idx} className="truncate">• {note.title}</p>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Button size="sm" onClick={handleInsert} className="flex-1">
                  Insert Below
                </Button>
                {selectedText && (
                  <Button size="sm" variant="outline" onClick={handleReplace} className="flex-1">
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
                  onClick={() => handleFeedback(5)}
                  className="h-6 w-6 p-0"
                >
                  <ThumbsUp className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(1)}
                  className="h-6 w-6 p-0"
                >
                  <ThumbsDown className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Back Button */}
          {(activeAction || showAnalytics) && !isLoading && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetView}
              className="w-full"
            >
              ← Back to Actions
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAICopilot;
