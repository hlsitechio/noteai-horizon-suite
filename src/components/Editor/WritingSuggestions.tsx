
import React, { useState, useEffect } from 'react';
import { Lightbulb, X, CheckCircle, AlertCircle, Zap, Target, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WritingSuggestionsProps {
  content: string;
  onSuggestionApply: (original: string, suggestion: string) => void;
}

interface Suggestion {
  id: string;
  type: 'grammar' | 'style' | 'clarity' | 'engagement' | 'structure';
  title: string;
  description: string;
  original: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
  impact: 'readability' | 'professionalism' | 'engagement';
}

const WritingSuggestions: React.FC<WritingSuggestionsProps> = ({ content, onSuggestionApply }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const generateAdvancedSuggestions = (text: string): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    // Advanced grammar detection
    if (text.includes('its') && !text.includes("it's")) {
      suggestions.push({
        id: 'grammar-apostrophe',
        type: 'grammar',
        title: 'Apostrophe Usage',
        description: 'Consider "it\'s" (it is) vs "its" (possessive)',
        original: 'its',
        suggestion: "it's",
        severity: 'medium',
        impact: 'professionalism'
      });
    }
    
    // Sophisticated style analysis
    const words = text.split(' ');
    const complexWords = words.filter(word => word.length > 12).length;
    if (complexWords > 3) {
      suggestions.push({
        id: 'style-complexity',
        type: 'style',
        title: 'Simplify Complex Terms',
        description: 'Replace technical jargon with accessible language',
        original: 'complex terminology',
        suggestion: 'clearer alternatives',
        severity: 'low',
        impact: 'readability'
      });
    }
    
    // Advanced readability analysis
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    const longSentences = sentences.filter(s => s.split(' ').length > 25).length;
    if (longSentences > 0) {
      suggestions.push({
        id: 'clarity-sentence-length',
        type: 'clarity',
        title: 'Break Down Long Sentences',
        description: 'Improve flow with shorter, punchier sentences',
        original: 'lengthy sentence structure',
        suggestion: 'concise sentence structure',
        severity: 'high',
        impact: 'readability'
      });
    }
    
    // Engagement optimization
    const questionCount = (text.match(/\?/g) || []).length;
    if (questionCount === 0 && text.length > 200) {
      suggestions.push({
        id: 'engagement-questions',
        type: 'engagement',
        title: 'Add Engaging Questions',
        description: 'Questions create connection with readers',
        original: 'statement format',
        suggestion: 'question format',
        severity: 'medium',
        impact: 'engagement'
      });
    }
    
    // Structure improvements
    if (!text.includes('\n') && text.length > 500) {
      suggestions.push({
        id: 'structure-paragraphs',
        type: 'structure',
        title: 'Improve Text Structure',
        description: 'Break content into digestible paragraphs',
        original: 'wall of text',
        suggestion: 'structured paragraphs',
        severity: 'high',
        impact: 'readability'
      });
    }
    
    return suggestions;
  };

  useEffect(() => {
    if (content.length > 50) {
      const newSuggestions = generateAdvancedSuggestions(content);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [content]);

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'grammar': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'style': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'clarity': return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case 'engagement': return <Target className="w-4 h-4 text-purple-500" />;
      case 'structure': return <TrendingUp className="w-4 h-4 text-indigo-500" />;
    }
  };

  const getTypeColors = (type: Suggestion['type']) => {
    switch (type) {
      case 'grammar': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'style': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'clarity': return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'engagement': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'structure': return 'bg-indigo-50 border-indigo-200 text-indigo-800';
    }
  };

  const getSeverityBadge = (severity: Suggestion['severity']) => {
    const colors = {
      low: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      high: 'bg-red-100 text-red-700 border-red-200'
    };
    
    return (
      <Badge variant="outline" className={`text-xs ${colors[severity]}`}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    onSuggestionApply(suggestion.original, suggestion.suggestion);
    setDismissedSuggestions(prev => new Set([...prev, suggestion.id]));
  };

  const handleDismiss = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const activeSuggestions = suggestions.filter(s => !dismissedSuggestions.has(s.id));

  if (activeSuggestions.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-purple-50/50 to-pink-50/30 border-2 border-blue-200/50 shadow-large">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">AI Writing Coach</h3>
            <p className="text-xs text-gray-600">Professional writing suggestions</p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white ml-auto">
            {activeSuggestions.length} insights
          </Badge>
        </div>
        
        <div className="space-y-4">
          {activeSuggestions.slice(0, 3).map((suggestion) => (
            <div key={suggestion.id} className={`p-4 rounded-xl border-2 ${getTypeColors(suggestion.type)} transition-all duration-300 hover:shadow-md`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(suggestion.type)}
                    <span className="font-semibold text-sm">{suggestion.title}</span>
                    <Badge variant="outline" className="text-xs capitalize bg-white/50">
                      {suggestion.type}
                    </Badge>
                    {getSeverityBadge(suggestion.severity)}
                  </div>
                  <p className="text-xs mb-3 leading-relaxed">{suggestion.description}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="h-7 text-xs bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      Apply Fix
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-7 text-xs hover:bg-white/50"
                      onClick={() => handleDismiss(suggestion.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6 hover:bg-white/50"
                  onClick={() => handleDismiss(suggestion.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {activeSuggestions.length > 3 && (
          <div className="mt-4 p-3 bg-white/50 rounded-lg border border-blue-200/50 text-center">
            <p className="text-sm text-gray-600 font-medium">
              +{activeSuggestions.length - 3} more professional insights available
            </p>
            <p className="text-xs text-gray-500">Keep writing to unlock advanced suggestions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WritingSuggestions;
