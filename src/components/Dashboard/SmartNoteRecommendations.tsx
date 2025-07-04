import React, { useState, useEffect } from 'react';
import { Lightbulb, FileText, Tags, TrendingUp, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAIChat } from '@/hooks/useEnhancedAIChat';

interface NoteRecommendation {
  id: string;
  type: 'related' | 'similar' | 'trending' | 'suggested';
  title: string;
  reason: string;
  confidence: number;
  tags?: string[];
  preview?: string;
}

interface SmartInsight {
  type: 'pattern' | 'topic' | 'writing_style' | 'productivity';
  title: string;
  description: string;
  actionable: boolean;
}

interface SmartNoteRecommendationsProps {
  notes: any[];
  onEditNote: (note: any) => void;
  className?: string;
}

const SmartNoteRecommendations: React.FC<SmartNoteRecommendationsProps> = ({ 
  notes, 
  onEditNote, 
  className 
}) => {
  const [recommendations, setRecommendations] = useState<NoteRecommendation[]>([]);
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { sendStructuredMessage } = useEnhancedAIChat();

  useEffect(() => {
    const generateRecommendations = async () => {
      if (notes.length === 0) {
        setIsLoading(false);
        return;
      }

      // Prevent multiple simultaneous requests
      if (isLoading) return;

      try {
        setIsLoading(true);

        // Analyze user's notes to generate recommendations
        const recentNotes = notes.slice(0, 10);
        const notesAnalysis = recentNotes.map(note => ({
          title: note.title,
          content: note.content.substring(0, 500), // Limit content for analysis
          tags: note.tags || [],
          category: note.category || 'general',
          lastModified: note.updatedAt
        }));

        // Generate AI-powered recommendations
        const analysisPrompt = {
          id: Date.now().toString(),
          content: `Analyze these notes and provide smart recommendations and insights:

${JSON.stringify(notesAnalysis, null, 2)}

Generate recommendations for:
1. Related notes that could be connected
2. Similar topics that appear frequently  
3. Trending patterns in the user's writing
4. Suggested new note topics based on gaps

Also provide insights about:
- Writing patterns and habits
- Most discussed topics
- Productivity trends
- Areas for improvement

Focus on actionable recommendations that would help the user organize and expand their knowledge.`,
          isUser: true,
          timestamp: new Date()
        };

        const schema = {
          name: 'note_recommendations',
          schema: {
            type: 'object',
            properties: {
              recommendations: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    type: { type: 'string', enum: ['related', 'similar', 'trending', 'suggested'] },
                    title: { type: 'string' },
                    reason: { type: 'string' },
                    confidence: { type: 'number' },
                    tags: { type: 'array', items: { type: 'string' } },
                    preview: { type: 'string' }
                  },
                  required: ['id', 'type', 'title', 'reason', 'confidence']
                }
              },
              insights: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    type: { type: 'string', enum: ['pattern', 'topic', 'writing_style', 'productivity'] },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    actionable: { type: 'boolean' }
                  },
                  required: ['type', 'title', 'description', 'actionable']
                }
              }
            },
            required: ['recommendations', 'insights']
          }
        };

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('AI analysis timeout')), 30000)
        );

        const response = await Promise.race([
          sendStructuredMessage([analysisPrompt], schema),
          timeoutPromise
        ]) as string;
        
        const analysis = JSON.parse(response);

        setRecommendations(analysis.recommendations || []);
        setInsights(analysis.insights || []);

      } catch (error) {
        console.error('Error generating recommendations:', error);
        
        // Fallback to basic recommendations based on existing data
        const basicRecommendations = generateBasicRecommendations(notes);
        setRecommendations(basicRecommendations);
        setInsights(generateBasicInsights(notes));
      } finally {
        setIsLoading(false);
      }
    };

    // Add debounce to prevent too many requests
    const timeoutId = setTimeout(() => {
      generateRecommendations();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [notes.length]); // Only depend on notes.length, not the full notes array or sendStructuredMessage

  const generateBasicRecommendations = (userNotes: any[]): NoteRecommendation[] => {
    if (userNotes.length === 0) return [];

    const recommendations: NoteRecommendation[] = [];
    
    // Find notes with similar tags
    const tagCounts = userNotes.reduce((acc, note) => {
      (note.tags || []).forEach((tag: string) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const popularTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([tag]) => tag);

    if (popularTags.length > 0) {
      recommendations.push({
        id: 'popular-tags',
        type: 'trending',
        title: `Explore ${popularTags[0]} topic further`,
        reason: `You've written ${tagCounts[popularTags[0]]} notes about this topic`,
        confidence: 0.8,
        tags: [popularTags[0]]
      });
    }

    // Suggest organizing old notes
    const oldNotes = userNotes.filter(note => {
      const daysSinceUpdate = (Date.now() - new Date(note.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate > 30;
    });

    if (oldNotes.length > 5) {
      recommendations.push({
        id: 'organize-old',
        type: 'suggested',
        title: 'Review and organize older notes',
        reason: `You have ${oldNotes.length} notes that haven't been updated in over 30 days`,
        confidence: 0.7
      });
    }

    return recommendations;
  };

  const generateBasicInsights = (userNotes: any[]): SmartInsight[] => {
    const insights: SmartInsight[] = [];

    // Writing frequency insight
    const avgNotesPerWeek = userNotes.length > 0 ? (userNotes.length / 4) : 0; // rough estimate
    insights.push({
      type: 'productivity',
      title: 'Writing Consistency',
      description: `You create approximately ${avgNotesPerWeek.toFixed(1)} notes per week`,
      actionable: avgNotesPerWeek < 2
    });

    // Content length insight
    const avgLength = userNotes.length > 0 
      ? userNotes.reduce((sum: number, note: any) => sum + (Number(note.content?.length) || 0), 0) / userNotes.length
      : 0;
    
    insights.push({
      type: 'pattern',
      title: 'Note Length Pattern',
      description: avgLength > 1000 
        ? 'You tend to write detailed, comprehensive notes'
        : 'You prefer concise, focused notes',
      actionable: false
    });

    return insights;
  };

  const handleRecommendationClick = (recommendation: NoteRecommendation) => {
    if (recommendation.type === 'related' || recommendation.type === 'similar') {
      // Find and open the related note
      const relatedNote = notes.find(note => 
        note.title.toLowerCase().includes(recommendation.title.toLowerCase()) ||
        (note.tags || []).some((tag: string) => 
          (recommendation.tags || []).includes(tag)
        )
      );
      
      if (relatedNote) {
        onEditNote(relatedNote);
      }
    }
    // For other types, we could navigate to relevant sections or create new notes
  };

  if (isLoading) {
    return (
      <Card className={`border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl ${className}`}>
        <CardHeader className="p-4 pb-3 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center border border-yellow-500/10">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
            </div>
            <CardTitle className="text-lg font-bold text-foreground">
              Smart Recommendations
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-transparent border-t-primary rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (notes.length === 0) {
    return (
      <Card className={`border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl ${className}`}>
        <CardHeader className="p-4 pb-3 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center border border-yellow-500/10">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
            </div>
            <CardTitle className="text-lg font-bold text-foreground">
              Smart Recommendations
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-2">No notes yet for analysis</p>
            <p className="text-xs text-muted-foreground">Create some notes to get AI-powered recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl ${className}`}>
      <CardHeader className="p-4 pb-3 border-b border-border/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 flex items-center justify-center border border-yellow-500/10">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              Smart Recommendations
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              AI-powered insights for your notes
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* Insights Section */}
        {insights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              Smart Insights
            </h4>
            <div className="space-y-2">
              {insights.slice(0, 2).map((insight, index) => (
                <div key={index} className="p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/30">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-yellow-800 mb-1">{insight.title}</h5>
                      <p className="text-xs text-yellow-700">{insight.description}</p>
                    </div>
                    {insight.actionable && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                        Action
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Recommendations
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recommendations.slice(0, 4).map((rec) => (
                <div 
                  key={rec.id}
                  className="p-3 rounded-lg bg-card/80 border border-border/20 hover:bg-card/90 transition-colors cursor-pointer group"
                  onClick={() => handleRecommendationClick(rec)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-0 ${
                            rec.type === 'related' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            rec.type === 'similar' ? 'bg-green-50 text-green-600 border-green-200' :
                            rec.type === 'trending' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                            'bg-orange-50 text-orange-600 border-orange-200'
                          }`}
                        >
                          {rec.type}
                        </Badge>
                        <div className="w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h5 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {rec.title}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {rec.reason}
                      </p>
                      {rec.tags && rec.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {rec.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                              <Tags className="w-2 h-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-muted-foreground">
                        {Math.round(rec.confidence * 100)}%
                      </span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="pt-2 border-t border-border/10">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Real-time</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartNoteRecommendations;