import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Video, Download, Clock, ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { safeSendAnalyticsEvent } from '@/utils/safeAnalytics';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'template' | 'video' | 'ebook';
  icon: React.ElementType;
  readTime?: string;
  downloadCount?: string;
  trending?: boolean;
  ctaText: string;
  link: string;
}

interface ContentHubProps {
  className?: string;
}

const ContentHub: React.FC<ContentHubProps> = ({ className = '' }) => {
  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'The Complete Guide to AI-Powered Note-Taking',
      description: 'Learn how to 10x your productivity with intelligent note organization, AI-powered insights, and automated workflows.',
      type: 'guide',
      icon: BookOpen,
      readTime: '12 min read',
      trending: true,
      ctaText: 'Read Guide',
      link: '/resources/ai-note-taking-guide'
    },
    {
      id: '2',
      title: 'Meeting Notes Template Pack',
      description: 'Professional templates for meetings, brainstorming sessions, project planning, and more. Used by 25,000+ professionals.',
      type: 'template',
      icon: FileText,
      downloadCount: '25K+ downloads',
      ctaText: 'Download Free',
      link: '/resources/meeting-templates'
    },
    {
      id: '3',
      title: 'Master OnlineNote.ai in 15 Minutes',
      description: 'Quick video walkthrough showing you the most powerful features and pro tips from our power users.',
      type: 'video',
      icon: Video,
      readTime: '15 min',
      ctaText: 'Watch Now',
      link: '/resources/tutorial-video'
    },
    {
      id: '4',
      title: 'The Future of Knowledge Work (Free eBook)',
      description: 'Insights on how AI is transforming productivity, featuring interviews with Fortune 500 executives and productivity experts.',
      type: 'ebook',
      icon: Download,
      downloadCount: '12K+ downloads',
      trending: true,
      ctaText: 'Get eBook',
      link: '/resources/future-knowledge-work'
    },
    {
      id: '5',
      title: 'Productivity Metrics That Actually Matter',
      description: 'Stop measuring the wrong things. Learn which productivity metrics drive real results in knowledge work.',
      type: 'guide',
      icon: TrendingUp,
      readTime: '8 min read',
      ctaText: 'Read Article',
      link: '/resources/productivity-metrics'
    },
    {
      id: '6',
      title: 'Team Collaboration Playbook',
      description: 'Step-by-step framework for implementing AI-powered note-taking across your entire organization.',
      type: 'guide',
      icon: Users,
      readTime: '18 min read',
      ctaText: 'Get Playbook',
      link: '/resources/team-collaboration'
    }
  ];

  const handleContentClick = (contentId: string, contentType: string) => {
    safeSendAnalyticsEvent('content_hub_item_clicked', {
      content_id: contentId,
      content_type: contentType,
      content_title: contentItems.find(item => item.id === contentId)?.title
    });
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'guide':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'template':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'video':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'ebook':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <section className={`py-20 bg-gradient-to-b from-background via-primary/2 to-background ${className}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Free Resources
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Master AI-Powered Productivity
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert guides, templates, and resources to help you get the most out of OnlineNote.ai. 
            Everything you need to transform your note-taking and boost your productivity.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {contentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20 relative"
            >
              {/* Trending Badge */}
              {item.trending && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  🔥 Trending
                </div>
              )}

              {/* Content Type Badge */}
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4 ${getTypeStyles(item.type)}`}>
                <item.icon className="w-3 h-3" />
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {item.description}
              </p>

              {/* Metadata */}
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                {item.readTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.readTime}
                  </div>
                )}
                {item.downloadCount && (
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {item.downloadCount}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                onClick={() => handleContentClick(item.id, item.type)}
              >
                {item.ctaText}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20"
        >
          <h3 className="text-2xl font-bold mb-4">
            Want More Productivity Tips?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our weekly newsletter and get exclusive productivity tips, AI insights, 
            and early access to new features delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button className="px-8">
              Subscribe Free
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Join 25,000+ professionals. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ContentHub;