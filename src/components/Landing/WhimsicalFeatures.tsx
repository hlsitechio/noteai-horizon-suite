import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FileText, Layout, FolderOpen, MessageSquare, ArrowRight, Check } from 'lucide-react';
const WhimsicalFeatures = () => {
  const [activeTab, setActiveTab] = useState(0);
  const features = [{
    id: 0,
    icon: FolderOpen,
    title: "Explorer",
    description: "Navigate through your files and folders with an intuitive tree structure.",
    details: ["Hierarchical folder structure", "Quick file search and filtering", "Drag-and-drop organization", "Bookmarks and favorites"],
    mockupColor: "from-blue-500 to-cyan-500",
    mockupType: "explorer"
  }, {
    id: 1,
    icon: FileText,
    title: "Editor",
    description: "Rich text editor with real-time collaboration and smart formatting.",
    details: ["Real-time collaborative editing", "Smart formatting assistance", "Version history and backups", "Export to multiple formats"],
    mockupColor: "from-purple-500 to-pink-500",
    mockupType: "editor"
  }, {
    id: 2,
    icon: MessageSquare,
    title: "AI Chat",
    description: "Intelligent AI assistant integrated directly into your workspace.",
    details: ["Natural language processing", "Context-aware responses", "Document analysis and insights", "Smart suggestions and automation"],
    mockupColor: "from-green-500 to-emerald-500",
    mockupType: "chat"
  }, {
    id: 3,
    icon: Layout,
    title: "Dashboard",
    description: "Customizable workspace overview with widgets and analytics.",
    details: ["Drag-and-drop widgets", "Performance analytics", "Quick action shortcuts", "Personalized layouts"],
    mockupColor: "from-orange-500 to-red-500",
    mockupType: "dashboard"
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
          {/* Navigation Buttons */}
          <div className="relative flex flex-wrap gap-3 mb-12 justify-center bg-muted/30 p-2 rounded-2xl max-w-fit mx-auto">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveTab(index)}
                className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 z-10 ${
                  activeTab === index
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <feature.icon className="mr-2 h-4 w-4 inline" />
                {feature.title}
                
                {/* Active indicator with slide animation */}
                {activeTab === index && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${features[activeTab].mockupColor} rounded-xl shadow-lg`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
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
              <motion.div 
                key={`preview-${activeTab}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 border border-slate-700 min-h-[300px]">
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
                  
                  {/* Content based on feature type */}
                  {features[activeTab].mockupType === 'explorer' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-slate-300 text-sm">
                        <div className="w-4 h-4 bg-blue-500 rounded" />
                        <span>📁 Projects</span>
                      </div>
                      <div className="pl-6 space-y-1">
                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                          <span>📄 README.md</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400 text-sm">
                          <span>📁 src</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          <div className="text-slate-500 text-sm">📄 index.js</div>
                          <div className="text-slate-500 text-sm">📄 App.js</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {features[activeTab].mockupType === 'editor' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-slate-300 text-sm mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>document.md • Auto-saved</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded w-3/4 opacity-60" />
                        <div className="h-2 bg-slate-600 rounded w-full" />
                        <div className="h-2 bg-slate-600 rounded w-5/6" />
                        <div className="h-2 bg-slate-600 rounded w-2/3" />
                        <div className="mt-4 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded w-1/2 opacity-60" />
                        <div className="h-2 bg-slate-600 rounded w-4/5" />
                      </div>
                    </div>
                  )}

                  {features[activeTab].mockupType === 'chat' && (
                    <div className="space-y-3">
                      <div className="flex justify-end">
                        <div className="bg-blue-600 text-white p-2 rounded-lg max-w-xs text-sm">
                          Help me analyze this document
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-slate-700 text-slate-200 p-2 rounded-lg max-w-xs text-sm">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-xs text-slate-400">AI Assistant</span>
                          </div>
                          I've analyzed your document. Here are the key insights...
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400 text-sm">
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  )}

                  {features[activeTab].mockupType === 'dashboard' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800 p-3 rounded border border-slate-600">
                        <div className="text-xs text-slate-400 mb-2">Quick Stats</div>
                        <div className="h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded opacity-60" />
                      </div>
                      <div className="bg-slate-800 p-3 rounded border border-slate-600">
                        <div className="text-xs text-slate-400 mb-2">Recent Files</div>
                        <div className="space-y-1">
                          <div className="h-2 bg-slate-600 rounded w-full" />
                          <div className="h-2 bg-slate-600 rounded w-3/4" />
                          <div className="h-2 bg-slate-600 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>;
};
export default WhimsicalFeatures;