import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Wind,
  Circle
} from 'lucide-react';

const DashboardScreenshot = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Browser frame matching the exact design */}
        <div className="bg-[#2d3748] rounded-t-2xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-[#4a5568] rounded-lg px-4 py-1 mx-4">
                <span className="text-sm text-gray-300">app.noteai.com/dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-400">Live</span>
            </div>
          </div>
        </div>

        {/* Exact dashboard replication */}
        <div className="bg-[#1a202c] border border-gray-700 border-t-0 rounded-b-2xl overflow-hidden shadow-2xl">
          <div className="flex h-[700px]">
            
            {/* Left Sidebar - Exact Match */}
            <div className="w-80 bg-[#2d3748] border-r border-gray-700 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2d3748]"></div>
                  </div>
                  <div>
                    <span className="font-bold text-white text-xl">NoteAI</span>
                    <div className="text-sm text-gray-400">Pro Dashboard</div>
                  </div>
                </div>
              </div>

              {/* Navigation Menu - Exact styling */}
              <div className="flex-1 p-4 space-y-2">
                {[
                  { title: 'Dashboard', icon: Home, active: true, badge: null },
                  { title: 'Notes', icon: FileText, active: false, badge: '2.8k' },
                  { title: 'AI Assistant', icon: Brain, active: false, badge: 'New' },
                  { title: 'Calendar', icon: Calendar, active: false, badge: '12' },
                  { title: 'Analytics', icon: BarChart3, active: false, badge: null },
                  { title: 'Gallery', icon: Archive, active: false, badge: '156' },
                  { title: 'Settings', icon: Settings, active: false, badge: null }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
                      item.active 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge 
                        className={`text-xs px-2 py-1 ${
                          item.badge === 'New' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-yellow-500 text-black'
                        }`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </motion.div>
                ))}

                {/* Quick Actions Section */}
                <div className="pt-6 space-y-3">
                  <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide">QUICK ACTIONS</h4>
                  <div className="space-y-2">
                    {[
                      { icon: PlusCircle, label: 'New Note', shortcut: 'Ctrl+N' },
                      { icon: Upload, label: 'Upload File', shortcut: 'Ctrl+U' },
                      { icon: Brain, label: 'AI Assist', shortcut: 'Ctrl+A' }
                    ].map((action, index) => (
                      <div
                        key={action.label}
                        className="flex items-center justify-between px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-all cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <action.icon className="w-4 h-4" />
                          <span className="text-sm">{action.label}</span>
                        </div>
                        <kbd className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                          {action.shortcut}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Profile Footer - Exact Match */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">HU</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2d3748] flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">Hubert</span>
                      <Badge className="text-xs bg-blue-500 text-white px-2 py-1">Pro</Badge>
                    </div>
                    <p className="text-xs text-gray-400">All systems operational</p>
                  </div>
                  <Settings className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col bg-[#1a202c]">
              
              {/* Top Navigation Bar - Exact Match */}
              <div className="bg-[#2d3748] p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  {/* Welcome Section */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-xl font-bold text-white">Welcome back, Hubert! ⚡</h1>
                    </div>
                    <p className="text-sm text-gray-400">You have 12 pending tasks and 3 new insights</p>
                  </div>

                  {/* Time and Weather */}
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-white font-mono text-lg font-bold">
                        {currentTime.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit', 
                          second: '2-digit',
                          hour12: false 
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {currentTime.toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-white text-lg font-bold">22°C ☁️</div>
                      <div className="text-xs text-gray-400">New York</div>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Wifi className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-400">Online</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Database className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-400">Synced</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Brain className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-gray-400">AI Ready</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-white">
                        <Bell className="w-4 h-4 mr-2" />
                        <Badge variant="destructive" className="w-5 h-5 p-0 text-xs">3</Badge>
                      </Button>
                      <Button variant="outline" size="sm" className="text-white border-gray-600">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Layout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid - Exact Layout */}
              <div className="flex-1 p-6 space-y-6 overflow-auto">
                
                {/* Top Row - Activity Feed and AI Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Activity Feed - Left Side */}
                  <div className="lg:col-span-2 bg-[#2d3748] rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center space-x-3 mb-6">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      <div>
                        <h3 className="text-white font-semibold">Received team feedback on proposal</h3>
                        <p className="text-sm text-gray-400">32m ago • Team</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights Panel - Right Side */}
                  <div className="bg-[#2d3748] rounded-xl p-6 border border-gray-700">
                    <h3 className="text-white font-semibold mb-4">Individual</h3>
                    <div className="space-y-4">
                      <div className="bg-blue-600 rounded-lg p-1">
                        <div className="bg-[#1a202c] rounded p-3">
                          <div className="text-white text-right font-bold">76%</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-white font-medium">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="text-white border-gray-600 justify-start">
                            <PlusCircle className="w-3 h-3 mr-2" />
                            New Note
                          </Button>
                          <Button variant="outline" size="sm" className="text-white border-gray-600 justify-start">
                            <Brain className="w-3 h-3 mr-2" />
                            AI Help
                          </Button>
                          <Button variant="outline" size="sm" className="text-white border-gray-600 justify-start">
                            <Share2 className="w-3 h-3 mr-2" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm" className="text-white border-gray-600 justify-start">
                            <Archive className="w-3 h-3 mr-2" />
                            Archive
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row - Schedule and Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Today's Schedule */}
                  <div className="bg-[#2d3748] rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center space-x-2 mb-6">
                      <CalendarIcon className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white font-semibold">Today's Schedule</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { title: 'Team Standup', time: '2:30 PM', color: 'bg-blue-500' },
                        { title: 'Client Presentation', time: '4:00 PM', color: 'bg-purple-500' },
                        { title: 'Code Review', time: '5:30 PM', color: 'bg-green-500' },
                        { title: 'Project Deadline', time: 'Tomorrow', color: 'bg-red-500' }
                      ].map((event, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{event.title}</p>
                            <p className="text-sm text-gray-400">{event.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Trends */}
                  <div className="bg-[#2d3748] rounded-xl p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <h3 className="text-white font-semibold">Performance Trends</h3>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="text-white border-gray-600">Weekly</Button>
                        <Button variant="outline" size="sm" className="text-white border-gray-600">Monthly</Button>
                      </div>
                    </div>
                    
                    {/* Chart Area */}
                    <div className="h-32 flex items-end space-x-1 mb-6">
                      {[60, 80, 90, 75, 85, 95, 70, 88, 92, 78, 85, 90, 95, 85].map((height, index) => (
                        <motion.div
                          key={index}
                          className="bg-blue-500 rounded-t flex-1"
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: index * 0.05 }}
                        />
                      ))}
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-400">+24%</p>
                        <p className="text-xs text-gray-400">Productivity</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-400">2.4k</p>
                        <p className="text-xs text-gray-400">Tasks Done</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-400">98%</p>
                        <p className="text-xs text-gray-400">Quality Score</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glow effects */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 blur-3xl rounded-3xl opacity-40" />
      </motion.div>
    </div>
  );
};

export default DashboardScreenshot;