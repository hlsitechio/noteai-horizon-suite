import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Zap,
  X,
  CheckCircle
} from 'lucide-react';
import { useAIWritingAssistant } from '@/hooks/useAIWritingAssistant';

interface AISmartSuggestionsProps {
  content: string;
  onApplySuggestion: (suggestion: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface Suggestion {
  id: string;
  type: 'clarity' | 'engagement' | 'structure' | 'style';
  title: string;
  description: string;
  example?: string;
  action?: string;
}

const AISmartSuggestions: React.FC<AISmartSuggestionsProps> = ({
  content,
  onApplySuggestion,
  isVisible,
  onClose
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const { getSuggestions, isLoading } = useAIWritingAssistant();

  useEffect(() => {
    if (isVisible && content && content.length > 50) {
      generateSuggestions();
    }
  }, [isVisible, content]);

  const generateSuggestions = async () => {
    try {
      const aiSuggestions = await getSuggestions(content);
      
      // Parse AI suggestions into structured format
      const parsedSuggestions = parseSuggestions(aiSuggestions);
      setSuggestions(parsedSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  const parseSuggestions = (aiText: string): Suggestion[] => {
    // Simple parsing logic - in production, you'd want more sophisticated parsing
    const suggestions: Suggestion[] = [];
    const lines = aiText.split('\n').filter(line => line.trim());
    
    lines.forEach((line, index) => {
      if (line.includes('clarity') || line.includes('clear')) {
        suggestions.push({
          id: `clarity-${index}`,
          type: 'clarity',
          title: 'Improve Clarity',
          description: line.trim(),
        });
      } else if (line.includes('engagement') || line.includes('engaging')) {
        suggestions.push({
          id: `engagement-${index}`,
          type: 'engagement',
          title: 'Boost Engagement',
          description: line.trim(),
        });
      } else if (line.includes('structure') || line.includes('organize')) {
        suggestions.push({
          id: `structure-${index}`,
          type: 'structure',
          title: 'Improve Structure',
          description: line.trim(),
        });
      } else if (line.includes('style') || line.includes('tone')) {
        suggestions.push({
          id: `style-${index}`,
          type: 'style',
          title: 'Style Enhancement',
          description: line.trim(),
        });
      }
    });

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  };

  const applySuggestion = (suggestion: Suggestion) => {
    setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
    onApplySuggestion(suggestion.description);
  };

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'clarity': return <Target className="h-4 w-4" />;
      case 'engagement': return <TrendingUp className="h-4 w-4" />;
      case 'structure': return <Lightbulb className="h-4 w-4" />;
      case 'style': return <Zap className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Suggestion['type']) => {
    switch (type) {
      case 'clarity': return 'bg-blue-100 text-blue-800';
      case 'engagement': return 'bg-green-100 text-green-800';
      case 'structure': return 'bg-purple-100 text-purple-800';
      case 'style': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="absolute top-0 right-0 w-80 max-h-96 overflow-y-auto z-40 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Smart Suggestions</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isLoading && (
          <div className="text-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Analyzing your content...</p>
          </div>
        )}

        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-2 mb-2">
                {getTypeIcon(suggestion.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getTypeColor(suggestion.type)}`}
                    >
                      {suggestion.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {suggestion.description}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end">
                {appliedSuggestions.has(suggestion.id) ? (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Applied
                  </Badge>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => applySuggestion(suggestion)}
                    className="text-xs"
                  >
                    Apply
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isLoading && suggestions.length === 0 && (
          <div className="text-center py-4">
            <Lightbulb className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Write more content to get AI suggestions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISmartSuggestions;