import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Sparkles, 
  Mic, 
  Zap, 
  ArrowRight, 
  Star,
  BookOpen,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Users,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NoteSummarizer from '@/components/ai-features/NoteSummarizer';
import VoiceToText from '@/components/ai-features/VoiceToText';
import SmartNoteAssistant from '@/components/ai-features/SmartNoteAssistant';

const AIFeatures: React.FC = () => {
  const navigate = useNavigate();
  const [demoContent, setDemoContent] = useState(`
# Meeting Notes - Product Strategy Q1 2024

## Attendees
- Sarah Johnson (Product Manager)
- Mike Chen (Engineering Lead)
- Alex Rivera (Design Lead)
- Emma Thompson (Marketing)

## Key Discussion Points

### New Feature Priorities
We discussed the roadmap for Q1 and identified three major features:
1. Advanced search functionality with AI-powered suggestions
2. Real-time collaboration tools for team projects
3. Mobile app optimization for better user experience

### Budget Allocation
The team agreed on budget distribution:
- Engineering: 60% of resources
- Design: 25% of resources  
- Marketing: 15% of resources

### Timeline Concerns
Mike raised concerns about the aggressive timeline for the mobile optimization project. We need to reassess the scope and potentially push some features to Q2.

## Action Items
- [ ] Sarah to create detailed specs for search functionality by January 15th
- [ ] Alex to provide mobile design mockups by January 20th
- [ ] Mike to estimate engineering effort for each feature by January 18th
- [ ] Emma to prepare marketing strategy presentation for next meeting

## Next Steps
Schedule follow-up meeting for January 25th to review progress and finalize Q1 roadmap.
  `.trim());

  const [demoTitle] = useState('Product Strategy Meeting - Q1 2024');
  const [demoTags] = useState(['meeting', 'product', 'strategy', 'q1-2024']);

  const features = [
    {
      id: 'summarizer',
      title: 'AI Note Summarizer',
      description: 'Generate intelligent summaries of your notes with different styles and depths',
      icon: Sparkles,
      gradient: 'from-blue-500 to-purple-600',
      stats: ['4 Summary Types', 'Instant Generation', 'Smart Analysis'],
      benefits: [
        'Save time with quick overviews',
        'Extract key insights automatically',
        'Multiple summary formats',
        'Perfect for long documents'
      ]
    },
    {
      id: 'voice',
      title: 'Voice to Text',
      description: 'Convert speech to text with advanced AI transcription in multiple languages',
      icon: Mic,
      gradient: 'from-green-500 to-teal-600',
      stats: ['10+ Languages', 'Real-time Processing', 'High Accuracy'],
      benefits: [
        'Hands-free note taking',
        'Multi-language support',
        'Audio file upload',
        'Smart punctuation'
      ]
    },
    {
      id: 'assistant',
      title: 'Smart Note Assistant',
      description: 'Get AI-powered suggestions to enhance content, structure, and organization',
      icon: Brain,
      gradient: 'from-orange-500 to-red-600',
      stats: ['6 Enhancement Types', 'Context Aware', 'Instant Suggestions'],
      benefits: [
        'Improve writing quality',
        'Better organization',
        'Extract action items',
        'Generate smart tags'
      ]
    }
  ];

  const handleCreateNote = () => {
    navigate('/editor/new');
  };

  const handleTextGenerated = (text: string) => {
    setDemoContent(prev => prev + '\n\n' + text);
  };

  const handleSuggestionApplied = (suggestion: string, type: string) => {
    console.log('Applied suggestion:', { suggestion, type });
    // In a real implementation, this would update the note content
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Features</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Transform Your
            <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Note-Taking Experience
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover powerful AI features that help you write better, think clearer, and organize smarter. 
            From voice transcription to intelligent summaries, let AI supercharge your productivity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleCreateNote}>
              <Brain className="h-5 w-5 mr-2" />
              Try AI Features Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}>
              <BookOpen className="h-5 w-5 mr-2" />
              See Live Demo
            </Button>
          </div>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            
            return (
              <Card key={feature.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex justify-center gap-2">
                    {feature.stats.map((stat, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {stat}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Benefits */}
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Live Demo Section */}
        <div id="demo-section" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Try Our AI Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the power of AI-enhanced note-taking with our interactive demo. 
              Use real features with sample content or your own text.
            </p>
          </div>

          <Tabs defaultValue="summarizer" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="summarizer" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Summarizer</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Voice to Text</span>
              </TabsTrigger>
              <TabsTrigger value="assistant" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Smart Assistant</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summarizer">
              <NoteSummarizer 
                content={demoContent}
                onSummaryGenerated={(summary, type) => console.log('Summary generated:', { summary, type })}
              />
            </TabsContent>

            <TabsContent value="voice">
              <VoiceToText 
                onTextGenerated={handleTextGenerated}
                onTextAppended={handleTextGenerated}
              />
            </TabsContent>

            <TabsContent value="assistant">
              <SmartNoteAssistant
                content={demoContent}
                title={demoTitle}
                tags={demoTags}
                onSuggestionApplied={handleSuggestionApplied}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Loved by Professionals</h2>
            <p className="text-muted-foreground">
              See how AI features are transforming productivity across industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                metric: '75%',
                label: 'Faster Note Processing',
                description: 'Users save time with AI summarization',
                icon: TrendingUp
              },
              {
                metric: '90%',
                label: 'Accuracy Rate',
                description: 'Voice transcription precision',
                icon: Star
              },
              {
                metric: '50K+',
                label: 'Active Users',
                description: 'Professionals using AI features daily',
                icon: Users
              }
            ].map((stat, index) => {
              const Icon = stat.icon;
              
              return (
                <Card key={index} className="text-center p-6">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.metric}</div>
                  <div className="font-medium mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="text-center p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Ready to Boost Your Productivity?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start using AI-powered features today and experience the future of note-taking. 
                Create smarter, write better, and organize effortlessly.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleCreateNote}>
                <Lightbulb className="h-5 w-5 mr-2" />
                Start Creating with AI
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/pricing')}>
                <Star className="h-5 w-5 mr-2" />
                View Premium Features
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIFeatures;