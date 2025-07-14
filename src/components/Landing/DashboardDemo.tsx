import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, Bell, Search, Plus, TrendingUp, Users, FileText, Calendar, BarChart3, Activity, Zap, Target, Clock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface DashboardDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const DashboardDemo = ({ isOpen, onClose }: DashboardDemoProps) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [particles, setParticles] = useState<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statsControls = useAnimation();
  
  const [stats, setStats] = useState({
    notes: 42,
    projects: 8,
    collaborators: 15,
    productivity: 78
  });

  const [dynamicProgress, setDynamicProgress] = useState([85, 60, 100, 45]);
  const [activityPulse, setActivityPulse] = useState(0);

  // Particle system for background effects
  useEffect(() => {
    if (!isOpen) return;

    const createParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
      setParticles(newParticles);
    };

    createParticles();
  }, [isOpen]);

  // Animate particles
  useEffect(() => {
    if (!isOpen || particles.length === 0) return;

    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.speedX,
        y: particle.y + particle.speedY,
        opacity: particle.opacity + (Math.random() - 0.5) * 0.02
      })));
    };

    import('@/utils/scheduler').then(({ rafThrottle }) => {
      const throttledAnimate = rafThrottle(animateParticles);
      const animate = () => {
        throttledAnimate();
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
    
    return () => {}; // Animation stops automatically when component unmounts
  }, [isOpen, particles.length]);

  // Real-time clock
  useEffect(() => {
    if (!isOpen) return;
    import('@/utils/scheduler').then(({ scheduleIdleCallback, cancelIdleCallback }) => {
      let timeoutId: number;
      
      const updateTime = () => {
        setCurrentTime(new Date());
        timeoutId = scheduleIdleCallback(updateTime, 1000);
      };
      
      timeoutId = scheduleIdleCallback(updateTime, 1000);
      
      return () => {
        if (timeoutId) cancelIdleCallback(timeoutId);
      };
    });
  }, [isOpen]);

  // Enhanced animation sequence
  useEffect(() => {
    if (!isOpen) {
      setAnimationStep(0);
      return;
    }

    const sequence = setTimeout(() => {
      if (animationStep < 6) {
        setAnimationStep(animationStep + 1);
        
        // Trigger stats animation
        if (animationStep === 1) {
          statsControls.start({
            scale: [1, 1.05, 1],
            transition: { duration: 0.5 }
          });
        }
        
        // Dynamic progress updates
        if (animationStep >= 2) {
          setDynamicProgress(prev => prev.map(p => 
            Math.min(100, p + Math.floor(Math.random() * 10))
          ));
        }
        
        // Simulate real-time updates with more variation
        setStats(prev => ({
          notes: prev.notes + Math.floor(Math.random() * 3),
          projects: prev.projects + (Math.random() > 0.7 ? 1 : 0),
          collaborators: prev.collaborators + (Math.random() > 0.8 ? 1 : 0),
          productivity: Math.min(100, prev.productivity + Math.floor(Math.random() * 8))
        }));
      }
    }, 1200);

    return () => clearTimeout(sequence);
  }, [isOpen, animationStep, statsControls]);

  // Activity pulse effect
  useEffect(() => {
    if (!isOpen) return;
    import('@/utils/scheduler').then(({ scheduleIdleCallback, cancelIdleCallback }) => {
      let timeoutId: number;
      
      const updatePulse = () => {
        setActivityPulse(prev => (prev + 1) % 3);
        timeoutId = scheduleIdleCallback(updatePulse, 2000);
      };
      
      timeoutId = scheduleIdleCallback(updatePulse, 2000);
      
      return () => {
        if (timeoutId) cancelIdleCallback(timeoutId);
      };
    });
  }, [isOpen]);

  const recentNotes = [
    { title: "AI Strategy Meeting Notes", time: "2 min ago", progress: dynamicProgress[0], category: "Strategy", icon: Target },
    { title: "Project Roadmap Q4", time: "15 min ago", progress: dynamicProgress[1], category: "Planning", icon: Calendar },
    { title: "Market Research Findings", time: "1 hour ago", progress: dynamicProgress[2], category: "Research", icon: TrendingUp },
    { title: "Team Retrospective", time: "3 hours ago", progress: dynamicProgress[3], category: "Team", icon: Users }
  ];

  const quickActions = [
    { icon: Plus, label: "New Note", color: "from-blue-500 to-cyan-500", pulse: true },
    { icon: Calendar, label: "Schedule", color: "from-purple-500 to-pink-500" },
    { icon: Users, label: "Collaborate", color: "from-green-500 to-teal-500" },
    { icon: BarChart3, label: "Analytics", color: "from-orange-500 to-red-500" }
  ];

  const showcaseFeatures = [
    { 
      icon: Sparkles, 
      title: "AI-Powered Insights", 
      subtitle: "Smart content analysis & suggestions", 
      color: "from-emerald-400 to-teal-500", 
      bgColor: "bg-gradient-to-br from-emerald-500/20 to-teal-600/20"
    },
    { 
      icon: Zap, 
      title: "Real-time Sync", 
      subtitle: "See instant sync across devices", 
      color: "from-orange-400 to-red-500", 
      bgColor: "bg-gradient-to-br from-orange-500/20 to-red-600/20"
    },
    { 
      icon: Target, 
      title: "Encrypted Secure", 
      subtitle: "End-to-end encryption protection", 
      color: "from-blue-400 to-cyan-500", 
      bgColor: "bg-gradient-to-br from-blue-500/20 to-cyan-600/20"
    },
    { 
      icon: Activity, 
      title: "Voice Transcription", 
      subtitle: "Record, tag & auto-transcribe", 
      color: "from-purple-400 to-pink-500", 
      bgColor: "bg-gradient-to-br from-purple-500/20 to-pink-600/20"
    }
  ];

  const smartCategories = [
    { name: "Smart Notes", count: 24, color: "from-blue-400 to-cyan-500" },
    { name: "Research", count: 18, color: "from-green-400 to-emerald-500" },
    { name: "Projects", count: 12, color: "from-purple-400 to-pink-500" }
  ];

  const activityItems = [
    { action: "Created", item: "AI Strategy Notes", time: "5 min ago", color: "text-green-400", icon: Plus },
    { action: "Updated", item: "Project Roadmap", time: "1 hour ago", color: "text-blue-400", icon: Clock },
    { action: "Shared", item: "Research Report", time: "2 hours ago", color: "text-purple-400", icon: Sparkles }
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
          {/* Floating Particles Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  opacity: particle.opacity
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
            transition={{ type: "spring", duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden relative"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 100px rgba(6, 182, 212, 0.2)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse" />
            
            {/* Dynamic Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />

            {/* Close Button */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute top-6 right-6 z-10"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Demo Badge with Pulse */}
            <motion.div
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="absolute top-6 left-6 z-10"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(6, 182, 212, 0.4)",
                    "0 0 40px rgba(6, 182, 212, 0.6)",
                    "0 0 20px rgba(6, 182, 212, 0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white border-0 px-4 py-2 backdrop-blur-md">
                  ✨ Interactive Demo
                </Badge>
              </motion.div>
            </motion.div>

            {/* Live Clock */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-6 right-20 z-10"
            >
              <div className="text-white/60 text-sm font-mono bg-white/5 backdrop-blur-md rounded-lg px-3 py-1 border border-white/10">
                {currentTime.toLocaleTimeString()}
              </div>
            </motion.div>

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

              {/* Enhanced Stats Grid with Hover Effects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animationStep >= 1 ? 1 : 0, y: animationStep >= 1 ? 0 : 20 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-4 gap-6 mb-8"
              >
                {[
                  { icon: FileText, label: "Total Notes", value: stats.notes, color: "text-blue-400", gradient: "from-blue-500/20 to-cyan-500/20" },
                  { icon: Users, label: "Projects", value: stats.projects, color: "text-green-400", gradient: "from-green-500/20 to-teal-500/20" },
                  { icon: TrendingUp, label: "Collaborators", value: stats.collaborators, color: "text-purple-400", gradient: "from-purple-500/20 to-pink-500/20" },
                  { icon: Activity, label: "Productivity", value: `${stats.productivity}%`, color: "text-orange-400", gradient: "from-orange-500/20 to-red-500/20" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1, 
                      y: 0,
                      rotateY: animationStep >= 1 ? [0, 5, 0] : 0
                    }}
                    transition={{ 
                      delay: 0.6 + index * 0.1,
                      rotateY: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-white/30 transition-all duration-300 group relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/60 text-sm group-hover:text-white/80 transition-colors">{stat.label}</p>
                            <motion.p
                              key={`${stat.value}-${animationStep}`}
                              initial={{ scale: 1.3, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 200 }}
                              className="text-3xl font-bold text-white group-hover:text-white transition-colors"
                            >
                              {stat.value}
                            </motion.p>
                          </div>
                          <motion.div
                            animate={{ 
                              rotate: [0, 360],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                              scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                            }}
                          >
                            <stat.icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                          </motion.div>
                        </div>
                        {/* Micro progress indicator */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: animationStep >= 1 ? "100%" : "0%" }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 1 }}
                          className={`h-1 bg-gradient-to-r ${stat.gradient.replace('/20', '/60')} rounded-full mt-3`}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Enhanced Recent Notes */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: animationStep >= 2 ? 1 : 0, x: animationStep >= 2 ? 0 : -20 }}
                  transition={{ delay: 0.8 }}
                  className="lg:col-span-2"
                >
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 h-full hover:border-white/20 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                          <FileText className="w-5 h-5 text-cyan-400" />
                        </motion.div>
                        Recent Notes
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="ml-auto"
                        >
                          <Badge className="bg-cyan-500/20 text-cyan-300 border-0 text-xs">
                            Live
                          </Badge>
                        </motion.div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentNotes.map((note, index) => {
                          const IconComponent = note.icon;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: 1 + index * 0.15 }}
                              whileHover={{ 
                                scale: 1.02,
                                x: 5,
                                transition: { duration: 0.2 }
                              }}
                              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden"
                            >
                              {/* Animated background on hover */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100"
                                transition={{ duration: 0.3 }}
                              />
                              
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="relative z-10"
                              >
                                <IconComponent className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                              </motion.div>
                              
                              <div className="flex-1 relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                                    {note.title}
                                  </h4>
                                  <Badge className="bg-white/10 text-white/70 border-0 text-xs">
                                    {note.category}
                                  </Badge>
                                </div>
                                <p className="text-white/60 text-sm mb-3">{note.time}</p>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white/60 text-xs">Progress</span>
                                    <span className="text-white/80 text-xs font-medium">{note.progress}%</span>
                                  </div>
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                                    className="relative"
                                  >
                                    <Progress 
                                      value={note.progress} 
                                      className="h-2 bg-white/10"
                                    />
                                    <motion.div
                                      animate={{ 
                                        x: [`${note.progress - 10}%`, `${note.progress}%`, `${note.progress - 5}%`]
                                      }}
                                      transition={{ 
                                        duration: 2, 
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                      }}
                                      className="absolute top-0 w-2 h-2 bg-cyan-400 rounded-full -mt-0 opacity-80"
                                    />
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Enhanced Quick Actions & Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: animationStep >= 3 ? 1 : 0, x: animationStep >= 3 ? 0 : 20 }}
                  transition={{ delay: 1.2 }}
                  className="space-y-6"
                >
                  {/* Enhanced Quick Actions */}
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 transition-all duration-300 group">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Zap className="w-5 h-5 text-yellow-400" />
                        </motion.div>
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                          <motion.button
                            key={action.label}
                            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{ 
                              delay: 1.4 + index * 0.1,
                              type: "spring",
                              stiffness: 200
                            }}
                            whileHover={{ 
                              scale: 1.08,
                              rotateY: 5,
                              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-4 rounded-xl bg-gradient-to-r ${action.color} text-white font-bold transition-all hover:shadow-lg flex flex-col items-center gap-2 relative overflow-hidden group shadow-lg`}
                          >
                            {/* Dark overlay for better text contrast */}
                            <div className="absolute inset-0 bg-black/20 rounded-xl" />
                            
                            {/* Animated shimmer effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{
                                x: ["-100%", "100%"]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                              style={{ width: "200%" }}
                            />
                            
                            <motion.div
                              animate={action.pulse ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                              } : {
                                rotate: [0, 10, -10, 0]
                              }}
                              transition={{
                                duration: action.pulse ? 2 : 3,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                              className="relative z-10"
                            >
                              <action.icon className="w-6 h-6 drop-shadow-md" />
                            </motion.div>
                            <span className="text-sm relative z-10 font-bold drop-shadow-md">{action.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Activity Feed */}
                  <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <motion.div
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                          }}
                        >
                          <Activity className="w-5 h-5 text-green-400" />
                        </motion.div>
                        Recent Activity
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="ml-auto"
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                        </motion.div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: animationStep >= 4 ? 1 : 0 }}
                        transition={{ delay: 1.8 }}
                        className="space-y-3"
                      >
                        {activityItems.map((activity, index) => {
                          const IconComponent = activity.icon;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20, scale: 0.9 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{ 
                                delay: 2 + index * 0.2,
                                type: "spring",
                                stiffness: 150
                              }}
                              whileHover={{
                                scale: 1.02,
                                x: 5,
                                transition: { duration: 0.2 }
                              }}
                              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden"
                            >
                              {/* Pulse effect background */}
                              <motion.div
                                animate={{
                                  opacity: activityPulse === index ? [0, 0.3, 0] : 0
                                }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent"
                              />
                              
                              <motion.div
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  rotate: [0, 180, 360]
                                }}
                                transition={{ 
                                  duration: 4,
                                  repeat: Infinity,
                                  delay: index * 0.5
                                }}
                                className="relative z-10"
                              >
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center ${activity.color}`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                              </motion.div>
                              
                              <div className="flex-1 relative z-10">
                                <motion.p 
                                  className="text-white/80 text-sm group-hover:text-white transition-colors"
                                  initial={{ opacity: 0.8 }}
                                  animate={{ opacity: activityPulse === index ? 1 : 0.8 }}
                                >
                                  <span className={`${activity.color} font-medium`}>{activity.action}</span> {activity.item}
                                </motion.p>
                                <p className="text-white/50 text-xs">{activity.time}</p>
                              </div>
                              
                              {/* Time indicator */}
                              <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity,
                                  delay: index * 0.7
                                }}
                                className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-transparent rounded-full opacity-50"
                              />
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Enhanced Showcase Features Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: animationStep >= 4 ? 1 : 0, y: animationStep >= 4 ? 0 : 30 }}
                transition={{ delay: 2.2 }}
                className="mt-8"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                    </motion.div>
                    Featured Capabilities
                  </h2>
                  <p className="text-white/60">Experience the power of AI-enhanced note-taking</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {showcaseFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ 
                        delay: 2.4 + index * 0.15,
                        type: "spring",
                        stiffness: 150
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        rotateY: 2,
                        transition: { duration: 0.2 }
                      }}
                      className={`${feature.bgColor} backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 relative overflow-hidden group cursor-pointer`}
                    >
                      {/* Enhanced background with better contrast */}
                      <div className="absolute inset-0 bg-black/30 rounded-2xl" />
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color.replace('400', '500').replace('500', '600')}/10 rounded-2xl`} />
                      
                      {/* Animated grid pattern */}
                      <div 
                        className="absolute inset-0 opacity-5"
                        style={{
                          backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                          `,
                          backgroundSize: '15px 15px'
                        }}
                      />
                      
                      <div className="relative z-10 flex items-start gap-4">
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                          className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}
                        >
                          <feature.icon className="w-6 h-6 text-white drop-shadow-md" />
                        </motion.div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md group-hover:text-cyan-100 transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-white/80 font-medium drop-shadow-sm group-hover:text-white/90 transition-colors">
                            {feature.subtitle}
                          </p>
                        </div>
                        
                        {/* Pulse indicator */}
                        <motion.div
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                          className="w-3 h-3 bg-white/60 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Smart Categories */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: animationStep >= 5 ? 1 : 0, y: animationStep >= 5 ? 0 : 20 }}
                  transition={{ delay: 3.0 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                      >
                        <Target className="w-5 h-5 text-purple-400" />
                      </motion.div>
                      Smart Categories
                    </h3>
                    <Badge className="bg-purple-500/20 text-purple-300 border-0">
                      Auto-organized
                    </Badge>
                  </div>
                  
                  <div className="flex gap-3">
                    {smartCategories.map((category, index) => (
                      <motion.button
                        key={category.name}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          delay: 3.2 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          y: -2,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-1 p-4 rounded-xl bg-gradient-to-r ${category.color} text-white font-bold transition-all hover:shadow-lg relative overflow-hidden group`}
                      >
                        {/* Better contrast overlay */}
                        <div className="absolute inset-0 bg-black/25 rounded-xl" />
                        
                        <div className="relative z-10">
                          <div className="text-lg font-bold drop-shadow-md">{category.name}</div>
                          <div className="text-sm opacity-90 font-semibold drop-shadow-sm">{category.count} items</div>
                        </div>
                        
                        {/* Animated glow effect */}
                        <motion.div
                          animate={{
                            opacity: [0, 0.3, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.7
                          }}
                          className="absolute inset-0 bg-white/20 rounded-xl"
                        />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardDemo;