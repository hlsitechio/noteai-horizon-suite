import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, FileText, PenTool, Lightbulb, Timer, RotateCcw } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

const demoScenarios = [
  {
    id: 'blog-post',
    title: 'Blog Post Draft',
    icon: FileText,
    content: `# How AI is Revolutionizing Content Creation

In today's digital landscape, **artificial intelligence** is transforming the way we create and consume content. From automated writing assistants to sophisticated editing tools, AI is becoming an indispensable part of the content creator's toolkit.

## Key Benefits:
- Enhanced productivity and efficiency
- Improved content quality through smart suggestions
- Real-time collaboration and feedback
- Automated formatting and style consistency

*Try selecting this text and use the AI assistant to improve, translate, or summarize it!*`,
    instructions: 'Try selecting text and using AI features like improve, translate, or summarize!'
  },
  {
    id: 'meeting-notes',
    title: 'Meeting Notes',
    icon: PenTool,
    content: `## Product Strategy Meeting - January 2024

**Attendees:** Sarah, Mike, Jennifer, Alex

### Key Discussion Points:
1. Q1 feature roadmap review
2. User feedback analysis 
3. Competitive landscape assessment

**Action Items:**
- [ ] Research competitor pricing models
- [ ] Draft user survey questions
- [ ] Schedule follow-up with design team

**Next Meeting:** February 15th, 2:00 PM`,
    instructions: 'Use formatting tools to structure your notes better - try bold, italics, and lists!'
  },
  {
    id: 'creative-writing',
    title: 'Creative Story',
    icon: Lightbulb,
    content: `The old lighthouse stood sentinel against the stormy night, its beacon cutting through the darkness like a sword of light. Elena gripped the railing as she climbed the spiral staircase, each step echoing through the hollow tower.

She had received the mysterious letter that morning: "Meet me where the light guides lost souls home." Now, as thunder rolled across the churning sea, she wondered if she had made a terrible mistake.

*Continue this story or let AI help you develop the plot further...*`,
    instructions: 'Let your creativity flow! Use AI to continue the story or help with plot development.'
  }
];

const EditorControlsTest: React.FC = () => {
  const [content, setContent] = useState('');
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const loadDemo = (demo: typeof demoScenarios[0]) => {
    setIsAnimating(true);
    setCurrentDemo(demo.id);
    
    // Simulate typing animation
    setTimeout(() => {
      setContent(demo.content);
      setIsAnimating(false);
    }, 300);
  };

  const resetEditor = () => {
    setContent('');
    setCurrentDemo(null);
  };

  const getCurrentDemo = () => demoScenarios.find(d => d.id === currentDemo);

  return (
    <div className="h-full space-y-6">
      {/* Demo Selection */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Live Editor Demos
            </CardTitle>
            {currentDemo && (
              <Button variant="outline" size="sm" onClick={resetEditor}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {demoScenarios.map((demo) => {
              const Icon = demo.icon;
              const isActive = currentDemo === demo.id;
              
              return (
                <Button
                  key={demo.id}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => loadDemo(demo)}
                  disabled={isAnimating}
                  className="h-auto p-4 flex-col items-start text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{demo.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {demo.instructions}
                  </p>
                </Button>
              );
            })}
          </div>
          
          {getCurrentDemo() && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm">
                <strong>Tip:</strong> {getCurrentDemo()?.instructions}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {currentDemo ? getCurrentDemo()?.title : 'Live Editor Test'}
            </CardTitle>
            {currentDemo && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                Demo Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)]">
          <div className={`h-full transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={currentDemo 
                ? "Demo content loaded! Try the AI features and formatting tools..." 
                : "Choose a demo above or start writing your own content. Try keyboard shortcuts, formatting buttons, and AI tools!"
              }
              canSave={true}
              isSaving={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorControlsTest;