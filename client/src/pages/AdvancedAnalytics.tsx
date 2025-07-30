import React from 'react';
import { motion } from 'framer-motion';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import AdvancedAnalyticsHeader from '@/components/Analytics/Advanced/AdvancedAnalyticsHeader';
import AIInsightsPanel from '@/components/Analytics/Advanced/AIInsightsPanel';
import AnalyticsOverview from '@/components/Dashboard/AnalyticsOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Clock, Brain } from 'lucide-react';

const AdvancedAnalytics: React.FC = () => {
  const {
    data,
    loading,
    error,
    metrics,
    insights,
    performanceIndicators,
    filter,
    updateFilter,
    refresh,
    presetRanges
  } = useAdvancedAnalytics();

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log('Exporting analytics data...');
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-destructive">Error loading analytics: {error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <AdvancedAnalyticsHeader
          filter={filter}
          onFilterChange={updateFilter}
          onRefresh={refresh}
          onExport={handleExport}
          loading={loading}
          totalNotes={metrics?.totalNotes}
          growthRate={metrics?.growthRate}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Key Metrics Cards */}
          {metrics && (
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{metrics.totalNotes}</p>
                      <p className="text-sm text-muted-foreground">Total Notes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{metrics.currentStreak}</p>
                      <p className="text-sm text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{metrics.focusTime}m</p>
                      <p className="text-sm text-muted-foreground">Focus Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Insights Panel */}
          <AIInsightsPanel insights={insights} loading={loading} />
        </motion.div>

        {/* Time Series Chart */}
        {data?.timeSeries && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-accent" />
                  Writing Activity Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.timeSeries.notes}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                      <XAxis 
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--accent))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdvancedAnalytics;