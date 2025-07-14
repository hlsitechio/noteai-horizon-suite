import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Users, Lightbulb } from 'lucide-react';
import { usePublicPageTheme } from '@/hooks/usePublicPageTheme';


const About: React.FC = () => {
  // Ensure clean theme for public about page
  usePublicPageTheme();
  
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to revolutionizing how people capture, organize, and interact with their thoughts and ideas."
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Every feature we build starts with understanding our users' needs and creating solutions that truly matter."
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We leverage cutting-edge AI technology to create the most intelligent note-taking experience possible."
    }
  ];

  const stats = [
    { number: "1M+", label: "Active Users" },
    { number: "50M+", label: "Notes Created" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Countries" }
  ];

  return (
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
            <a href="/landing" className="text-gray-300 hover:text-white transition-colors">Back to Home</a>
            <a href="/login" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              About Our Vision
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            We're building the future of intelligent note-taking, where AI seamlessly enhances human creativity and productivity.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card/20 backdrop-blur-xl rounded-2xl p-12 border border-border/10 mb-20"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                OnlineNote AI was born from a simple frustration: traditional note-taking apps weren't smart enough. 
                We found ourselves spending too much time organizing, searching, and formatting our thoughts instead of 
                focusing on what mattered most—the ideas themselves.
              </p>
              <p>
                In 2023, we set out to change that. By combining the latest advances in artificial intelligence with 
                intuitive design principles, we created a note-taking platform that doesn't just store your thoughts—it 
                understands them, enhances them, and helps you discover new connections.
              </p>
              <p>
                Today, OnlineNote AI serves millions of users worldwide, from students and researchers to entrepreneurs 
                and creative professionals. We're proud to be at the forefront of the AI revolution, making intelligent 
                productivity tools accessible to everyone.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            Our Values
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/20 backdrop-blur-xl rounded-2xl p-8 border border-border/10 text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            By the Numbers
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default About;