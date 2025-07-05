import { useState, useEffect, useMemo } from 'react';
import { AdvancedAnalyticsService } from '@/services/advancedAnalyticsService';
import { AdvancedAnalyticsData, AnalyticsFilter } from '@/types/analytics';
import { useAuth } from '@/contexts/AuthContext';

export const useAdvancedAnalytics = (initialFilter?: Partial<AnalyticsFilter>) => {
  const { user } = useAuth();
  const [data, setData] = useState<AdvancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Default filter configuration
  const defaultFilter: AnalyticsFilter = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30); // Last 30 days by default

    return {
      dateRange: { start, end },
      groupBy: 'day',
      includeDeleted: false,
      ...initialFilter
    };
  }, [initialFilter]);

  const [filter, setFilter] = useState<AnalyticsFilter>(defaultFilter);

  // Fetch analytics data
  const fetchAnalytics = async (currentFilter: AnalyticsFilter) => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const analyticsData = await AdvancedAnalyticsService.getAdvancedAnalytics(currentFilter);
      setData(analyticsData);
    } catch (err) {
      console.error('Error fetching advanced analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when filter changes
  useEffect(() => {
    fetchAnalytics(filter);
  }, [user, filter, refreshKey]);

  // Update filter function
  const updateFilter = (newFilter: Partial<AnalyticsFilter>) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      ...newFilter
    }));
  };

  // Refresh data function
  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Set date range helper
  const setDateRange = (start: Date, end: Date) => {
    updateFilter({ dateRange: { start, end } });
  };

  // Preset date ranges
  const presetRanges = {
    last7Days: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 7);
      setDateRange(start, end);
    },
    last30Days: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      setDateRange(start, end);
    },
    last90Days: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 90);
      setDateRange(start, end);
    },
    thisMonth: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setDateRange(start, end);
    },
    lastMonth: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      setDateRange(start, end);
    },
    thisYear: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 1);
      const end = new Date(now.getFullYear(), 11, 31);
      setDateRange(start, end);
    }
  };

  // Computed metrics for quick access
  const metrics = useMemo(() => {
    if (!data) return null;

    return {
      totalNotes: data.overview.totalNotes,
      totalWords: data.overview.totalWords,
      averageWordsPerNote: data.overview.averageWordsPerNote,
      growthRate: data.overview.growthRate,
      currentStreak: data.productivity.streaks.current,
      focusTime: data.productivity.focusTime,
      topCategory: data.categories[0]?.category || 'general',
      peakHour: data.writingPatterns.productiveHours[0] || 9,
      engagementScore: data.userBehavior.engagementScore,
      completionRate: data.productivity.taskCompletionRate
    };
  }, [data]);

  // High-level insights
  const insights = useMemo(() => {
    if (!data) return [];
    return data.aiInsights.filter(insight => insight.impact === 'high');
  }, [data]);

  // Performance indicators
  const performanceIndicators = useMemo(() => {
    if (!data) return null;

    const indicators = {
      productivity: {
        score: Math.round(data.productivity.taskCompletionRate * 100),
        trend: data.overview.growthRate > 0 ? 'up' : data.overview.growthRate < 0 ? 'down' : 'stable',
        color: data.productivity.taskCompletionRate > 0.8 ? 'green' : 
               data.productivity.taskCompletionRate > 0.6 ? 'yellow' : 'red'
      },
      engagement: {
        score: Math.round(data.userBehavior.engagementScore * 100),
        trend: 'stable', // Would need historical data for actual trend
        color: data.userBehavior.engagementScore > 0.8 ? 'green' : 
               data.userBehavior.engagementScore > 0.6 ? 'yellow' : 'red'
      },
      consistency: {
        score: Math.min(data.productivity.streaks.current * 10, 100),
        trend: data.productivity.streaks.current > 5 ? 'up' : 'stable',
        color: data.productivity.streaks.current > 7 ? 'green' : 
               data.productivity.streaks.current > 3 ? 'yellow' : 'red'
      }
    };

    return indicators;
  }, [data]);

  return {
    // Data
    data,
    loading,
    error,
    metrics,
    insights,
    performanceIndicators,
    
    // Filters
    filter,
    updateFilter,
    setDateRange,
    presetRanges,
    
    // Actions
    refresh,
    
    // Utilities
    isReady: !loading && !error && data !== null,
    isEmpty: !loading && !error && data?.overview.totalNotes === 0
  };
};

// Hook for specific analytics widgets
export const useAnalyticsWidget = (widgetType: string, config?: any) => {
  const { data, loading, error } = useAdvancedAnalytics();
  
  const widgetData = useMemo(() => {
    if (!data) return null;
    
    switch (widgetType) {
      case 'overview':
        return data.overview;
      case 'timeSeries':
        return data.timeSeries;
      case 'categories':
        return data.categories;
      case 'writingPatterns':
        return data.writingPatterns;
      case 'productivity':
        return data.productivity;
      case 'insights':
        return data.aiInsights;
      case 'predictions':
        return data.predictions;
      default:
        return null;
    }
  }, [data, widgetType]);

  return {
    data: widgetData,
    loading,
    error,
    isReady: !loading && !error && widgetData !== null
  };
};

// Hook for real-time analytics updates
export const useRealtimeAnalytics = () => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { refresh } = useAdvancedAnalytics();

  useEffect(() => {
    // Set up real-time updates (every 5 minutes)
    const interval = setInterval(() => {
      refresh();
      setLastUpdate(new Date());
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refresh]);

  return {
    lastUpdate,
    forceUpdate: () => {
      refresh();
      setLastUpdate(new Date());
    }
  };
};