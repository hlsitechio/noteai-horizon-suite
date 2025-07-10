import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  Target, 
  Lightbulb, 
  Sparkles,
  ChevronRight,
  Clock,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Insight {
  id: string;
  type: 'achievement' | 'trend' | 'recommendation' | 'warning';
  title: string;
  description: string;
  actionable: boolean;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
}

interface SmartInsightsPanelProps {
  insights?: Insight[];
  loading?: boolean;
}

const SmartInsightsPanel: React.FC<SmartInsightsPanelProps> = ({
  insights = [],
  loading = false
}) => {
  // Mock insights for demo
  const mockInsights: Insight[] = [
    {
      id: '1',
      type: 'achievement',
      title: 'Writing Streak Achievement',
      description: 'Congratulations! You\'ve maintained a 7-day writing streak. Your consistency is paying off.',
      actionable: false,
      confidence: 0.95,
      impact: 'high',
      category: 'productivity'
    },
    {
      id: '2',
      type: 'trend',
      title: 'Peak Productivity Hours',
      description: 'Your most productive writing time is between 9-11 AM. Consider scheduling important tasks during this window.',
      actionable: true,
      confidence: 0.88,
      impact: 'medium',
      category: 'timing'
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Category Diversification',
      description: '85% of your notes are in one category. Try exploring different topics to broaden your knowledge base.',
      actionable: true,
      confidence: 0.75,
      impact: 'medium',
      category: 'content'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Decreased Activity',
      description: 'Your writing activity has decreased by 20% this week. Consider setting daily reminders.',
      actionable: true,
      confidence: 0.82,
      impact: 'high',
      category: 'productivity'
    }
  ];

  const displayInsights = insights.length > 0 ? insights : mockInsights;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return Award;
      case 'trend':
        return TrendingUp;
      case 'recommendation':
        return Lightbulb;
      case 'warning':
        return AlertCircle;
      default:
        return Brain;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-600',
          border: 'border-green-500/20',
          badge: 'bg-green-500/20 text-green-700'
        };
      case 'trend':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-600',
          border: 'border-blue-500/20',
          badge: 'bg-blue-500/20 text-blue-700'
        };
      case 'recommendation':
        return {
          bg: 'bg-purple-500/10',
          text: 'text-purple-600',
          border: 'border-purple-500/20',
          badge: 'bg-purple-500/20 text-purple-700'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10',
          text: 'text-orange-600',
          border: 'border-orange-500/20',
          badge: 'bg-orange-500/20 text-orange-700'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-600',
          border: 'border-gray-500/20',
          badge: 'bg-gray-500/20 text-gray-700'
        };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading) {
    return (
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] overflow-hidden">
      <CardHeader className="border-b border-border/5 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              AI Insights
            </span>
            <p className="text-sm text-muted-foreground font-normal mt-1">
              Smart recommendations powered by your data
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 h-[calc(600px-120px)] overflow-y-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="p-6 space-y-4"
        >
          {displayInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const colors = getInsightColor(insight.type);
            
            return (
              <motion.div
                key={insight.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className={`border-2 ${colors.border} bg-gradient-to-br ${colors.bg} transition-all duration-300 group-hover:shadow-lg hover:shadow-current/10`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <motion.div 
                        className={`p-2 rounded-lg ${colors.bg} transition-transform duration-200 group-hover:scale-110`}
                        whileHover={{ rotate: 5 }}
                      >
                        <Icon className={`h-5 w-5 ${colors.text}`} />
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {insight.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="secondary" className={`text-xs ${colors.badge}`}>
                              {insight.impact}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Target className="h-3 w-3 mr-1" />
                              {Math.round(insight.confidence * 100)}%
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {insight.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {insight.category}
                            </Badge>
                            {insight.actionable && (
                              <Badge variant="outline" className="text-xs text-green-600 border-green-500/20">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Actionable
                              </Badge>
                            )}
                          </div>
                          
                          {insight.actionable && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Take Action
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Generate more insights button */}
        <div className="p-6 border-t border-border/5">
          <Button 
            variant="outline" 
            className="w-full group transition-all duration-200 hover:bg-primary/5"
          >
            <Brain className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
            Generate More Insights
            <Sparkles className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartInsightsPanel;