
import React, { useState, useCallback } from 'react';
import { 
  Bot, Sparkles, Wand2, Brain, Target, Zap, 
  MessageSquare, FileText, Lightbulb, TrendingUp,
  Palette, Globe, Code, BookOpen, X, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface EnhancedAIAssistantProps {
  selectedText: string;
  onTextInsert: (text: string) => void;
  onTextReplace: (text: string) => void;
  isVisible: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

const aiActions = [
  {
    id: 'continue-writing',
    title: 'Continue Writing',
    description: 'Let AI continue your thoughts',
    icon: FileText,
    category: 'creation',
    premium: false
  },
  {
    id: 'improve-writing',
    title: 'Improve Writing',
    description: 'Enhance clarity and flow',
    icon: Sparkles,
    category: 'enhancement',
    premium: false
  },
  {
    id: 'change-tone',
    title: 'Change Tone',
    description: 'Professional, casual, creative',
    icon: Palette,
    category: 'style',
    premium: true
  },
  {
    id: 'make-longer',
    title: 'Make Longer',
    description: 'Expand with more details',
    icon: TrendingUp,
    category: 'expansion',
    premium: false
  },
  {
    id: 'make-shorter',
    title: 'Make Shorter',
    description: 'Condense to key points',
    icon: Target,
    category: 'compression',
    premium: false
  },
  {
    id: 'explain-this',
    title: 'Explain This',
    description: 'Break down complex concepts',
    icon: BookOpen,
    category: 'explanation',
    premium: true
  },
  {
    id: 'translate',
    title: 'Translate',
    description: 'Multiple languages available',
    icon: Globe,
    category: 'language',
    premium: true
  },
  {
    id: 'brainstorm',
    title: 'Brainstorm Ideas',
    description: 'Generate creative concepts',
    icon: Brain,
    category: 'creation',
    premium: true
  }
];

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'creative', label: 'Creative' },
  { value: 'academic', label: 'Academic' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'friendly', label: 'Friendly' }
];

const EnhancedAIAssistant: React.FC<EnhancedAIAssistantProps> = ({
  selectedText,
  onTextInsert,
  onTextReplace,
  isVisible,
  onClose,
  position
}) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const simulateAdvancedAI = useCallback(async (actionId: string, text: string, options?: any): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    switch (actionId) {
      case 'continue-writing':
        return `${text} Furthermore, this concept opens up numerous possibilities for exploration. The implications extend beyond the immediate scope, suggesting a deeper understanding of the underlying principles that govern this domain.`;
      
      case 'improve-writing':
        return `Enhanced version: ${text.charAt(0).toUpperCase() + text.slice(1)}. This refined iteration demonstrates improved clarity, enhanced flow, and stronger narrative coherence while preserving the original intent.`;
      
      case 'change-tone':
        const tone = options?.tone || 'professional';
        return `[${tone.charAt(0).toUpperCase() + tone.slice(1)} tone]: ${text} - This version has been carefully adapted to match the ${tone} communication style, ensuring appropriate language choices and structural adjustments.`;
      
      case 'make-longer':
        return `${text} To elaborate further on this point, it's important to consider the various facets and implications. This comprehensive approach allows for a more thorough understanding of the subject matter, providing readers with additional context and supporting details that enrich the overall narrative.`;
      
      case 'make-shorter':
        return `Key point: ${text.split(' ').slice(0, Math.max(8, Math.floor(text.split(' ').length / 2))).join(' ')}.`;
      
      case 'explain-this':
        return `Explanation: ${text}\n\nThis concept can be understood by breaking it down into its core components. The fundamental principle involves understanding how these elements interact and influence each other within the broader context.`;
      
      case 'brainstorm':
        return `Ideas related to "${text}":\n• Creative approach #1: Innovative perspective\n• Strategic angle #2: Analytical framework\n• Alternative viewpoint #3: Collaborative solution\n• Future consideration #4: Scalable implementation`;
      
      default:
        return `AI-enhanced content: ${text}`;
    }
  }, []);

  const handleAction = async (actionId: string) => {
    if (!selectedText.trim() && !['continue-writing', 'brainstorm'].includes(actionId)) {
      toast.error('Please select text first or use a creation tool');
      return;
    }

    setActiveAction(actionId);
    setIsProcessing(true);
    setResult('');

    try {
      const options = actionId === 'change-tone' ? { tone: selectedTone } : {};
      const response = await simulateAdvancedAI(actionId, selectedText || 'Continue from here...', options);
      setResult(response);
      toast.success('AI processing completed!', {
        description: 'Your content has been enhanced with advanced AI'
      });
    } catch (error) {
      toast.error('AI processing failed', {
        description: 'Please try again in a moment'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomPrompt = async () => {
    if (!customPrompt.trim()) {
      toast.error('Please enter your custom instructions');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      const response = `Custom AI Response based on: "${customPrompt}"\n\nProcessed content: ${selectedText || 'New content generated'}\n\nThis sophisticated AI analysis provides tailored insights and enhancements specifically designed for your unique requirements.`;
      setResult(response);
      toast.success('Custom AI task completed!');
    } catch (error) {
      toast.error('Custom processing failed');
    } finally {
      setIsProcessing(false);
    }
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
      <Card className="shadow-large border-2 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl border-blue-200/50">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Wand2 className="w-6 h-6" />
              </div>
              Advanced AI Assistant
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Pro
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-blue-100 text-sm font-medium">
            Powered by next-generation AI • Better than Notion AI
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {selectedText && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200/50">
              <div className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-2">
                <Target className="w-3 h-3" />
                SELECTED TEXT
              </div>
              <div className="text-sm text-gray-700 bg-white/50 p-3 rounded-lg">
                "{selectedText.slice(0, 100)}{selectedText.length > 100 ? '...' : ''}"
              </div>
            </div>
          )}

          {!activeAction && !result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {aiActions.slice(0, 6).map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button 
                      key={action.id}
                      variant="outline" 
                      onClick={() => handleAction(action.id)}
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 border-2 hover:border-blue-200 transition-all duration-300 group"
                    >
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-sm flex items-center gap-1">
                          {action.title}
                          {action.premium && <Sparkles className="w-3 h-3 text-yellow-500" />}
                        </div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-center gap-2 border-dashed"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </Button>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-purple-700">Custom AI Instructions</label>
                    <Textarea
                      placeholder="Tell the AI exactly what you want to achieve..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="min-h-[80px] border-purple-200 focus:border-purple-400"
                    />
                    <Button 
                      onClick={handleCustomPrompt}
                      disabled={isProcessing || !customPrompt.trim()}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Execute Custom AI Task
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeAction === 'change-tone' && !result && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-3 block">Select Writing Tone</label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger className="border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => handleAction('change-tone')} 
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isProcessing ? 'Transforming...' : 'Transform Tone'}
              </Button>
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white animate-bounce" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-ping"></div>
              </div>
              <div className="mt-4 text-center">
                <div className="font-semibold text-gray-800">AI is thinking...</div>
                <div className="text-sm text-gray-600">Processing with advanced intelligence</div>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  ✨ AI Enhanced Result
                </Badge>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 p-4 rounded-xl border-2 border-blue-200/50 max-h-48 overflow-y-auto">
                <div className="whitespace-pre-wrap text-sm text-gray-800">{result}</div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => onTextInsert(result)} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Insert Below
                </Button>
                {selectedText && (
                  <Button 
                    onClick={() => onTextReplace(result)}
                    variant="outline" 
                    className="flex-1 border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                  >
                    Replace Selected
                  </Button>
                )}
              </div>
            </div>
          )}

          {(activeAction || result) && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setActiveAction(null);
                setResult('');
                setCustomPrompt('');
                setShowAdvanced(false);
              }}
              className="w-full border-2 border-dashed border-gray-300 hover:border-blue-300"
            >
              ← Back to AI Actions
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAIAssistant;
