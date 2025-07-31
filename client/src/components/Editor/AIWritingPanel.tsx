import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Wand2, 
  FileText, 
  Expand, 
  RotateCcw, 
  CheckCircle, 
  Lightbulb, 
  Type, 
  List,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';

export type AIMode = 
  | 'continue' 
  | 'enhance' 
  | 'summarize' 
  | 'expand' 
  | 'rewrite' 
  | 'grammar' 
  | 'suggest' 
  | 'complete'
  | 'outline'
  | 'brainstorm';

export type AITone = 'professional' | 'casual' | 'friendly' | 'formal' | 'creative' | 'academic';
export type AILength = 'short' | 'medium' | 'long';

interface AIWritingPanelProps {
  content: string;
  selectedText: string;
  cursorPosition: number;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

const AIWritingPanel: React.FC<AIWritingPanelProps> = ({
  content,
  selectedText,
  cursorPosition,
  onTextInsert,
  onTextReplace,
  isVisible,
  onClose
}) => {
  const [mode, setMode] = useState<AIMode>('continue');
  const [tone, setTone] = useState<AITone>('professional');
  const [length, setLength] = useState<AILength>('medium');
  const [customPrompt, setCustomPrompt] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const aiActions = [
    { id: 'continue', label: 'Continue Writing', icon: Brain, color: 'bg-blue-500' },
    { id: 'enhance', label: 'Enhance Text', icon: Wand2, color: 'bg-purple-500' },
    { id: 'summarize', label: 'Summarize', icon: FileText, color: 'bg-green-500' },
    { id: 'expand', label: 'Expand', icon: Expand, color: 'bg-orange-500' },
    { id: 'rewrite', label: 'Rewrite', icon: RotateCcw, color: 'bg-red-500' },
    { id: 'grammar', label: 'Grammar Check', icon: CheckCircle, color: 'bg-emerald-500' },
    { id: 'suggest', label: 'Get Suggestions', icon: Lightbulb, color: 'bg-yellow-500' },
    { id: 'complete', label: 'Auto Complete', icon: Type, color: 'bg-indigo-500' },
    { id: 'outline', label: 'Create Outline', icon: List, color: 'bg-cyan-500' },
    { id: 'brainstorm', label: 'Brainstorm Ideas', icon: Sparkles, color: 'bg-pink-500' }
  ] as const;

  const processWithAI = useCallback(async (request: {
    mode: AIMode;
    content: string;
    context?: string;
    tone?: AITone;
    length?: AILength;
    selectedText?: string;
    cursorPosition?: number;
  }): Promise<string> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-writing-assistant-enhanced', {
        body: request
      });

      if (error) {
        throw error;
      }

      if (!data?.result) {
        throw new Error('No result received from AI assistant');
      }

      // Show success toast with mode-specific message
      const modeMessages = {
        continue: 'Content continued successfully',
        enhance: 'Text enhanced successfully',
        summarize: 'Summary generated successfully', 
        expand: 'Content expanded successfully',
        rewrite: 'Text rewritten successfully',
        grammar: 'Grammar checked and improved',
        suggest: 'Writing suggestions generated',
        complete: 'Text completed successfully',
        outline: 'Outline created successfully',
        brainstorm: 'Ideas brainstormed successfully'
      };

      toast.success(modeMessages[request.mode] || 'AI processing completed');
      
      return data.result;

    } catch (error) {
      console.error('AI Writing Assistant error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.error(`AI processing failed: ${errorMessage}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleAIProcess = async () => {
    if (!content && !selectedText && mode !== 'brainstorm') {
      toast.error('Please provide some content to work with');
      return;
    }

    try {
      const requestContent = mode === 'brainstorm' ? customPrompt : content;
      const aiResult = await processWithAI({
        mode,
        content: ['enhance', 'expand', 'rewrite'].includes(mode) ? '' : requestContent,
        selectedText: ['enhance', 'expand', 'rewrite'].includes(mode) ? selectedText : '',
        tone,
        length,
        cursorPosition: mode === 'complete' ? cursorPosition : undefined
      });

      setResult(aiResult);
    } catch (error) {
      console.error('AI processing error:', error);
    }
  };

  const handleInsertResult = () => {
    if (result) {
      if (['enhance', 'rewrite', 'grammar'].includes(mode) && selectedText) {
        onTextReplace(result);
      } else {
        onTextInsert(result);
      }
      setResult('');
      onClose();
    }
  };

  const handleCopyResult = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success('Result copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              AI Writing Assistant (Powered by OpenRouter)
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* AI Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {aiActions.map((action) => (
              <Button
                key={action.id}
                variant={mode === action.id ? "default" : "outline"}
                size="sm"
                onClick={() => setMode(action.id as AIMode)}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <action.icon className="h-4 w-4" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>

          {/* Settings Row */}
          <div className="flex gap-4 flex-wrap">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tone</label>
              <Select value={tone} onValueChange={(value: AITone) => setTone(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Length</label>
              <Select value={length} onValueChange={(value: AILength) => setLength(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleAIProcess} 
              disabled={isLoading}
              className="self-end"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Process with AI
                </>
              )}
            </Button>
          </div>

          {/* Context Information */}
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              {selectedText && (
                <Badge variant="secondary">
                  Selected: {selectedText.length} chars
                </Badge>
              )}
              {content && (
                <Badge variant="outline">
                  Document: {content.length} chars
                </Badge>
              )}
              <Badge variant="outline">
                Mode: {mode}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                OpenRouter DeepSeek R1
              </Badge>
            </div>
          </div>

          {/* Custom Prompt for Brainstorming */}
          {mode === 'brainstorm' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">What would you like to brainstorm about?</label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter a topic or question to brainstorm ideas..."
                className="min-h-20"
              />
            </div>
          )}

          {/* AI Result */}
          {result && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">AI Result:</h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyResult}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={handleInsertResult}
                    size="sm"
                  >
                    {['enhance', 'rewrite', 'grammar'].includes(mode) && selectedText ? 'Replace' : 'Insert'}
                  </Button>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-lg max-h-60 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="text-sm text-muted-foreground">
            {mode === 'continue' && "AI will continue your writing in a natural flow"}
            {mode === 'enhance' && "AI will improve the selected text while keeping its meaning"}
            {mode === 'summarize' && "AI will create a concise summary of your content"}
            {mode === 'expand' && "AI will add more details and examples to the selected text"}
            {mode === 'rewrite' && "AI will rewrite the selected text in the chosen tone"}
            {mode === 'grammar' && "AI will fix grammar, spelling, and improve readability"}
            {mode === 'suggest' && "AI will provide specific suggestions to improve your writing"}
            {mode === 'complete' && "AI will complete the text at your cursor position"}
            {mode === 'outline' && "AI will create a structured outline from your content"}
            {mode === 'brainstorm' && "AI will generate creative ideas and approaches"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIWritingPanel;