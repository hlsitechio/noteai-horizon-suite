import React from 'react';
import { motion } from 'framer-motion';
import EnhancedLineChart from './EnhancedLineChart';
import EnhancedPieChart from './EnhancedPieChart';
import EnhancedAreaChart from './EnhancedAreaChart';

const AnalyticsShowcase: React.FC = () => {
  // Sample data for charts
  const lineChartData = [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 78 },
    { name: 'Mar', value: 90 },
    { name: 'Apr', value: 81 },
    { name: 'May', value: 56 },
    { name: 'Jun', value: 75 },
    { name: 'Jul', value: 82 }
  ];

  const pieChartData = [
    { name: 'Desktop', value: 65 },
    { name: 'Tablet', value: 35 }
  ];

  const areaChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 780 },
    { name: 'Apr', value: 520 },
    { name: 'May', value: 600 },
    { name: 'Jun', value: 940 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-12"
      >
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Enhanced Analytics
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Powerful data visualization tools to help you understand your metrics and make informed decisions
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <EnhancedLineChart
          title="Line Chart"
          category="Charts"
          description="Display trends and data over time with line visualization"
          data={lineChartData}
          tags={['chart', 'line', 'trends', 'data', 'visualization']}
          height={300}
        />

        {/* Pie Chart */}
        <EnhancedPieChart
          title="Pie Chart"
          category="Charts"
          description="Show data distribution with circular pie chart"
          data={pieChartData}
          tags={['chart', 'pie', 'distribution', 'circular', 'percentage']}
          height={300}
        />
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        {/* Area Chart */}
        <EnhancedAreaChart
          title="Area Chart"
          category="Charts"
          description="Visualize data trends with filled area under the curve"
          data={areaChartData}
          tags={['chart', 'area', 'trends', 'filled', 'volume']}
          height={300}
        />
      </div>
    </div>
  );
};

export default AnalyticsShowcase;