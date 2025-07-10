import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SparklesIcon, WrenchScrewdriverIcon, LanguageIcon, DocumentTextIcon, PlusIcon, MinusIcon, PencilIcon } from '@heroicons/react/24/outline';
import { X } from 'lucide-react';
import { Bot } from 'lucide-react';
import { toast } from 'sonner';
import { useAICopilot, CopilotRequest, CopilotResponse } from '@/hooks/useAICopilot';

interface UnifiedAIAssistantProps {
  selectedText: string;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
  noteId?: string;
  mode?: 'bar' | 'popup';
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

const UnifiedAIAssistant: React.FC<UnifiedAIAssistantProps> = ({
  selectedText,
  onTextInsert,
  onTextReplace,
  isVisible,
  onClose,
  position,
  noteId,
  mode = 'popup'
}) => {
  const [activeAction, setActiveAction] = useState<AIAction | null>(null);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [customPrompt, setCustomPrompt] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [showCustom, setShowCustom] = useState(false);

  const { processText, rateFeedback, isLoading, currentSession } = useAICopilot();

  const aiActions = [
    { id: 'improve', label: 'Improve', icon: SparklesIcon, color: 'from-blue-500 to-purple-500' },
    { id: 'translate', label: 'Translate', icon: LanguageIcon, color: 'from-green-500 to-teal-500' },
    { id: 'summarize', label: 'Summarize', icon: DocumentTextIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'expand', label: 'Expand', icon: PlusIcon, color: 'from-orange-500 to-red-500' },
    { id: 'simplify', label: 'Simplify', icon: MinusIcon, color: 'from-teal-500 to-blue-500' },
  ];

  const handleAction = async (action: AIAction) => {
    if (!selectedText.trim() && action !== 'custom') {
      toast.error('Please select some text first');
      return;
    }

    setActiveAction(action);
    setResult('');
    setResponse(null);

    // Handle special cases for translation and custom
    if (action === 'translate' && !result) {
      return; // Show language selector first
    }

    if (action === 'custom' && !customPrompt.trim()) {
      setShowCustom(true);
      return;
    }

    try {
      const request: CopilotRequest = {
        action,
        text: selectedText || 'No text selected',
        noteId,
        targetLanguage: action === 'translate' ? targetLanguage : undefined,
        customPrompt: action === 'custom' ? customPrompt : undefined,
      };

      const aiResponse = await processText(request);
      setResult(aiResponse.result);
      setResponse(aiResponse);
      
      toast.success(`AI processing completed in ${aiResponse.processingTime}ms!`);
    } catch (error) {
      console.error('AI processing failed:', error);
    }
  };

  const handleCustomProcess = () => {
    if (customPrompt.trim()) {
      handleAction('custom');
      setShowCustom(false);
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
    resetView();
  };

  const handleReplace = () => {
    onTextReplace(result);
    toast.success('Text replaced!');
    resetView();
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
    setShowCustom(false);
    if (mode === 'popup') {
      onClose();
    }
  };

  if (!isVisible) return null;

  // Bar mode - horizontal layout
  if (mode === 'bar') {
    return (
      <div className="bg-gray-900/95 border-t border-gray-400/30 p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-gray-200">AI Assistant</span>
            {selectedText && (
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                "{selectedText.slice(0, 30)}..."
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {aiActions.map(({ id, label, icon: Icon, color }) => (
            <Button
              key={id}
              variant="ghost"
              size="sm"
              onClick={() => handleAction(id as AIAction)}
              disabled={isLoading}
              className={`h-8 px-3 bg-gradient-to-r ${color} hover:opacity-90 text-white border border-white/20 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              <Icon className="w-3 h-3 mr-1.5" />
              {label}
            </Button>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustom(!showCustom)}
            className="h-8 px-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border border-gray-400/30"
          >
            <PencilIcon className="w-3 h-3 mr-1.5" />
            Custom
          </Button>
        </div>

        {/* Custom instructions input */}
        {showCustom && (
          <div className="mt-3 animate-fade-in">
            <div className="flex gap-2">
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Tell the AI what you want to do with the text..."
                className="flex-1 h-20 text-sm bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 resize-none"
              />
              <Button
                onClick={handleCustomProcess}
                disabled={!customPrompt.trim() || isLoading}
                className="h-20 px-4 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 border border-purple-400/30"
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Process
              </Button>
            </div>
          </div>
        )}

        {/* Results section for bar mode */}
        {result && (
          <div className="mt-4 p-3 bg-gray-800 border border-gray-600 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">AI Result</Badge>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleInsert}>Insert</Button>
                {selectedText && (
                  <Button size="sm" variant="outline" onClick={handleReplace}>Replace</Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? '✓' : 'Copy'}
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-200 max-h-32 overflow-y-auto">
              {result}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Popup mode - original card layout
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
              AI Assistant
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {selectedText && (
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md mt-2">
              Selected: "{selectedText.slice(0, 50)}{selectedText.length > 50 ? '...' : ''}"
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Actions */}
          {!activeAction && (
            <div className="grid grid-cols-2 gap-2">
              {aiActions.map(({ id, label, icon: Icon }) => (
                <Button 
                  key={id}
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAction(id as AIAction)}
                  className="h-auto p-3 flex flex-col items-center gap-1"
                  disabled={isLoading}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
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
                  {copied ? '✓' : 'Copy'}
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
                  👍
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(1)}
                  className="h-6 w-6 p-0"
                >
                  👎
                </Button>
              </div>
            </div>
          )}

          {/* Back Button */}
          {activeAction && !isLoading && (
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

export default UnifiedAIAssistant;