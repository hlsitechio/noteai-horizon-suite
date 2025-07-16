import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalyticsShowcase from '@/components/Analytics/Enhanced/AnalyticsShowcase';
import { Link } from 'react-router-dom';

const AnalyticsDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Landing
              </Button>
            </Link>
            <div className="h-6 w-px bg-border/50" />
            <h1 className="text-xl font-semibold text-foreground">Analytics Demo</h1>
          </div>
        </div>
      </div>

      {/* Analytics Showcase */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnalyticsShowcase />
      </motion.div>
    </div>
  );
};

export default AnalyticsDemo;