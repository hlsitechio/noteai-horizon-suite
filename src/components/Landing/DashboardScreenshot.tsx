import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Star, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Tags,
  BarChart3,
  Activity,
  Users,
  Target,
  Zap,
  Brain,
  Home,
  PlusCircle,
  Search,
  Settings,
  FolderOpen,
  Bell,
  Menu,
  Thermometer,
  MapPin,
  Edit3,
  Upload,
  Palette,
  MessageSquare,
  Bookmark,
  Archive,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  TrendingDown,
  Eye,
  Share2,
  Download,
  RefreshCw,
  Calendar as CalendarIcon,
  Timer,
  Globe,
  Database,
  Cpu,
  Wifi,
  BatteryCharging,
  Moon,
  Sun,
  CloudRain,
  Wind
} from 'lucide-react';

const DashboardScreenshot = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [animationProgress, setAnimationProgress] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setAnimationProgress(prev => (prev + 1) % 100);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock real-time data
  const mockStats = [
    {
      icon: FileText,
      label: 'Total Notes',
      value: '2,847',
      change: '+127 this week',
      trend: 15.3,
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-500',
      chartData: [65, 59, 80, 81, 56, 55, 40]
    },
    {
      icon: Brain,
      label: 'AI Insights',
      value: '1,234',
      change: '+45 today',
      trend: 8.7,
      color: 'from-purple-500/20 to-purple-600/20',
      iconColor: 'text-purple-500',
      chartData: [28, 48, 40, 19, 86, 27, 90]
    },
    {
      icon: TrendingUp,
      label: 'Productivity',
      value: '94%',
      change: '+12% vs last week',
      trend: 12.1,
      color: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-500',
      chartData: [45, 52, 38, 24, 33, 26, 21]
    },
    {
      icon: Users,
      label: 'Collaborators',
      value: '23',
      change: '+3 new',
      trend: 5.4,
      color: 'from-orange-500/20 to-orange-600/20',
      iconColor: 'text-orange-500',
      chartData: [12, 19, 3, 5, 2, 3, 23]
    },
    {
      icon: Target,
      label: 'Goals Met',
      value: '18/20',
      change: '90% complete',
      trend: 90,
      color: 'from-indigo-500/20 to-indigo-600/20',
      iconColor: 'text-indigo-500',
      chartData: [80, 85, 88, 90, 92, 89, 90]
    },
    {
      icon: Zap,
      label: 'Automation',
      value: '156',
      change: 'Active workflows',
      trend: 23.8,
      color: 'from-yellow-500/20 to-yellow-600/20',
      iconColor: 'text-yellow-500',
      chartData: [20, 30, 40, 35, 45, 50, 156]
    }
  ];

  const mockSidebarItems = [
    { title: 'Dashboard', icon: Home, active: true, badge: null },
    { title: 'Notes', icon: FileText, active: false, badge: '2.8k' },
    { title: 'AI Assistant', icon: Brain, active: false, badge: 'New' },
    { title: 'Calendar', icon: Calendar, active: false, badge: '12' },
    { title: 'Analytics', icon: BarChart3, active: false, badge: null },
    { title: 'Gallery', icon: Archive, active: false, badge: '156' },
    { title: 'Settings', icon: Settings, active: false, badge: null }
  ];

  const mockRecentActivities = [
    { 
      action: 'AI generated summary for "Project Roadmap"', 
      time: `${Math.floor(animationProgress / 10) + 1}m ago`, 
      icon: Brain,
      type: 'ai',
      user: 'You'
    },
    { 
      action: 'Shared "Meeting Notes" with team', 
      time: '5m ago', 
      icon: Share2,
      type: 'collaboration',
      user: 'Sarah Chen'
    },
    { 
      action: 'Created new folder "Q1 Planning"', 
      time: '12m ago', 
      icon: FolderOpen,
      type: 'organization',
      user: 'You'
    },
    { 
      action: 'Completed automation workflow', 
      time: '18m ago', 
      icon: Zap,
      type: 'automation',
      user: 'System'
    },
    { 
      action: 'Received team feedback on proposal', 
      time: '32m ago', 
      icon: MessageSquare,
      type: 'feedback',
      user: 'Team'
    }
  ];

  const mockTrendingNotes = [
    { title: 'AI Revolution in 2025', views: '2.3k', trend: 'up' },
    { title: 'Project Architecture Deep Dive', views: '1.8k', trend: 'up' },
    { title: 'Team Collaboration Best Practices', views: '1.5k', trend: 'down' },
    { title: 'Data Analysis Methodology', views: '1.2k', trend: 'up' },
    { title: 'Innovation Workshop Summary', views: '987', trend: 'up' }
  ];

  const mockUpcomingEvents = [
    { title: 'Team Standup', time: '2:30 PM', type: 'meeting' },
    { title: 'Client Presentation', time: '4:00 PM', type: 'presentation' },
    { title: 'Code Review', time: '5:30 PM', type: 'review' },
    { title: 'Project Deadline', time: 'Tomorrow', type: 'deadline' }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Browser frame with animated elements */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl p-4 border border-border/20">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="flex-1 bg-white/50 dark:bg-gray-700/50 rounded-lg px-4 py-1 mx-4 relative overflow-hidden">
              <span className="text-sm text-muted-foreground">app.noteai.com/dashboard</span>
              <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent w-24 animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
        </div>

        {/* Dashboard content with enhanced realism */}
        <div className="bg-gradient-to-br from-background via-background/98 to-accent/3 border border-border/20 border-t-0 rounded-b-2xl overflow-hidden shadow-2xl">
          <div className="flex h-[700px]">
            
            {/* Enhanced Sidebar */}
            <div className="w-72 bg-sidebar border-r border-border/50 flex flex-col">
              {/* Sidebar Header with branding */}
              <div className="p-4 border-b border-border/30">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-sidebar"></div>
                  </div>
                  <div>
                    <span className="font-bold text-sidebar-foreground text-lg">NoteAI</span>
                    <div className="text-xs text-sidebar-foreground/70">Pro Dashboard</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Navigation */}
              <div className="flex-1 p-3 space-y-1 overflow-y-auto">
                <div className="space-y-1">
                  {mockSidebarItems.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 group cursor-pointer ${
                        item.active 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${item.active ? 'text-primary' : 'text-sidebar-foreground/70'}`} />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant={item.badge === 'New' ? 'default' : 'secondary'} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions with animations */}
                <div className="pt-6 space-y-3">
                  <h4 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    {[
                      { icon: PlusCircle, label: 'New Note', shortcut: 'Ctrl+N' },
                      { icon: Upload, label: 'Upload File', shortcut: 'Ctrl+U' },
                      { icon: Brain, label: 'AI Assist', shortcut: 'Ctrl+A' }
                    ].map((action, index) => (
                      <motion.div
                        key={action.label}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/30 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <action.icon className="w-4 h-4 text-sidebar-foreground/70 group-hover:text-primary transition-colors" />
                          <span className="text-sm">{action.label}</span>
                        </div>
                        <kbd className="text-xs text-sidebar-foreground/50 bg-sidebar-accent/30 px-2 py-1 rounded">
                          {action.shortcut}
                        </kbd>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Trending Notes section */}
                <div className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide">Trending</h4>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {mockTrendingNotes.slice(0, 4).map((note, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-center justify-between px-3 py-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/20 rounded-md cursor-pointer transition-all group"
                      >
                        <div className="flex-1 truncate">
                          <div className="truncate font-medium">{note.title}</div>
                          <div className="text-xs text-sidebar-foreground/50 flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{note.views}</span>
                          </div>
                        </div>
                        {note.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Enhanced Sidebar Footer */}
              <div className="p-4 border-t border-border/30 bg-sidebar/50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">HU</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-sidebar flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-sidebar-foreground truncate">Hubert</p>
                      <Badge variant="outline" className="text-xs">Pro</Badge>
                    </div>
                    <p className="text-xs text-sidebar-foreground/70 truncate">All systems operational</p>
                  </div>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <Settings className="w-4 h-4 text-sidebar-foreground/70" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Main Content */}
            <div className="flex-1 flex flex-col">
              
              {/* Advanced Top Navigation Bar */}
              <div className="h-20 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4">
                <div className="flex items-center justify-between h-full">
                  {/* Welcome with real-time updates */}
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-lg">Welcome back, Hubert!</span>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4"
                        >
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                        </motion.div>
                      </div>
                      <p className="text-sm text-muted-foreground">You have 12 pending tasks and 3 new insights</p>
                    </div>
                  </div>

                  {/* Advanced status indicators */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                      {/* Real-time clock */}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-center">
                          <div className="font-mono font-semibold text-foreground text-sm">
                            {currentTime.toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit', 
                              second: '2-digit',
                              hour12: true 
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {currentTime.toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Animated weather */}
                      <motion.div 
                        className="flex items-center gap-2"
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <CloudRain className="h-4 w-4 text-blue-500" />
                        <div className="text-center">
                          <div className="font-semibold text-foreground text-sm flex items-center gap-1">
                            22°C
                            <Wind className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <div className="text-xs text-muted-foreground">New York</div>
                        </div>
                      </motion.div>

                      {/* System status indicators */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Wifi className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-muted-foreground">Online</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Database className="w-4 h-4 text-blue-500" />
                          <span className="text-xs text-muted-foreground">Synced</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Cpu className="w-4 h-4 text-purple-500" />
                          <span className="text-xs text-muted-foreground">AI Ready</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 p-2 bg-background/90 backdrop-blur-sm rounded-xl border border-border/50">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Bell className="h-4 w-4" />
                        <Badge variant="destructive" className="w-5 h-5 p-0 text-xs">3</Badge>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Edit3 className="h-4 w-4" />
                        Edit Layout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Dashboard Content */}
              <div className="flex-1 overflow-auto p-6 space-y-6">
                
                {/* Advanced KPI Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-foreground">Performance Analytics</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      >
                        <Card className="border border-border/10 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 overflow-hidden group">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                              </div>
                              <div className="text-right">
                                <div className={`text-xs font-medium flex items-center ${
                                  stat.trend > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {stat.trend > 0 ? '↗' : '↘'} {stat.trend}%
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                              <p className="text-xs text-green-600 dark:text-green-400">{stat.change}</p>
                              
                              {/* Mini chart */}
                              <div className="flex items-end space-x-1 h-8 mt-3">
                                {stat.chartData.map((value, i) => (
                                  <motion.div
                                    key={i}
                                    className={`bg-gradient-to-t ${stat.color.replace('/20', '/40')} rounded-sm flex-1`}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(value / 100) * 100}%` }}
                                    transition={{ delay: index * 0.05 + i * 0.02 }}
                                  />
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Advanced Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Real-time Activity Feed */}
                  <Card className="lg:col-span-2 border border-border/10 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <Activity className="w-5 h-5 text-primary" />
                          <h4 className="text-lg font-semibold">Live Activity Feed</h4>
                          <Badge variant="outline" className="animate-pulse">Live</Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="w-4 h-4 mr-2" />
                          Filter
                        </Button>
                      </div>
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        <AnimatePresence>
                          {mockRecentActivities.map((activity, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                activity.type === 'ai' ? 'bg-purple-100 dark:bg-purple-900' :
                                activity.type === 'collaboration' ? 'bg-blue-100 dark:bg-blue-900' :
                                activity.type === 'automation' ? 'bg-yellow-100 dark:bg-yellow-900' :
                                'bg-gray-100 dark:bg-gray-800'
                              }`}>
                                <activity.icon className={`w-5 h-5 ${
                                  activity.type === 'ai' ? 'text-purple-600' :
                                  activity.type === 'collaboration' ? 'text-blue-600' :
                                  activity.type === 'automation' ? 'text-yellow-600' :
                                  'text-gray-600'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                  {activity.action}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                                </div>
                              </div>
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Smart Insights Panel */}
                  <Card className="border border-border/10 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <Brain className="w-5 h-5 text-primary" />
                        <h4 className="text-lg font-semibold">AI Insights</h4>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                        </motion.div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl border">
                          <div className="flex items-start space-x-3">
                            <Brain className="w-5 h-5 text-purple-600 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Smart Suggestion</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Based on your recent activity, consider creating a "Project Templates" folder to organize reusable content.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-foreground">Productivity Metrics</h5>
                          {[
                            { label: 'Focus Score', value: 87, color: 'bg-green-500' },
                            { label: 'Collaboration', value: 92, color: 'bg-blue-500' },
                            { label: 'Innovation', value: 76, color: 'bg-purple-500' }
                          ].map((metric, index) => (
                            <div key={metric.label} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{metric.label}</span>
                                <span className="text-xs font-medium">{metric.value}%</span>
                              </div>
                              <Progress value={metric.value} className="h-2" />
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t">
                          <h5 className="text-sm font-medium text-foreground mb-3">Quick Actions</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { icon: PlusCircle, label: 'New Note' },
                              { icon: Brain, label: 'AI Help' },
                              { icon: Share2, label: 'Share' },
                              { icon: Archive, label: 'Archive' }
                            ].map((action) => (
                              <Button
                                key={action.label}
                                variant="outline"
                                size="sm"
                                className="justify-start gap-2 text-xs"
                              >
                                <action.icon className="w-3 h-3" />
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Calendar & Events */}
                  <Card className="border border-border/10 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-6">
                        <CalendarIcon className="w-5 h-5 text-primary" />
                        <h4 className="text-lg font-semibold">Today's Schedule</h4>
                      </div>
                      <div className="space-y-3">
                        {mockUpcomingEvents.map((event, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            <div className={`w-3 h-3 rounded-full ${
                              event.type === 'meeting' ? 'bg-blue-500' :
                              event.type === 'presentation' ? 'bg-purple-500' :
                              event.type === 'review' ? 'bg-green-500' :
                              'bg-red-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{event.title}</p>
                              <p className="text-xs text-muted-foreground">{event.time}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Chart */}
                  <Card className="lg:col-span-2 border border-border/10 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <h4 className="text-lg font-semibold">Performance Trends</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">Weekly</Button>
                          <Button variant="outline" size="sm">Monthly</Button>
                        </div>
                      </div>
                      
                      {/* Animated chart simulation */}
                      <div className="h-48 flex items-end space-x-2">
                        {Array.from({ length: 14 }, (_, i) => (
                          <motion.div
                            key={i}
                            className="bg-gradient-to-t from-primary/60 to-primary rounded-t-md flex-1"
                            initial={{ height: 0 }}
                            animate={{ 
                              height: `${Math.sin(i * 0.8 + animationProgress * 0.1) * 30 + 50}%` 
                            }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                          />
                        ))}
                      </div>
                      
                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">+24%</p>
                          <p className="text-xs text-muted-foreground">Productivity</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">2.4k</p>
                          <p className="text-xs text-muted-foreground">Tasks Done</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">98%</p>
                          <p className="text-xs text-muted-foreground">Quality Score</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced glow effects */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-3xl rounded-3xl opacity-40" />
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 blur-2xl rounded-3xl" />
      </motion.div>
    </div>
  );
};

export default DashboardScreenshot;