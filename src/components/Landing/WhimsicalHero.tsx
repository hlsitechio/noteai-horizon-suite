import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Shield, Users } from 'lucide-react';
const WhimsicalHero = () => {
  return <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Main Hero Content */}
        <div className="text-center space-y-8 mb-16">
          {/* Hero Image */}
          <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 1
        }} className="mb-8">
            
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.3
        }} className="space-y-6">
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">
              It's Not Just a Workspace.{' '}
              <span className="gradient-text">It's a Vibe OS with AI Brains.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Because you deserve tools as smart as your ideas.
            </p>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }}>
            <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground group">
              Get started free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.4
      }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[{
          icon: Sparkles,
          title: "AI Notes",
          description: "Intelligent note-taking with AI assistance and smart organization.",
          color: "from-purple-500 to-pink-500"
        }, {
          icon: Users,
          title: "Collaboration",
          description: "Real-time collaboration with your team in one unified workspace.",
          color: "from-blue-500 to-cyan-500"
        }, {
          icon: Zap,
          title: "Automation",
          description: "Automate repetitive tasks and focus on what matters most.",
          color: "from-orange-500 to-red-500"
        }, {
          icon: Shield,
          title: "Security",
          description: "Enterprise-grade security to keep your data safe and private.",
          color: "from-green-500 to-emerald-500"
        }].map((feature, index) => <motion.div key={feature.title} initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.6 + index * 0.1
        }} className="glass-card p-6 group cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>)}
        </motion.div>

        {/* Interactive Demo Preview */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.95
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 1,
        delay: 0.8
      }} className="relative max-w-6xl mx-auto">
          <div className="glass-card p-8 feature-showcase">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 border border-slate-600">
              {/* Mock Interface Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">OnlineNote.ai</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                </div>
              </div>

              {/* Mock Interface Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-purple-500/30 to-transparent rounded"></div>
                  <div className="h-3 bg-gradient-to-r from-blue-500/20 to-transparent rounded w-3/4"></div>
                  <div className="h-3 bg-gradient-to-r from-green-500/20 to-transparent rounded w-1/2"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-pink-500/30 to-transparent rounded"></div>
                  <div className="h-3 bg-gradient-to-r from-cyan-500/20 to-transparent rounded w-2/3"></div>
                  <div className="h-3 bg-gradient-to-r from-orange-500/20 to-transparent rounded w-3/4"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gradient-to-r from-emerald-500/30 to-transparent rounded"></div>
                  <div className="h-3 bg-gradient-to-r from-purple-500/20 to-transparent rounded w-1/2"></div>
                  <div className="h-3 bg-gradient-to-r from-blue-500/20 to-transparent rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default WhimsicalHero;