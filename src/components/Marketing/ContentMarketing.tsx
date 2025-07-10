import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { safeSendAnalyticsEvent } from '@/utils/safeAnalytics';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishDate: string;
  slug: string;
  featured?: boolean;
}

interface ContentMarketingProps {
  variant?: 'blog' | 'resources' | 'guides';
  className?: string;
}

const ContentMarketing: React.FC<ContentMarketingProps> = ({ 
  variant = 'blog',
  className = '' 
}) => {
  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: '10 AI Note-Taking Strategies That Will Transform Your Productivity',
      excerpt: 'Discover how AI can revolutionize the way you capture, organize, and retrieve information to boost your productivity by 300%.',
      category: 'Productivity',
      readTime: '8 min read',
      publishDate: '2024-01-15',
      slug: 'ai-note-taking-strategies',
      featured: true
    },
    {
      id: '2',
      title: 'The Science Behind Smart Note Organization',
      excerpt: 'Learn how cognitive science principles can help you structure your notes for maximum retention and recall.',
      category: 'Research',
      readTime: '6 min read',
      publishDate: '2024-01-12',
      slug: 'smart-note-organization-science'
    },
    {
      id: '3',
      title: 'Remote Team Collaboration: Best Practices for Shared Notes',
      excerpt: 'Essential strategies for teams to collaborate effectively using AI-powered note-taking tools.',
      category: 'Collaboration',
      readTime: '5 min read',
      publishDate: '2024-01-10',
      slug: 'remote-team-collaboration-notes'
    }
  ];

  const resources = [
    {
      icon: BookOpen,
      title: 'Complete User Guide',
      description: 'Master every feature of Online Note AI with our comprehensive guide',
      link: '/docs',
      type: 'Documentation'
    },
    {
      icon: TrendingUp,
      title: 'Productivity Templates',
      description: 'Ready-to-use templates for meetings, projects, and daily planning',
      link: '/templates',
      type: 'Templates'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users, share tips, and get expert advice',
      link: '/community',
      type: 'Community'
    },
    {
      icon: Lightbulb,
      title: 'Success Stories',
      description: 'Real stories from professionals who transformed their workflow',
      link: '/success-stories',
      type: 'Case Studies'
    }
  ];

  const guides = [
    {
      title: 'Getting Started with AI Notes',
      steps: 5,
      duration: '10 minutes',
      difficulty: 'Beginner',
      link: '/guide/getting-started'
    },
    {
      title: 'Advanced AI Features',
      steps: 8,
      duration: '20 minutes',
      difficulty: 'Intermediate',
      link: '/guide/advanced-features'
    },
    {
      title: 'Team Collaboration Setup',
      steps: 6,
      duration: '15 minutes',
      difficulty: 'Intermediate',
      link: '/guide/team-collaboration'
    }
  ];

  const handleContentClick = (contentType: string, contentId: string) => {
    safeSendAnalyticsEvent('content_marketing_click', {
      content_type: contentType,
      content_id: contentId,
      variant
    });
  };

  if (variant === 'blog') {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Latest Insights & Tips
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Expert advice and strategies to maximize your productivity with AI-powered note-taking
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={post.featured ? 'lg:col-span-2' : ''}
              >
                <Card className={`p-6 h-full hover:shadow-lg transition-shadow duration-300 ${post.featured ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className={`font-bold mb-3 ${post.featured ? 'text-2xl' : 'text-xl'}`}>
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.publishDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleContentClick('blog', post.id)}
                        className="text-primary hover:text-primary/80"
                      >
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/blog">
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleContentClick('blog', 'view_all')}
              >
                View All Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  if (variant === 'resources') {
    return (
      <section className={`py-16 bg-muted/30 ${className}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Resources & Support
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to get the most out of Online Note AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      
                      <span className="text-xs font-medium text-accent uppercase tracking-wider mb-2 block">
                        {resource.type}
                      </span>
                      
                      <h3 className="text-lg font-bold mb-3">
                        {resource.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4 text-sm">
                        {resource.description}
                      </p>
                      
                      <Link to={resource.link}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleContentClick('resource', resource.title)}
                          className="text-primary hover:text-primary/80"
                        >
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'guides') {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Step-by-Step Guides
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow our detailed guides to master Online Note AI
            </p>
          </motion.div>

          <div className="space-y-6">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full mr-3 ${
                          guide.difficulty === 'Beginner' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                          {guide.difficulty}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {guide.steps} steps • {guide.duration}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2">
                        {guide.title}
                      </h3>
                    </div>
                    
                    <Link to={guide.link}>
                      <Button
                        onClick={() => handleContentClick('guide', guide.title)}
                        className="ml-6"
                      >
                        Start Guide
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default ContentMarketing;