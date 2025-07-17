
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
      title: "Smart Note Management",
      description: "Organize, search, and access your notes instantly with AI-powered categorization and tagging.",
      benefits: ["Rich text editing", "Advanced search", "Auto-categorization", "Cross-platform sync"]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time editing, comments, and shared workspaces.",
      benefits: ["Real-time editing", "Team comments", "Shared folders", "Access controls"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and security protocols to keep your data safe and compliant.",
      benefits: ["End-to-end encryption", "SSO integration", "Audit logs", "GDPR compliant"]
    },
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Get intelligent suggestions and summaries to boost your productivity and decision-making.",
      benefits: ["Smart summaries", "Content suggestions", "Pattern recognition", "Automated workflows"]
    },
    {
      icon: Search,
      title: "Universal Search",
      description: "Find anything across all your content with lightning-fast search and smart filters.",
      benefits: ["Instant search", "Content preview", "Smart filters", "Recent history"]
    },
    {
      icon: Calendar,
      title: "Task & Calendar Integration",
      description: "Seamlessly manage your schedule and tasks with integrated calendar and reminder features.",
      benefits: ["Calendar sync", "Smart reminders", "Task automation", "Deadline tracking"]
    }
  ];

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
            Everything You Need to
            <span className="text-brand-blue-600"> Succeed</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Powerful features designed for modern professionals who demand efficiency, security, and collaboration.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="professional-card p-8 group hover:shadow-xl transition-all duration-300"
            >
              <div className="space-y-6">
                {/* Icon */}
                <div className="w-14 h-14 bg-brand-blue-100 rounded-lg flex items-center justify-center group-hover:bg-brand-blue-600 transition-colors duration-300">
                  <feature.icon className="w-7 h-7 text-brand-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-brand-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-neutral-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-white rounded-2xl p-12 professional-card"
        >
          <h3 className="text-3xl font-bold text-neutral-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their workflow with our platform. 
            Start your free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="professional-button group px-8 py-4 text-lg font-semibold"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg font-semibold border-2 border-neutral-200 hover:border-brand-blue-300 hover:bg-brand-blue-50"
            >
              See All Features
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
