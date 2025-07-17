import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Layout, FolderOpen, MessageSquare, ArrowRight, Check } from 'lucide-react';
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
  return <div className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Smart Notes Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }}
          className="mb-20"
        >
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {features.map((feature, index) => (
              <Button 
                key={feature.id} 
                variant={activeTab === index ? "default" : "ghost"} 
                onClick={() => setActiveTab(index)} 
                className={`px-6 py-2 rounded-full border ${
                  activeTab === index 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                <feature.icon className="mr-2 h-4 w-4" />
                {feature.title}
              </Button>
            ))}
          </div>

          {/* Feature Content */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -30 }} 
              transition={{ duration: 0.5 }} 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto"
            >
              {/* Feature Description */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-foreground bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {features[activeTab].title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    {features[activeTab].description}
                  </p>
                </div>
                
                <ul className="space-y-3">
                  {features[activeTab].details.map((detail, index) => (
                    <motion.li 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${features[activeTab].mockupColor} mt-2`} />
                      <span className="text-foreground">{detail}</span>
                    </motion.li>
                  ))}
                </ul>

                <Button className="group mt-6">
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Feature Preview */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 border border-slate-700">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">{features[activeTab].title}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded bg-gradient-to-r ${features[activeTab].mockupColor} opacity-80`} />
                        <div className="flex-1 space-y-1">
                          <div className={`h-2 bg-gradient-to-r ${features[activeTab].mockupColor} opacity-40 rounded w-full`} />
                          <div className={`h-2 bg-gradient-to-r ${features[activeTab].mockupColor} opacity-20 rounded w-3/4`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>;
};
export default WhimsicalFeatures;