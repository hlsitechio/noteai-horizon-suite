import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Download, 
  RefreshCw, 
  Settings,
  BarChart3,
  Target,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AnalyticsFilter } from '@/types/analytics';

interface AdvancedAnalyticsHeaderProps {
  filter: AnalyticsFilter;
  onFilterChange: (filter: Partial<AnalyticsFilter>) => void;
  onRefresh: () => void;
  onExport: () => void;
  loading?: boolean;
  lastUpdate?: Date;
  totalNotes?: number;
  growthRate?: number;
}

const AdvancedAnalyticsHeader: React.FC<AdvancedAnalyticsHeaderProps> = ({
  filter,
  onFilterChange,
  onRefresh,
  onExport,
  loading = false,
  lastUpdate,
  totalNotes = 0,
  growthRate = 0
}) => {
  const presetRanges = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'This Month', value: 'month' },
    { label: 'This Year', value: 'year' }
  ];

  const handlePresetRange = (preset: string) => {
    const end = new Date();
    let start = new Date();

    switch (preset) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      case 'month':
        start = new Date(end.getFullYear(), end.getMonth(), 1);
        break;
      case 'year':
        start = new Date(end.getFullYear(), 0, 1);
        break;
    }

    onFilterChange({ dateRange: { start, end } });
  };

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/20">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Advanced Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered insights into your writing patterns and productivity
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge 
            variant="secondary" 
            className="bg-green-500/10 text-green-600 border-green-500/20"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {growthRate > 0 ? '+' : ''}{growthRate.toFixed(1)}%
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Date Range Selector */}
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Select onValueChange={handlePresetRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grouping Selector */}
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
                <Select 
                  value={filter.groupBy || 'day'} 
                  onValueChange={(value) => onFilterChange({ groupBy: value as any })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Daily</SelectItem>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stats Summary */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-muted-foreground">Total Notes:</span>
                  <span className="font-semibold text-foreground">{totalNotes}</span>
                </div>
                
                {lastUpdate && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">Updated:</span>
                    <span className="font-semibold text-foreground">
                      {lastUpdate.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdvancedAnalyticsHeader;