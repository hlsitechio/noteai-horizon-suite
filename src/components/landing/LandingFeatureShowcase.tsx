import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Activity, 
  FileText, 
  BarChart3, 
  Bell,
  Settings,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Eye,
  Cloud,
  Download,
  Mic,
  Image,
  ScanText,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  featured?: boolean;
  category: 'productivity' | 'analytics' | 'management' | 'projects';
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
    id: 'enhanced-analytics',
    name: 'Enhanced Analytics',
    description: 'Advanced data visualization with interactive charts and real-time insights',
    icon: BarChart3,
    featured: true,
    category: 'analytics',
    benefits: [
      'Interactive line charts',
      'Pie chart distribution',
      'Area chart trends',
      'Real-time data updates'
    ]
  },
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
    id: 'notification-center',
    name: 'Notification Center',
    description: 'Stay informed with smart notifications and alerts for all important updates',
    icon: Bell,
    featured: true,
    category: 'analytics',
    benefits: [
      'Real-time push notifications',
      'Smart notification filtering',
      'Customizable alert preferences',
      'Multi-channel delivery'
    ]
  },
  // Management Features
  {
    id: 'activity-tracking',
    name: 'Activity Log',
    description: 'Comprehensive activity tracking with detailed insights and filtering',
    icon: Activity,
    category: 'management',
    benefits: [
      'Real-time activity monitoring',
      'Advanced search & filtering',
      'Detailed action history',
      'Performance insights'
    ]
  },
  {
    id: 'google-drive-integration',
    name: 'Google Drive Integration',
    description: 'Seamlessly sync and access your Google Drive files directly within the platform',
    icon: Cloud,
    featured: true,
    category: 'management',
    benefits: [
      'Two-way sync with Google Drive',
      'Direct file access in workspace',
      'Automatic backup and sync',
      'Collaborative editing support'
    ]
  },
  {
    id: 'data-export',
    name: 'Data Export',
    description: 'Export your data in multiple formats for backup, migration, or analysis',
    icon: Download,
    category: 'management',
    benefits: [
      'Multiple export formats (JSON, CSV, PDF)',
      'Bulk data export capabilities',
      'Scheduled automated exports',
      'Data portability guarantee'
    ]
  },
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
  },
  // Projects Features
  {
    id: 'voice-recording',
    name: 'Voice Notes',
    description: 'Record audio notes with AI-powered transcription and smart organization',
    icon: Mic,
    featured: true,
    category: 'projects',
    benefits: [
      'One-click voice recording',
      'AI-powered transcription',
      'Smart note organization',
      'Playback and editing tools'
    ]
  },
  {
    id: 'clipboard-screenshots',
    name: 'Clipboard Integration',
    description: 'Seamlessly paste and organize screenshots from your clipboard',
    icon: Image,
    category: 'projects',
    benefits: [
      'Instant clipboard paste',
      'Automatic image optimization',
      'Smart categorization',
      'Quick annotation tools'
    ]
  },
  {
    id: 'screen-ocr',
    name: 'Screen OCR',
    description: 'Extract text from screenshots and images with advanced OCR technology',
    icon: ScanText,
    featured: true,
    category: 'projects',
    benefits: [
      'High-accuracy text extraction',
      'Multi-language support',
      'Batch processing',
      'Editable text output'
    ]
  },
  {
    id: 'project-management',
    name: 'Project Organization',
    description: 'Organize your work into projects with smart categorization and workflows',
    icon: FolderOpen,
    category: 'projects',
    benefits: [
      'Smart project templates',
      'Automated workflows',
      'Progress tracking',
      'Team collaboration'
    ]
  }
];

const categoryLabels = {
  productivity: 'Productivity',
  analytics: 'Analytics',
  management: 'Management',
  projects: 'Projects'
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
      {feature.id === 'voice-recording' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500/20 to-pink-600/20 flex items-center justify-center">
              <Mic className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="h-3 bg-red-500/80 rounded-full w-32 mb-1"></div>
              <div className="h-2 bg-muted-foreground/60 rounded-full w-20"></div>
            </div>
          </div>
          <div className="bg-card/40 rounded-lg p-4 border border-border/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Recording...</span>
              <span className="text-xs text-red-500">●</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              {Array.from({ length: 12 }, (_, i) => (
                <div 
                  key={i} 
                  className="bg-gradient-to-t from-red-400 to-red-500 w-1 rounded-full"
                  style={{ height: `${Math.random() * 20 + 10}px` }}
                ></div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">Duration: 00:47</div>
          </div>
          <div className="bg-card/30 rounded-lg p-3 border border-border/30">
            <div className="text-sm font-medium mb-2">AI Transcription</div>
            <div className="space-y-1">
              <div className="h-2 bg-primary/40 rounded-full w-full"></div>
              <div className="h-2 bg-primary/30 rounded-full w-3/4"></div>
              <div className="h-2 bg-primary/20 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      )}

      {feature.id === 'clipboard-screenshots' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
              <Image className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <div className="h-3 bg-emerald-500/80 rounded-full w-28 mb-1"></div>
              <div className="h-2 bg-muted-foreground/60 rounded-full w-16"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-muted/40 to-muted/20 rounded-lg border border-border/30 flex items-center justify-center">
                <Image className="w-6 h-6 text-muted-foreground/60" />
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg p-3 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">Auto-detected: Screenshot</span>
            </div>
            <div className="text-xs text-muted-foreground">Optimized and ready to paste</div>
          </div>
        </div>
      )}

      {feature.id === 'screen-ocr' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center">
              <ScanText className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <div className="h-3 bg-violet-500/80 rounded-full w-24 mb-1"></div>
              <div className="h-2 bg-muted-foreground/60 rounded-full w-16"></div>
            </div>
          </div>
          <div className="bg-card/40 rounded-lg p-4 border border-border/30 relative">
            <div className="text-sm font-medium mb-3">Extracting Text...</div>
            <div className="space-y-2">
              <div className="h-2 bg-gradient-to-r from-violet-400/60 to-violet-300/40 rounded-full w-full"></div>
              <div className="h-2 bg-gradient-to-r from-violet-400/40 to-violet-300/20 rounded-full w-4/5"></div>
              <div className="h-2 bg-gradient-to-r from-violet-400/20 to-transparent rounded-full w-3/5"></div>
            </div>
            <div className="absolute top-2 right-3">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="bg-card/30 rounded-lg p-3 border border-border/30">
            <div className="text-sm font-medium mb-2">Extracted Text Preview</div>
            <div className="space-y-1">
              <div className="h-2 bg-foreground/60 rounded-full w-full"></div>
              <div className="h-2 bg-foreground/40 rounded-full w-5/6"></div>
              <div className="h-2 bg-foreground/20 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>
      )}

      {feature.id === 'project-management' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-600/20 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <div className="h-3 bg-indigo-500/80 rounded-full w-36 mb-1"></div>
              <div className="h-2 bg-muted-foreground/60 rounded-full w-24"></div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Website Redesign', progress: 75, color: 'from-blue-400 to-blue-500' },
              { name: 'Mobile App', progress: 45, color: 'from-green-400 to-green-500' },
              { name: 'Documentation', progress: 90, color: 'from-purple-400 to-purple-500' }
            ].map((project, i) => (
              <div key={i} className="bg-card/30 rounded-lg p-3 border border-border/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{project.name}</span>
                  <span className="text-xs text-muted-foreground">{project.progress}%</span>
                </div>
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${project.color} h-2 rounded-full transition-all duration-300`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
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
  const [activeCategory, setActiveCategory] = useState<'productivity' | 'analytics' | 'management' | 'projects'>('productivity');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const filteredFeatures = features.filter(feature => feature.category === activeCategory);

  const handleTryFeature = (featureId: string) => {
    console.log('Demo: Try feature', featureId);
  };

  return (
    <section className="py-24 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Experience the full potential of our platform with advanced tools designed for modern professionals
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
          <div 
            className="inline-flex items-center space-x-4"
            onMouseLeave={() => setHoveredFeature(null)}
          >
            {Object.entries(categoryLabels).map(([key, label]) => (
              <div key={key} className="relative group">
                <motion.button
                  onClick={() => setActiveCategory(key as typeof activeCategory)}
                  onMouseEnter={() => setHoveredFeature(key)}
                  className={cn(
                    "relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-500 backdrop-blur-sm border",
                    activeCategory === key 
                      ? "bg-white/10 border-white/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                      : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/8 hover:border-white/20 hover:text-white"
                  )}
                  style={{
                    boxShadow: activeCategory === key 
                      ? '0 0 30px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)' 
                      : 'inset 0 1px 0 rgba(255,255,255,0.05)'
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {key === 'productivity' && <Calendar className="w-4 h-4" />}
                    {key === 'analytics' && <BarChart3 className="w-4 h-4" />}
                    {key === 'management' && <Settings className="w-4 h-4" />}
                    {key === 'projects' && <FolderOpen className="w-4 h-4" />}
                    {label}
                  </span>
                </motion.button>
              </div>
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

      </div>
    </section>
  );
};
