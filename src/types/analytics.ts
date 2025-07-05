// Advanced Analytics Types for AI-Powered Dashboard

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface CategoryAnalytics {
  category: string;
  count: number;
  percentage: number;
  trend: number; // percentage change from previous period
  averageWordCount: number;
  averageSessionTime: number;
}

export interface WritingPatternAnalysis {
  productiveHours: number[];
  averageWordsPerSession: number;
  writingVelocity: number; // words per minute
  sessionDuration: number; // average in minutes
  frequentTopics: string[];
  writingStyle: {
    complexity: number; // 1-10 scale
    sentiment: number; // -1 to 1
    readability: number; // 1-10 scale
  };
}

export interface UserBehaviorMetrics {
  totalSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  engagementScore: number;
  featureUsage: Record<string, number>;
  navigationPatterns: string[];
}

export interface AIInsights {
  id: string;
  type: 'trend' | 'recommendation' | 'achievement' | 'warning';
  title: string;
  description: string;
  actionable: boolean;
  confidence: number; // 0-1
  generatedAt: Date;
  category: string;
  impact: 'low' | 'medium' | 'high';
}

export interface ProductivityMetrics {
  focusTime: number; // total minutes
  distractionEvents: number;
  taskCompletionRate: number;
  goalProgress: Record<string, number>;
  streaks: {
    current: number;
    longest: number;
    type: 'daily' | 'weekly';
  };
}

export interface AdvancedAnalyticsData {
  timeRange: {
    start: Date;
    end: Date;
    period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  };
  overview: {
    totalNotes: number;
    totalWords: number;
    totalCharacters: number;
    averageWordsPerNote: number;
    growthRate: number;
  };
  timeSeries: {
    notes: TimeSeriesDataPoint[];
    words: TimeSeriesDataPoint[];
    sessions: TimeSeriesDataPoint[];
  };
  categories: CategoryAnalytics[];
  writingPatterns: WritingPatternAnalysis;
  userBehavior: UserBehaviorMetrics;
  productivity: ProductivityMetrics;
  aiInsights: AIInsights[];
  predictions: {
    nextWeekActivity: number;
    goalCompletion: Record<string, number>;
    trendForecasts: TimeSeriesDataPoint[];
  };
}

export interface AnalyticsFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  categories?: string[];
  contentTypes?: string[];
  includeDeleted?: boolean;
  groupBy?: 'day' | 'week' | 'month';
}

export interface ChartConfig {
  type: 'line' | 'area' | 'bar' | 'pie' | 'heatmap' | 'scatter';
  title: string;
  description?: string;
  data: any[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  showLegend?: boolean;
  interactive?: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'insight' | 'table';
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large' | 'full';
  config: any;
  refreshInterval?: number; // in seconds
  dependencies?: string[]; // other widget IDs
}

export interface AnalyticsReport {
  id: string;
  title: string;
  description: string;
  generatedAt: Date;
  period: {
    start: Date;
    end: Date;
  };
  sections: {
    summary: any;
    trends: any;
    insights: AIInsights[];
    actionItems: string[];
  };
  exportFormats: ('pdf' | 'csv' | 'json')[];
}