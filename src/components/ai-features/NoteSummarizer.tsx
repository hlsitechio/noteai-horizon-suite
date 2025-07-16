import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, RefreshCw, Loader2, BookOpen, Lightbulb, Target } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface NoteSummarizerProps {
  content: string;
  onSummaryGenerated?: (summary: string, type: SummaryType) => void;
}

type SummaryType = 'brief' | 'detailed' | 'bullet-points' | 'key-insights';

interface SummaryResult {
  type: SummaryType;
  content: string;
  wordCount: number;
}

const SUMMARY_TYPES = [
  {
    type: 'brief' as SummaryType,
    label: 'Brief Summary',
    description: 'Concise overview in 2-3 sentences',
    icon: BookOpen,
    color: 'bg-blue-500'
  },
  {
    type: 'detailed' as SummaryType,
    label: 'Detailed Summary',
    description: 'Comprehensive summary with main points',
    icon: Sparkles,
    color: 'bg-purple-500'
  },
  {
    type: 'bullet-points' as SummaryType,
    label: 'Bullet Points',
    description: 'Key points in bullet format',
    icon: Target,
    color: 'bg-green-500'
  },
  {
    type: 'key-insights' as SummaryType,
    label: 'Key Insights',
    description: 'Important insights and takeaways',
    icon: Lightbulb,
    color: 'bg-amber-500'
  }
];

const NoteSummarizer: React.FC<NoteSummarizerProps> = ({ content, onSummaryGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaries, setSummaries] = useState<SummaryResult[]>([]);
  const [selectedType, setSelectedType] = useState<SummaryType>('brief');

  const generateSummary = async (type: SummaryType) => {
    if (!content.trim()) {
      toast.error('Please add some content to summarize');
      return;
    }

    if (content.length < 100) {
      toast.error('Content too short for meaningful summarization');
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat-with-context', {
        body: {
          message: getSummaryPrompt(type, content),
          context: {
            type: 'note_summarization',
            content_length: content.length,
            summary_type: type
          }
        }
      });

      if (error) throw error;

      const summaryContent = data.response;
      const wordCount = summaryContent.split(/\s+/).length;

      const newSummary: SummaryResult = {
        type,
        content: summaryContent,
        wordCount
      };

      setSummaries(prev => {
        const filtered = prev.filter(s => s.type !== type);
        return [...filtered, newSummary];
      });

      onSummaryGenerated?.(summaryContent, type);
      toast.success(`${SUMMARY_TYPES.find(t => t.type === type)?.label} generated successfully!`);

    } catch (error) {
      console.error('Summary generation error:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSummaryPrompt = (type: SummaryType, content: string): string => {
    const prompts = {
      brief: `Create a brief, concise summary of the following text in 2-3 sentences. Focus on the main idea and key points:\n\n${content}`,
      detailed: `Create a comprehensive summary of the following text. Include all main points, important details, and context while maintaining clarity:\n\n${content}`,
      'bullet-points': `Extract the key points from the following text and present them as clear, concise bullet points. Each point should capture an important idea or fact:\n\n${content}`,
      'key-insights': `Analyze the following text and identify the most important insights, conclusions, and takeaways. Focus on actionable information and significant observations:\n\n${content}`
    };

    return prompts[type];
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Summary copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy summary');
    }
  };

  const getCurrentSummary = () => summaries.find(s => s.type === selectedType);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Note Summarizer
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate intelligent summaries of your notes using AI
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Type Selection */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Choose Summary Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SUMMARY_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.type;
              const hasSummary = summaries.some(s => s.type === type.type);
              
              return (
                <button
                  key={type.type}
                  onClick={() => setSelectedType(type.type)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${type.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-sm">{type.label}</h5>
                        {hasSummary && (
                          <Badge variant="secondary" className="text-xs">
                            Generated
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={() => generateSummary(selectedType)}
          disabled={isGenerating || !content.trim()}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Summary...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate {SUMMARY_TYPES.find(t => t.type === selectedType)?.label}
            </>
          )}
        </Button>

        {/* Summary Results */}
        {getCurrentSummary() && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Generated Summary</h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {getCurrentSummary()?.wordCount} words
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(getCurrentSummary()?.content || '')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generateSummary(selectedType)}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Textarea
              value={getCurrentSummary()?.content || ''}
              readOnly
              className="min-h-[120px] bg-muted/50"
              placeholder="Your summary will appear here..."
            />
          </div>
        )}

        {/* Quick Stats */}
        {content && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {content.length}
              </div>
              <div className="text-xs text-muted-foreground">Characters</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {content.split(/\s+/).filter(word => word.length > 0).length}
              </div>
              <div className="text-xs text-muted-foreground">Words</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {Math.ceil(content.split(/\s+/).length / 200)}
              </div>
              <div className="text-xs text-muted-foreground">Min Read</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteSummarizer;