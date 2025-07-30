import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Lock, Zap, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import DynamicSEOOptimizer from '@/components/SEO/DynamicSEOOptimizer';
import { usePublicPageTheme } from '@/hooks/usePublicPageTheme';


const Features: React.FC = () => {
  // Ensure clean theme for public features page
  usePublicPageTheme();
  
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Writing",
      description: "Get intelligent suggestions, grammar corrections, and content enhancements powered by advanced AI models."
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Your notes are protected with military-grade encryption. Only you can access your private thoughts."
    },
    {
      icon: Zap,
      title: "Real-Time Sync",
      description: "Access your notes instantly across all devices with lightning-fast synchronization."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together seamlessly with real-time collaboration tools and shared workspaces."
    },
    {
      icon: Sparkles,
      title: "Smart Organization",
      description: "AI automatically categorizes and tags your notes, making them easy to find and organize."
    }
  ];

  return (
    <>
      <DynamicSEOOptimizer 
        pagePath="/features"
        fallbackTitle="Advanced Note Taking App Features - OnlineNote AI"
        fallbackDescription="Discover powerful features of our AI-powered note taking app. Smart organization, real-time sync, and intelligent suggestions for maximum productivity."
        fallbackKeywords={['note taking app', 'productivity features', 'smart notes', 'ai features', 'real-time sync', 'ai writing']}
      />
      <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              OnlineNote AI
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/landing" className="text-gray-300 hover:text-white transition-colors">Back to Home</Link>
            <Link to="/login" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            Discover the cutting-edge capabilities that make OnlineNote AI the most advanced note-taking platform available.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/20 backdrop-blur-xl rounded-2xl p-8 border border-border/10 hover:border-primary/20 transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
      </div>
    </>
  );
};

export default Features;