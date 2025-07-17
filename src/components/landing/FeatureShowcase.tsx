import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Layout, 
  FolderOpen, 
  MessageSquare, 
  Sparkles, 
  Activity, 
  Bell, 
  Download,
  Cloud,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ExplorerShowcase } from '@/components/showcase/ExplorerShowcase';

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
  benefits: string[];
  mockupType: 'notes' | 'workspace' | 'files' | 'chat' | 'activity' | 'notifications' | 'explorer';
}

const features: Feature[] = [
  {
    id: 'file-explorer',
    name: 'File Explorer',
    description: 'Powerful file and folder management with advanced search and organization features.',
    icon: Search,
    category: 'organization',
    benefits: [
      'Hierarchical folder structure',
      'Advanced search and filtering',
      'Grid and list view modes',
      'Real-time file preview'
    ],
    mockupType: 'explorer'
  },
  {
    id: 'activity-log',
    name: 'Activity Log',
    description: 'Track every action and change across your workspace with detailed activity logs.',
    icon: Activity,
    category: 'monitoring',
    benefits: [
      'Real-time activity tracking',
      'Detailed action history',
      'User behavior insights',
      'Audit trail for compliance'
    ],
    mockupType: 'activity'
  },
  {
    id: 'notification-center',
    name: 'Notification Center',
    description: 'Stay informed with smart notifications and alerts for all important updates.',
    icon: Bell,
    category: 'communication',
    benefits: [
      'Real-time push notifications',
      'Smart notification filtering',
      'Customizable alert preferences',
      'Multi-channel delivery'
    ],
    mockupType: 'notifications'
  },
  {
    id: 'google-drive-integration',
    name: 'Google Drive Integration',
    description: 'Seamlessly sync and access your Google Drive files directly within the platform.',
    icon: Cloud,
    category: 'integration',
    benefits: [
      'Two-way sync with Google Drive',
      'Direct file access in workspace',
      'Automatic backup and sync',
      'Collaborative editing support'
    ],
    mockupType: 'files'
  },
  {
    id: 'data-export',
    name: 'Data Export',
    description: 'Export your data in multiple formats for backup, migration, or analysis.',
    icon: Download,
    category: 'utility',
    benefits: [
      'Multiple export formats (JSON, CSV, PDF)',
      'Bulk data export capabilities',
      'Scheduled automated exports',
      'Data portability guarantee'
    ],
    mockupType: 'workspace'
  }
];

const MockupContent: React.FC<{ type: string }> = ({ type }) => {
  const baseClasses = "bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-4 space-y-3";
  
  switch (type) {
    case 'notes':
      return (
        <div className={cn(baseClasses, "min-h-[300px]")}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm font-medium text-foreground">Smart Notes</span>
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                  <FileText className="w-3 h-3 text-primary" />
                </div>
                <div className="h-3 bg-gradient-to-r from-primary to-primary/50 rounded-full flex-1 max-w-[200px]"></div>
              </div>
              <div className="ml-8 space-y-1">
                <div className="h-2 bg-muted/60 rounded-full w-full"></div>
                <div className="h-2 bg-muted/40 rounded-full w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      );
    
    case 'workspace':
      return (
        <div className={cn(baseClasses, "min-h-[300px]")}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm font-medium text-foreground">Workspace Dashboard</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card/50 rounded-lg p-3 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Layout className="w-3 h-3 text-accent" />
                  <div className="h-2 bg-accent/60 rounded-full flex-1"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-muted/40 rounded-full w-full"></div>
                  <div className="h-1.5 bg-muted/30 rounded-full w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'files':
      return (
        <div className={cn(baseClasses, "min-h-[300px]")}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm font-medium text-foreground">File Manager</span>
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-muted/20 rounded-md">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-secondary to-accent/60 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="h-2.5 bg-muted/60 rounded-full w-full max-w-[120px] mb-1"></div>
                  <div className="h-1.5 bg-muted/30 rounded-full w-16"></div>
                </div>
                <div className="h-2 bg-muted/40 rounded-full w-12"></div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'activity':
      return (
        <div className={cn(baseClasses, "min-h-[300px]")}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm font-medium text-foreground">Activity Log</span>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="h-2.5 bg-muted/60 rounded-full w-full max-w-[160px] mb-1"></div>
                  <div className="h-1.5 bg-muted/30 rounded-full w-20"></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <div className="h-1.5 bg-muted/40 rounded-full w-8"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'notifications':
      return (
        <div className={cn(baseClasses, "min-h-[300px]")}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm font-medium text-foreground">Notifications</span>
          </div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card/30 border border-border/20">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gradient-to-r from-primary/60 to-primary/30 rounded-full w-full max-w-[140px]"></div>
                  <div className="h-2 bg-muted/50 rounded-full w-full"></div>
                  <div className="h-2 bg-muted/30 rounded-full w-3/4"></div>
                </div>
                <Bell className="w-3 h-3 text-muted-foreground mt-1" />
              </div>
            ))}
          </div>
        </div>
      );
    
    case 'explorer':
      return (
        <div className="w-full">
          <ExplorerShowcase />
        </div>
      );
    
    default:
      return <div className={baseClasses}>Feature preview</div>;
  }
};

export const FeatureShowcase: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string>('file-explorer');
  
  const currentFeature = features.find(f => f.id === activeFeature) || features[0];

  return (
    <section className="py-24 px-6 lg:px-8 relative bg-gradient-to-br from-background via-background/95 to-accent/5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why use multiple apps when{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              OnlineNote.ai
            </span>{' '}
            does it better?
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            From brainstorm to launch—create, plan, and communicate in one 
            interconnected workspace.
          </motion.p>
        </div>

        {/* Feature Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 border",
                activeFeature === feature.id 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                  : "bg-card/50 text-muted-foreground border-border/50 hover:text-foreground hover:border-primary/30 backdrop-blur-sm"
              )}
            >
              <feature.icon className="w-4 h-4" />
              {feature.name}
            </button>
          ))}
        </motion.div>

        {/* Feature Content */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFeature}
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Feature Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <currentFeature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{currentFeature.name}</h3>
                </div>
                <p className="text-lg text-muted-foreground">{currentFeature.description}</p>
              </div>

              {/* Benefits List */}
              <div className="space-y-3">
                {currentFeature.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              {/* Learn More Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Button 
                  variant="outline" 
                  className="group hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  Learn more 
                  <motion.span
                    className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>
            </div>

            {/* Feature Mockup */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="relative z-10">
                <MockupContent type={currentFeature.mockupType} />
              </div>
              
              {/* Glow Effect */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-lg"
                style={{ 
                  background: `radial-gradient(circle at center, hsl(var(--primary)/0.15) 0%, transparent 70%)`,
                  filter: 'blur(20px)'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};