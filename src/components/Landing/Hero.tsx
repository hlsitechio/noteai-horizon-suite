import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const features = [
    "Smart Note-Taking",
    "AI-Powered Insights", 
    "Team Collaboration",
    "Seamless Sync"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-brand-blue-50/50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-blue-100/30 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-brand-blue-50 text-brand-blue-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                <Zap className="w-4 h-4" />
                Trusted by 50,000+ professionals
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl lg:text-6xl font-bold text-neutral-900 leading-tight"
                >
                  The Professional
                  <span className="text-brand-blue-600"> Workspace </span>
                  You've Been Looking For
                </motion.h1>

                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-brand-blue-600 font-semibold"
                >
                  {features[currentIndex]}
                </motion.div>
              </div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-neutral-600 leading-relaxed max-w-xl"
              >
                Streamline your workflow with our comprehensive platform designed for modern professionals. 
                Organize notes, manage tasks, and collaborate seamlessly with your team.
              </motion.p>

              {/* Feature List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                {[
                  "Advanced note organization and search",
                  "Real-time collaboration tools",
                  "Secure cloud synchronization"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-blue-600 flex-shrink-0" />
                    <span className="text-neutral-700">{feature}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button 
                  size="lg" 
                  className="professional-button group px-8 py-4 text-lg font-semibold"
                  onClick={() => navigate('/auth')}
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-4 text-lg font-semibold border-2 border-neutral-200 hover:border-brand-blue-300 hover:bg-brand-blue-50"
                >
                  Schedule Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="professional-card p-8 bg-white">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-blue-600 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">Team Dashboard</h3>
                        <p className="text-sm text-neutral-500">Today's Overview</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-neutral-900">94%</div>
                      <div className="text-sm text-green-600">+12% from last week</div>
                    </div>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-4">
                    {[
                      { label: "Project Alpha", progress: 85, color: "bg-brand-blue-600" },
                      { label: "Client Review", progress: 70, color: "bg-green-500" },
                      { label: "Documentation", progress: 45, color: "bg-yellow-500" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-700">{item.label}</span>
                          <span className="text-neutral-500">{item.progress}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ delay: 1.4 + index * 0.2, duration: 0.8 }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-neutral-900">24</div>
                      <div className="text-xs text-neutral-500">Active Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-neutral-900">8</div>
                      <div className="text-xs text-neutral-500">Team Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-neutral-900">98%</div>
                      <div className="text-xs text-neutral-500">Completion</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;