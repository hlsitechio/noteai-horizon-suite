import React from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  FileText, 
  Calculator, 
  Code, 
  PenTool, 
  Globe,
  BookOpen,
  Zap
} from 'lucide-react';

interface PremiumQuickActionsProps {
  onQuickActionSelect: (text: string) => void;
  profile?: { display_name: string } | null;
  profileLoading: boolean;
}

const quickActions = [
  {
    icon: Lightbulb,
    label: "Brainstorm Ideas",
    prompt: "Help me brainstorm creative ideas for",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    icon: FileText,
    label: "Write Content", 
    prompt: "Help me write professional content about",
    gradient: "from-blue-400 to-purple-500"
  },
  {
    icon: Calculator,
    label: "Solve Problems",
    prompt: "Help me solve this problem step by step:",
    gradient: "from-green-400 to-blue-500"
  },
  {
    icon: Code,
    label: "Code Assistant",
    prompt: "Help me write code for",
    gradient: "from-purple-400 to-pink-500"
  },
  {
    icon: PenTool,
    label: "Edit & Improve",
    prompt: "Please review and improve this text:",
    gradient: "from-pink-400 to-red-500"
  },
  {
    icon: Globe,
    label: "Research Topic",
    prompt: "Provide detailed information about",
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    icon: BookOpen,
    label: "Learn Something",
    prompt: "Teach me about",
    gradient: "from-indigo-400 to-purple-500"
  },
  {
    icon: Zap,
    label: "Quick Question",
    prompt: "I have a quick question:",
    gradient: "from-emerald-400 to-cyan-500"
  }
];

export const PremiumQuickActions: React.FC<PremiumQuickActionsProps> = ({
  onQuickActionSelect,
  profile,
  profileLoading
}) => {
  const userName = profile?.display_name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      {profile && !profileLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-lg text-muted-foreground">
            Hello <span className="text-primary font-medium">{userName}</span>! 👋
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            What would you like to explore today?
          </p>
        </motion.div>
      )}

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { 
                delay: index * 0.1,
                duration: 0.5,
                ease: "easeOut"
              }
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickActionSelect(action.prompt)}
            className="group relative p-4 rounded-2xl border border-border/20 bg-gradient-glass backdrop-blur-sm hover:border-primary/30 transition-all duration-300 shadow-soft-premium hover:shadow-elegant"
          >
            {/* Gradient Background on Hover */}
            <div className={`
              absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300
              bg-gradient-to-br ${action.gradient}
            `} />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                bg-gradient-to-br ${action.gradient}
                text-white shadow-glow
                group-hover:shadow-lg group-hover:scale-110 transition-all duration-300
              `}>
                <action.icon className="h-6 w-6" />
              </div>
              
              <div>
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {action.label}
                </h4>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Additional Quick Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-2 justify-center mt-8"
      >
        {[
          "Explain quantum physics simply",
          "Write a creative story",
          "Plan a healthy meal",
          "Debug my code"
        ].map((prompt, index) => (
          <motion.button
            key={prompt}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              transition: { delay: 0.9 + index * 0.1 }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuickActionSelect(prompt)}
            className="
              px-4 py-2 text-sm rounded-full
              bg-gradient-glass backdrop-blur-sm
              border border-border/20
              text-muted-foreground hover:text-foreground
              hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10
              transition-all duration-300
              shadow-soft-premium hover:shadow-glow
            "
          >
            {prompt}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};