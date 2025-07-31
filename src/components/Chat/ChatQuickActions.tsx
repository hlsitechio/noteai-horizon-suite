import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Clock, PenTool, BookOpen, Languages, Zap } from 'lucide-react';

const quickActions = [
  {
    text: "Create a meeting notes template in the canva with agenda sections",
    icon: FileText,
    category: "Canva Templates",
    color: "text-blue-500"
  },
  {
    text: "Design a project planning note in the canva with task breakdowns",
    icon: FileText,
    category: "Canva Templates", 
    color: "text-blue-500"
  },
  {
    text: "Create a daily journal template in the canva with reflection prompts",
    icon: FileText,
    category: "Canva Templates",
    color: "text-blue-500"
  },
  {
    text: "Build a study notes template in the canva with summary sections",
    icon: FileText,
    category: "Canva Templates",
    color: "text-blue-500"
  },
  {
    text: "Create a recipe note in the canva with ingredients and steps",
    icon: FileText,
    category: "Canva Templates",
    color: "text-blue-500"
  },
  {
    text: "Design a travel itinerary note in the canva with day-by-day planning",
    icon: FileText,
    category: "Canva Templates",
    color: "text-blue-500"
  },
  {
    text: "Find my notes about project planning",
    icon: Search,
    category: "Search",
    color: "text-green-500"
  },
  {
    text: "Set a reminder for my dentist appointment next week",
    icon: Clock,
    category: "Reminders",
    color: "text-orange-500"
  },
  {
    text: "Improve this text: Writing can be hard sometimes",
    icon: PenTool,
    category: "Writing",
    color: "text-purple-500"
  },
  {
    text: "Summarize this paragraph: [paste your text here]",
    icon: BookOpen,
    category: "Writing",
    color: "text-purple-500"
  },
  {
    text: "Translate this to Spanish: Hello, how are you?",
    icon: Languages,
    category: "Language",
    color: "text-pink-500"
  },
  {
    text: "Check grammar: Their going to the store tomorrow",
    icon: Zap,
    category: "Writing",
    color: "text-purple-500"
  }
];

interface ChatQuickActionsProps {
  onActionSelect: (text: string) => void;
  profile?: { display_name: string } | null;
  profileLoading: boolean;
}

const ChatQuickActions: React.FC<ChatQuickActionsProps> = ({ 
  onActionSelect, 
  profile, 
  profileLoading 
}) => {
  return (
    <div className="text-center py-12">
      <div className="relative mb-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 flex items-center justify-center backdrop-blur-sm border border-primary/20">
          <Search className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse"></div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        {profile && !profileLoading 
          ? `Welcome back, ${profile.display_name}!` 
          : 'Welcome to AI Assistant'
        }
      </h3>
      <p className="text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
        {profile && !profileLoading 
          ? `Hi ${profile.display_name}! I can help you create notes in the canva, set reminders, organize your thoughts, and assist with writing tasks! Ask me to create notes in the canva for real-time editing.`
          : 'I can help you create notes in the canva, set reminders, organize your thoughts, and assist with writing tasks! Ask me to create notes in the canva for real-time editing.'
        }
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {quickActions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card
              key={index}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-muted/30 hover:border-primary/30 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden relative"
              onClick={() => onActionSelect(action.text)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="p-5 relative z-10">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 ${action.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-muted to-muted/50">
                        {action.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed font-medium">
                      {action.text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ChatQuickActions;