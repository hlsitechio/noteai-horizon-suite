import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Layout, FolderOpen, MessageSquare, ArrowRight, Check, X, Zap, Shield, Users, Sparkles } from 'lucide-react';
const WhimsicalFeatures = () => {
  const [activeTab, setActiveTab] = useState(0);
  const features = [{
    id: 0,
    icon: FileText,
    title: "Smart Notes",
    description: "AI-powered note-taking with intelligent organization and instant search.",
    details: ["AI-powered content suggestions", "Smart categorization and tagging", "Real-time collaboration", "Advanced search and filtering"],
    mockupColor: "from-purple-500 to-pink-500"
  }, {
    id: 1,
    icon: Layout,
    title: "Workspaces",
    description: "Organize your projects with customizable workspaces and layouts.",
    details: ["Customizable dashboard layouts", "Multiple workspace templates", "Drag-and-drop organization", "Personal and team spaces"],
    mockupColor: "from-blue-500 to-cyan-500"
  }, {
    id: 2,
    icon: FolderOpen,
    title: "File Management",
    description: "Seamless file organization with cloud storage and version control.",
    details: ["Cloud storage integration", "Version history tracking", "File sharing and permissions", "Automatic backup and sync"],
    mockupColor: "from-green-500 to-emerald-500"
  }, {
    id: 3,
    icon: MessageSquare,
    title: "Team Communication",
    description: "Built-in communication tools to keep your team connected.",
    details: ["Real-time messaging", "Comment and feedback system", "Team announcements", "Integration with popular tools"],
    mockupColor: "from-orange-500 to-red-500"
  }];
  const problemSolutions = [{
    problem: "Time wasted switching between apps",
    solution: "One place for ideas, notes, and projects"
  }, {
    problem: "Scattered conversations and decisions",
    solution: "Centralized communication and collaboration"
  }, {
    problem: "Can't find important info or files",
    solution: "AI-powered search and organization"
  }, {
    problem: "Too many notifications everywhere",
    solution: "Focused notifications in one place"
  }, {
    problem: "Work feels chaotic and unfocused",
    solution: "Clean, organized workspace design"
  }, {
    problem: "Paying for multiple tools",
    solution: "All-in-one solution saves money"
  }];
  return <div className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Trust Section */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} viewport={{
        once: true
      }} className="text-center mb-20">
          
          
        </motion.div>

        {/* Problem vs Solution Section */}
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} viewport={{
        once: true
      }} className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Escape the <span className="gradient-text">clutter</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* The Old Way */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center mb-8 text-red-400">
                The old way of working
              </h3>
              {problemSolutions.map((item, index) => <motion.div key={index} initial={{
              opacity: 0,
              x: -30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} viewport={{
              once: true
            }} className="flex items-center space-x-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <span className="text-muted-foreground">{item.problem}</span>
                </motion.div>)}
            </div>

            {/* The Whimsical Way */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-center mb-8 gradient-text">
                The Whimsical Way
              </h3>
              {problemSolutions.map((item, index) => <motion.div key={index} initial={{
              opacity: 0,
              x: 30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.6,
              delay: index * 0.1
            }} viewport={{
              once: true
            }} className="flex items-center space-x-3 p-4 rounded-lg glass-card">
                  <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                  <span className="text-foreground">{item.solution}</span>
                </motion.div>)}
            </div>
          </div>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} viewport={{
        once: true
      }} className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Why use multiple apps when{' '}
              <span className="gradient-text">OnlineNote.ai</span>{' '}
              does it better?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From brainstorm to launch—create, plan, and communicate in one interconnected workspace.
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {features.map((feature, index) => <Button key={feature.id} variant={activeTab === index ? "default" : "outline"} onClick={() => setActiveTab(index)} className="h-12 px-6">
                <feature.icon className="mr-2 h-4 w-4" />
                {feature.title}
              </Button>)}
          </div>

          {/* Feature Content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -30
          }} transition={{
            duration: 0.5
          }} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Feature Description */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-bold mb-4 gradient-text">
                    {features[activeTab].title}
                  </h3>
                  <p className="text-xl text-muted-foreground mb-6">
                    {features[activeTab].description}
                  </p>
                </div>
                
                <ul className="space-y-4">
                  {features[activeTab].details.map((detail, index) => <motion.li key={index} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.4,
                  delay: index * 0.1
                }} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${features[activeTab].mockupColor}`}></div>
                      <span className="text-foreground">{detail}</span>
                    </motion.li>)}
                </ul>

                <Button size="lg" className="group">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Feature Mockup */}
              <div className="glass-card p-8 feature-showcase">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded bg-gradient-to-r ${features[activeTab].mockupColor}`}></div>
                      <span className="text-sm text-slate-300">{features[activeTab].title}</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded bg-gradient-to-r ${features[activeTab].mockupColor} opacity-80`}></div>
                        <div className="flex-1 space-y-2">
                          <div className={`h-3 bg-gradient-to-r ${features[activeTab].mockupColor} opacity-40 rounded w-full`}></div>
                          <div className={`h-2 bg-gradient-to-r ${features[activeTab].mockupColor} opacity-20 rounded w-2/3`}></div>
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} viewport={{
        once: true
      }} className="text-center max-w-4xl mx-auto">
          <div className="glass-card p-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to transform your workflow?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join millions of users who have already made the switch to a better way of working.
            </p>
            <Button size="lg" className="h-14 px-8 text-lg group">
              <Sparkles className="mr-2 h-5 w-5" />
              Start your free trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>;
};
export default WhimsicalFeatures;