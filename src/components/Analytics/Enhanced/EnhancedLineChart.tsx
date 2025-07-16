import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface EnhancedLineChartProps {
  title: string;
  category: string;
  description: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  tags?: string[];
  height?: number;
  className?: string;
}

const EnhancedLineChart: React.FC<EnhancedLineChartProps> = ({
  title,
  category,
  description,
  data,
  tags = [],
  height = 300,
  className = ""
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const currentValue = data[data.length - 1]?.value || 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">
            value: <span className="font-bold text-lg">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="bg-card/50 backdrop-blur-sm border-border/60 hover:bg-card/70 transition-colors duration-300">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{category}</span>
                <span className="text-xs text-muted-foreground">Added Jan 16, 2025</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-3 py-1 rounded-full border-border/60 bg-muted/50"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground">Performance Trend</h4>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-muted-foreground/20" 
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-xs fill-muted-foreground"
                  tick={{ fontSize: 12 }}
                  domain={[0, maxValue + 10]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ 
                    fill: "hsl(var(--primary))", 
                    strokeWidth: 0, 
                    r: 6,
                    className: "drop-shadow-sm"
                  }}
                  activeDot={{ 
                    r: 8, 
                    fill: "hsl(var(--primary))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                    className: "drop-shadow-md"
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedLineChart;