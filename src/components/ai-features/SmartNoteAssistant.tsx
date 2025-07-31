import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  BookOpen, 
  Zap,
  MessageSquare,
  List,
  Hash,
  Calendar,
  TrendingUp,
  Copy,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SmartNoteAssistantProps {
  content: string;
  title: string;
  tags: string[];
  onSuggestionApplied?: (suggestion: string, type: AssistantFeature) => void;
}

type AssistantFeature = 'enhance' | 'structure' | 'tags' | 'questions' | 'actions' | 'timeline';

interface Suggestion {
  type: AssistantFeature;
  content: string;
  title: string;
  confidence: number;
}

const ASSISTANT_FEATURES = [
  {
    type: 'enhance' as AssistantFeature,
    title: 'Content Enhancement',
    description: 'Improve clarity, grammar, and flow',
    icon: Zap,
    color: 'text-blue-500'
  },
  {
    type: 'structure' as AssistantFeature,
    title: 'Better Structure',
    description: 'Organize content with headers and sections',
    icon: List,
    color: 'text-green-500'
  },
  {
    type: 'tags' as AssistantFeature,
    title: 'Smart Tags',
    description: 'Suggest relevant tags and categories',
    icon: Hash,
    color: 'text-purple-500'
  },
  {
    type: 'questions' as AssistantFeature,
    title: 'Key Questions',
    description: 'Generate thought-provoking questions',
    icon: MessageSquare,
    color: 'text-orange-500'
  },
  {
    type: 'actions' as AssistantFeature,
    title: 'Action Items',
    description: 'Extract actionable tasks and todos',
    icon: Target,
    color: 'text-red-500'
  },
  {
    type: 'timeline' as AssistantFeature,
    title: 'Timeline & Dates',
    description: 'Identify important dates and deadlines',
    icon: Calendar,
    color: 'text-indigo-500'
  }
];

const SmartNoteAssistant: React.FC<SmartNoteAssistantProps> = ({
  content,
  title,
  tags,
  onSuggestionApplied
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<AssistantFeature>('enhance');

  useEffect(() => {
    if (content && content.length > 50) {
      generateInitialSuggestions();
    }
  }, [content, title]);

  const generateInitialSuggestions = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Generate multiple suggestions in parallel
      const suggestionPromises = ASSISTANT_FEATURES.map(feature => 
        generateSuggestion(feature.type)
      );
      
      const results = await Promise.allSettled(suggestionPromises);
      
      const validSuggestions = results
        .filter((result): result is PromiseFulfilledResult<Suggestion> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);
      
      setSuggestions(validSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error('Failed to generate smart suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSuggestion = async (type: AssistantFeature): Promise<Suggestion | null> => {
    try {
      const prompt = getSuggestionPrompt(type, content, title, tags);
      
      const { data, error } = await supabase.functions.invoke('ai-chat-with-context', {
        body: {
          message: prompt,
          context: {
            type: 'note_assistance',
            feature: type,
            content_length: content.length,
            has_title: !!title,
            existing_tags: tags
          }
        }
      });

      if (error) throw error;

      const confidence = calculateConfidence(type, content, data.response);

      return {
        type,
        content: data.response,
        title: ASSISTANT_FEATURES.find(f => f.type === type)?.title || '',
        confidence
      };
    } catch (error) {
      console.error(`Error generating ${type} suggestion:`, error);
      return null;
    }
  };

  const getSuggestionPrompt = (type: AssistantFeature, content: string, title: string, tags: string[]): string => {
    const baseContext = `Title: ${title || 'Untitled'}\nExisting tags: ${tags.join(', ') || 'None'}\nContent: ${content}`;
    
    const prompts = {
      enhance: `Improve the following note by enhancing clarity, fixing grammar, and improving flow while preserving the original meaning and style:\n\n${baseContext}`,
      
      structure: `Analyze the following note and suggest a better structure with clear headers, sections, and organization:\n\n${baseContext}\n\nProvide the restructured content with proper formatting.`,
      
      tags: `Analyze the following note and suggest 5-8 relevant tags that would help categorize and find this content:\n\n${baseContext}\n\nProvide only the tags as a comma-separated list.`,
      
      questions: `Based on the following note, generate 3-5 thought-provoking questions that could help explore the topic deeper or identify areas for further research:\n\n${baseContext}`,
      
      actions: `Extract actionable items, tasks, and todos from the following note. Format them as a clear list:\n\n${baseContext}`,
      
      timeline: `Identify any dates, deadlines, time-sensitive information, or chronological elements in the following note:\n\n${baseContext}`
    };

    return prompts[type];
  };

  const calculateConfidence = (type: AssistantFeature, content: string, suggestion: string): number => {
    // Simple confidence calculation based on content length and suggestion quality
    let confidence = 0.5;

    // Higher confidence for longer content
    if (content.length > 500) confidence += 0.2;
    if (content.length > 1000) confidence += 0.1;

    // Higher confidence for structured content
    if (content.includes('\n\n') || content.includes('- ')) confidence += 0.1;

    // Type-specific confidence adjustments
    switch (type) {
      case 'tags':
        confidence += suggestion.split(',').length >= 3 ? 0.2 : 0;
        break;
      case 'actions':
        confidence += suggestion.toLowerCase().includes('todo') || suggestion.includes('- ') ? 0.2 : 0;
        break;
      case 'timeline':
        confidence += /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|deadline|due/.test(suggestion.toLowerCase()) ? 0.2 : 0;
        break;
    }

    return Math.min(confidence, 1);
  };

  const applySuggestion = (suggestion: Suggestion) => {
    onSuggestionApplied?.(suggestion.content, suggestion.type);
    toast.success(`${suggestion.title} applied successfully!`);
  };

  const regenerateSuggestion = async (type: AssistantFeature) => {
    setIsGenerating(true);
    
    try {
      const newSuggestion = await generateSuggestion(type);
      if (newSuggestion) {
        setSuggestions(prev => 
          prev.map(s => s.type === type ? newSuggestion : s)
        );
        toast.success('Suggestion regenerated!');
      }
    } catch (error) {
      toast.error('Failed to regenerate suggestion');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getCurrentSuggestion = () => suggestions.find(s => s.type === activeTab);

  if (!content || content.length < 50) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-8">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Smart Note Assistant</h3>
          <p className="text-muted-foreground">
            Add some content to your note (at least 50 characters) to get AI-powered suggestions for improvement.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Smart Note Assistant
          {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Get AI-powered suggestions to enhance your notes
        </p>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AssistantFeature)}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
            {ASSISTANT_FEATURES.map((feature) => {
              const Icon = feature.icon;
              const suggestion = suggestions.find(s => s.type === feature.type);
              
              return (
                <TabsTrigger 
                  key={feature.type} 
                  value={feature.type}
                  className="flex flex-col gap-1 h-auto py-2"
                >
                  <Icon className={`h-4 w-4 ${feature.color}`} />
                  <span className="text-xs">{feature.title}</span>
                  {suggestion && (
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1 py-0"
                    >
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {ASSISTANT_FEATURES.map((feature) => {
            const suggestion = getCurrentSuggestion();
            
            return (
              <TabsContent key={feature.type} value={feature.type} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  
                  {suggestion && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => regenerateSuggestion(feature.type)}
                        disabled={isGenerating}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                {suggestion ? (
                  <div className="space-y-3">
                    <Textarea
                      value={suggestion.content}
                      readOnly
                      className="min-h-[150px] bg-muted/50"
                    />
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => applySuggestion(suggestion)}
                        className="flex-1"
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Apply Suggestion
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(suggestion.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {isGenerating ? (
                      <div className="space-y-2">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground">
                          Analyzing your note and generating suggestions...
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <BookOpen className="h-8 w-8 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          No suggestions available for this feature yet.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => regenerateSuggestion(feature.type)}
                        >
                          Generate Suggestion
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SmartNoteAssistant;