
import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Shield, 
  Zap, 
  Search, 
  Calendar,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Features: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "AI Notes",
      description: "Intelligent note-taking with AI assistance and smart organization.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      icon: Users,
      title: "Collaboration", 
      description: "Real-time collaboration with your team in one unified workspace.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automate repetitive tasks and focus on what matters most.",
      color: "from-orange-500 to-red-500", 
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    },
    {
      icon: Shield,
      title: "Security",
      description: "Enterprise-grade security to keep your data safe and private.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card border border-border rounded-xl p-6 h-full hover:shadow-lg transition-all duration-300">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <div className={`w-6 h-6 rounded bg-gradient-to-r ${feature.color}`} />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
