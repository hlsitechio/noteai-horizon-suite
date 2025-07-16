import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Activity, 
  FileText, 
  BarChart3, 
  Search,
  Settings,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  featured?: boolean;
  category: 'productivity' | 'analytics' | 'management';
  benefits: string[];
  mockupUrl?: string;
}

const features: FeatureCard[] = [
  // Productivity Features
  {
    id: 'smart-calendar',
    name: 'Smart Calendar',
    description: 'Intelligent scheduling with AI-powered task management and event planning',
    icon: Calendar,
    featured: true,
    category: 'productivity',
    benefits: [
      'AI-powered event scheduling',
      'Integrated task management',
      'Smart reminders & notifications',
      'Seamless calendar sync'
    ]
  },
  {
    id: 'activity-tracking',
    name: 'Activity Log',
    description: 'Comprehensive activity tracking with detailed insights and filtering',
    icon: Activity,
    category: 'productivity',
    benefits: [
      'Real-time activity monitoring',
      'Advanced search & filtering',
      'Detailed action history',
      'Performance insights'
    ]
  },
  {
    id: 'rich-editor',
    name: 'AI-Powered Editor',
    description: 'Rich text editor with integrated AI assistant for enhanced writing',
    icon: FileText,
    featured: true,
    category: 'productivity',
    benefits: [
      'AI writing assistance',
      'Smart content suggestions',
      'Real-time collaboration',
      'Advanced formatting tools'
    ]
  },
  // Analytics Features
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Comprehensive analytics with productivity insights and performance metrics',
    icon: BarChart3,
    category: 'analytics',
    benefits: [
      'Writing pattern analysis',
      'Productivity tracking',
      'Goal achievement metrics',
      'Time-based insights'
    ]
  },
  {
    id: 'seo-dashboard',
    name: 'SEO Analytics',
    description: 'Monitor and optimize your content\'s search engine performance',
    icon: Search,
    category: 'analytics',
    benefits: [
      'SEO score monitoring',
      'Keyword ranking tracking',
      'Performance optimization',
      'Content recommendations'
    ]
  },
  // Management Features
  {
    id: 'advanced-settings',
    name: 'Advanced Settings',
    description: 'Comprehensive preference management with personalization options',
    icon: Settings,
    category: 'management',
    benefits: [
      'Complete customization',
      'Profile management',
      'Integration settings',
      'Security controls'
    ]
  }
];

const categoryLabels = {
  productivity: 'Productivity',
  analytics: 'Analytics',
  management: 'Management'
};

const MockupPreview: React.FC<{ feature: FeatureCard }> = ({ feature }) => {
  const baseClasses = "bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-6 min-h-[320px] relative overflow-hidden";
  
  return (
    <div className={baseClasses}>
      {/* Window Chrome */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        <span className="ml-3 text-sm font-medium text-foreground">{feature.name}</span>
      </div>

      {/* Feature-specific content */}
      {feature.id === 'smart-calendar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-xs text-center text-muted-foreground p-1">{day}</div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="aspect-square border border-border/30 rounded text-xs flex items-center justify-center relative">
                {i + 1 <= 31 && (
                  <>
                    <span className="text-muted-foreground">{i + 1}</span>
                    {[3, 7, 15, 22].includes(i + 1) && (
                      <div className="absolute bottom-0.5 left-0.5 right-0.5 h-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-80"></div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="bg-card/50 rounded-lg p-3 border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm font-medium">Create New Task</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-muted/60 rounded-full w-full"></div>
              <div className="h-2 bg-muted/40 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {feature.id === 'activity-tracking' && (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-card/30 rounded-lg border border-border/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-foreground/80 rounded-full w-full max-w-[180px]"></div>
                <div className="h-2 bg-muted-foreground/60 rounded-full w-24"></div>
              </div>
              <div className="text-xs text-muted-foreground">
                {['10:19 AM', '9:45 AM', '8:58 AM', '8:26 AM', '7:15 AM'][i]}
              </div>
            </div>
          ))}
        </div>
      )}

      {feature.id === 'rich-editor' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-2 bg-card/50 rounded border border-border/30">
            <div className="flex gap-1">
              {['B', 'I', 'U'].map((letter, i) => (
                <div key={i} className="w-6 h-6 rounded bg-muted/40 flex items-center justify-center text-xs">
                  {letter}
                </div>
              ))}
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex gap-1">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-foreground/80 rounded-full w-full"></div>
            <div className="h-3 bg-muted-foreground/60 rounded-full w-5/6"></div>
            <div className="h-3 bg-muted-foreground/40 rounded-full w-4/6"></div>
          </div>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Assistant</span>
            </div>
            <div className="space-y-1">
              <div className="h-2 bg-primary/40 rounded-full w-full"></div>
              <div className="h-2 bg-primary/30 rounded-full w-3/4"></div>
            </div>
          </div>
        </div>
      )}

      {feature.id === 'analytics-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Notes', value: '6', color: 'from-blue-400 to-blue-600' },
              { label: 'Words Written', value: '1.2K', color: 'from-green-400 to-green-600' },
              { label: 'This Week', value: '6', color: 'from-purple-400 to-purple-600' },
              { label: 'Favorites', value: '2', color: 'from-red-400 to-red-600' }
            ].map((stat, i) => (
              <div key={i} className="bg-card/40 rounded-lg p-3 border border-border/30">
                <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                <div className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-card/30 rounded-lg p-3 border border-border/30">
            <div className="text-sm font-medium mb-2">Peak Hours</div>
            <div className="flex items-end gap-1 h-16">
              {Array.from({ length: 12 }, (_, i) => (
                <div 
                  key={i} 
                  className="bg-gradient-to-t from-primary to-accent flex-1 rounded-sm"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {feature.id === 'seo-dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'SEO Score', value: '95', color: 'text-green-400' },
              { label: 'Organic Traffic', value: '0', color: 'text-blue-400' },
              { label: 'Keywords', value: '0', color: 'text-purple-400' },
              { label: 'Page Speed', value: '0', color: 'text-orange-400' }
            ].map((metric, i) => (
              <div key={i} className="bg-card/40 rounded-lg p-3 border border-border/30">
                <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
                <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-card/30 rounded-lg p-4 border border-border/30">
            <div className="text-sm font-medium mb-2">SEO Health Score</div>
            <div className="text-2xl font-bold text-green-400 mb-2">95/100</div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
            </div>
          </div>
        </div>
      )}

      {feature.id === 'advanced-settings' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="h-3 bg-foreground/80 rounded-full w-24 mb-1"></div>
              <div className="h-2 bg-muted-foreground/60 rounded-full w-16"></div>
            </div>
          </div>
          <div className="space-y-3">
            {['Account & Profile', 'Appearance & Layout', 'Integrations & Data', 'System & Apps'].map((setting, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-card/30 rounded border border-border/20">
                <div className="w-8 h-8 rounded bg-muted/40 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-br from-primary/60 to-accent/60 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-2.5 bg-foreground/70 rounded-full w-full max-w-[120px]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-lg"></div>
    </div>
  );
};

export const LandingFeatureShowcase: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'productivity' | 'analytics' | 'management'>('productivity');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const filteredFeatures = features.filter(feature => feature.category === activeCategory);

  const handleTryFeature = (featureId: string) => {
    // For landing page, this would navigate to the app or show a demo
    console.log('Demo: Try feature', featureId);
  };

  return (
    <section className="py-24 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Feature Showcase
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover powerful features designed to enhance your productivity and provide 
            comprehensive insights into your work patterns.
          </motion.p>
        </div>

        {/* Category Toggle */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-1">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as typeof activeCategory)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200",
                  activeCategory === key 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {key === 'productivity' && <Calendar className="w-4 h-4" />}
                {key === 'analytics' && <BarChart3 className="w-4 h-4" />}
                {key === 'management' && <Settings className="w-4 h-4" />}
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Feature Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                onHoverStart={() => setHoveredFeature(feature.id)}
                onHoverEnd={() => setHoveredFeature(null)}
              >
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20">
                  {/* Feature Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {feature.name}
                          {feature.featured && (
                            <span className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Hover Glow Effect */}
                {hoveredFeature === feature.id && (
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{ 
                      background: `radial-gradient(circle at center, hsl(var(--primary)/0.2) 0%, transparent 70%)`,
                      filter: 'blur(20px)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Featured Demo Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-2">See It In Action</h3>
            <p className="text-muted-foreground">Experience our most popular features with interactive previews</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.filter(f => f.featured).map((feature, index) => (
              <motion.div
                key={feature.id}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MockupPreview feature={feature} />
                
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};