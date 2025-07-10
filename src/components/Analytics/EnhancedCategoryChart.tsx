import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, TrendingUp, Hash, Eye, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
  trend: number;
  color: string;
}

interface EnhancedCategoryChartProps {
  categoryCounts: Record<string, number>;
  totalNotes: number;
}

const EnhancedCategoryChart: React.FC<EnhancedCategoryChartProps> = ({
  categoryCounts,
  totalNotes
}) => {
  const [viewMode, setViewMode] = useState<'pie' | 'bar'>('pie');
  const [showAll, setShowAll] = useState(false);

  // Generate vibrant colors for categories
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  // Process category data
  const categoryData: CategoryData[] = Object.entries(categoryCounts)
    .map(([category, count], index) => ({
      category: category || 'uncategorized',
      count,
      percentage: Math.round((count / totalNotes) * 100),
      trend: Math.floor(Math.random() * 30) - 10, // Mock trend data
      color: colors[index % colors.length]
    }))
    .sort((a, b) => b.count - a.count);

  // Show top 6 categories or all
  const displayData = showAll ? categoryData : categoryData.slice(0, 6);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
          <p className="font-medium text-foreground capitalize">{data.category}</p>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Notes: <span className="font-medium text-foreground">{data.count}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Share: <span className="font-medium text-foreground">{data.percentage}%</span>
            </p>
            <p className={`text-sm ${data.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Trend: {data.trend >= 0 ? '+' : ''}{data.trend}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="h-[600px] overflow-hidden">
      <CardHeader className="border-b border-border/5 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Category Distribution
              </span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Breakdown of your content by category
              </p>
            </div>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'pie' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('pie')}
              className="h-8 w-8 p-0"
            >
              <div className="w-4 h-4 rounded-full border-2 border-current" />
            </Button>
            <Button
              variant={viewMode === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('bar')}
              className="h-8 w-8 p-0"
            >
              <div className="flex gap-0.5">
                <div className="w-1 h-4 bg-current rounded-sm" />
                <div className="w-1 h-3 bg-current rounded-sm" />
                <div className="w-1 h-4 bg-current rounded-sm" />
              </div>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 h-[calc(600px-120px)] overflow-y-auto">
        {totalNotes === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No categories to display</p>
              <p className="text-sm text-muted-foreground mt-1">Start writing notes to see category distribution</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-64"
            >
              <ResponsiveContainer width="100%" height="100%">
                {viewMode === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={displayData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {displayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                ) : (
                  <BarChart data={displayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.3} />
                    <XAxis 
                      dataKey="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {displayData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </motion.div>

            {/* Category List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Category Breakdown</h3>
                {categoryData.length > 6 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs"
                  >
                    {showAll ? 'Show Less' : `Show All (${categoryData.length})`}
                  </Button>
                )}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {displayData.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group p-3 rounded-lg border border-border/50 hover:border-border transition-all duration-200 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-foreground capitalize truncate">
                              {category.category}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {category.count}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={category.percentage} 
                              className="h-1.5 flex-1"
                              style={{ 
                                background: `${category.color}15`,
                              }}
                            />
                            <span className="text-sm text-muted-foreground w-10 text-right">
                              {category.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-3">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            category.trend >= 0 
                              ? 'text-green-600 border-green-500/20 bg-green-500/10' 
                              : 'text-red-600 border-red-500/20 bg-red-500/10'
                          }`}
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {category.trend >= 0 ? '+' : ''}{category.trend}%
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedCategoryChart;