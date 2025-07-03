import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Search, Plus, TrendingUp, Users, FileText, Calendar, BarChart3, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DashboardDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardDemo = ({ isOpen, onClose }: DashboardDemoProps) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [stats, setStats] = useState({
    notes: 42,
    projects: 8,
    collaborators: 15,
    productivity: 78
  });

  // Demo animation sequence
  useEffect(() => {
    if (!isOpen) {
      setAnimationStep(0);
      return;
    }

    const sequence = setTimeout(() => {
      if (animationStep < 4) {
        setAnimationStep(animationStep + 1);
        
        // Simulate real-time updates
        setStats(prev => ({
          notes: prev.notes + Math.floor(Math.random() * 3),
          projects: prev.projects + (Math.random() > 0.8 ? 1 : 0),
          collaborators: prev.collaborators + (Math.random() > 0.9 ? 1 : 0),
          productivity: Math.min(100, prev.productivity + Math.floor(Math.random() * 5))
        }));
      }
    }, 1500);

    return () => clearTimeout(sequence);
  }, [isOpen, animationStep]);

  const recentNotes = [
    { title: "AI Strategy Meeting Notes", time: "2 min ago", progress: 85 },
    { title: "Project Roadmap Q4", time: "15 min ago", progress: 60 },
    { title: "Market Research Findings", time: "1 hour ago", progress: 100 },
    { title: "Team Retrospective", time: "3 hours ago", progress: 45 }
  ];

  const quickActions = [
    { icon: Plus, label: "New Note", color: "from-blue-500 to-cyan-500" },
    { icon: Calendar, label: "Schedule", color: "from-purple-500 to-pink-500" },
    { icon: Users, label: "Collaborate", color: "from-green-500 to-teal-500" },
    { icon: BarChart3, label: "Analytics", color: "from-orange-500 to-red-500" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-6 right-6 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Demo Badge */}
            <div className="absolute top-6 left-6 z-10">
              <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-0 px-4 py-2">
                ✨ Interactive Demo
              </Badge>
            </div>

            <div className="p-8 pt-20">
              {/* Dashboard Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: animationStep >= 0 ? 1 : 0, y: animationStep >= 0 ? 0 : -20 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-8"
              >
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Alex!</h1>
                  <p className="text-white/60">Here's what's happening with your projects today.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Search notes..."
                    />
                  </div>
                  <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                    <Bell className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animationStep >= 1 ? 1 : 0, y: animationStep >= 1 ? 0 : 20 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-4 gap-6 mb-8"
              >
                {[
                  { icon: FileText, label: "Total Notes", value: stats.notes, color: "text-blue-400" },
                  { icon: Users, label: "Projects", value: stats.projects, color: "text-green-400" },
                  { icon: TrendingUp, label: "Collaborators", value: stats.collaborators, color: "text-purple-400" },
                  { icon: Activity, label: "Productivity", value: `${stats.productivity}%`, color: "text-orange-400" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/60 text-sm">{stat.label}</p>
                            <motion.p
                              key={stat.value}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="text-2xl font-bold text-white"
                            >
                              {stat.value}
                            </motion.p>
                          </div>
                          <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Notes */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: animationStep >= 2 ? 1 : 0, x: animationStep >= 2 ? 0 : -20 }}
                  transition={{ delay: 0.8 }}
                  className="lg:col-span-2"
                >
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 h-full">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        Recent Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentNotes.map((note, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
                          >
                            <div className="flex-1">
                              <h4 className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                                {note.title}
                              </h4>
                              <p className="text-white/60 text-sm">{note.time}</p>
                              <div className="mt-2">
                                <div className="flex items-center gap-2">
                                  <Progress value={note.progress} className="flex-1 h-2" />
                                  <span className="text-white/60 text-xs">{note.progress}%</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions & Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: animationStep >= 3 ? 1 : 0, x: animationStep >= 3 ? 0 : 20 }}
                  transition={{ delay: 1.2 }}
                  className="space-y-6"
                >
                  {/* Quick Actions */}
                  <Card className="bg-white/5 backdrop-blur-md border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                          <motion.button
                            key={action.label}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.4 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium transition-all hover:shadow-lg flex flex-col items-center gap-2`}
                          >
                            <action.icon className="w-6 h-6" />
                            <span className="text-sm">{action.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Feed */}
                  <Card className="bg-white/5 backdrop-blur-md border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 4 ? 1 : 0 }}
                        transition={{ delay: 1.8 }}
                        className="space-y-3"
                      >
                        {[
                          { action: "Created", item: "AI Strategy Notes", time: "5 min ago" },
                          { action: "Updated", item: "Project Roadmap", time: "1 hour ago" },
                          { action: "Shared", item: "Research Report", time: "2 hours ago" }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-white/80 text-sm">
                                <span className="text-cyan-400">{activity.action}</span> {activity.item}
                              </p>
                              <p className="text-white/50 text-xs">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardDemo;