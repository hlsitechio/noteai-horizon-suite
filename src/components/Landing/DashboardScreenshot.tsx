import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
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
  Palette
} from 'lucide-react';

const DashboardScreenshot = () => {
  // Mock data for the screenshot
  const mockStats = [
    {
      icon: FileText,
      label: 'Total Notes',
      value: '1,247',
      change: '+23 this week',
      color: 'from-blue-500/20 to-blue-600/20',
      iconColor: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      label: 'Total Words',
      value: '45,832',
      change: '187 avg per note',
      color: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-500'
    },
    {
      icon: Star,
      label: 'Favorites',
      value: '89',
      change: '7% of all notes',
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-500'
    },
    {
      icon: Target,
      label: 'Writing Streak',
      value: '14 days',
      change: 'Great consistency!',
      color: 'from-purple-500/20 to-purple-600/20',
      iconColor: 'text-purple-500'
    },
    {
      icon: Calendar,
      label: 'This Week',
      value: '23',
      change: 'Very productive!',
      color: 'from-indigo-500/20 to-indigo-600/20',
      iconColor: 'text-indigo-500'
    },
    {
      icon: Tags,
      label: 'Categories',
      value: '8',
      change: 'Well organized',
      color: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-500'
    }
  ];

  const mockSidebarItems = [
    { title: 'Dashboard', icon: Home, active: true },
    { title: 'Notes', icon: FileText, active: false },
    { title: 'Search', icon: Search, active: false },
    { title: 'Calendar', icon: Calendar, active: false },
    { title: 'Settings', icon: Settings, active: false }
  ];

  const mockRecentNotes = [
    'Meeting Notes - Q4 Planning',
    'Project Ideas for 2024',
    'Research on AI Trends',
    'Weekly Review',
    'Book Summary: Deep Work'
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Browser-like frame */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl p-4 border border-border/20">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex-1 bg-white/50 dark:bg-gray-700/50 rounded-lg px-4 py-1 mx-4">
              <span className="text-sm text-muted-foreground">app.noteai.com/dashboard</span>
            </div>
          </div>
        </div>

        {/* Dashboard content with real layout */}
        <div className="bg-gradient-to-br from-background via-background/95 to-accent/5 border border-border/20 border-t-0 rounded-b-2xl overflow-hidden shadow-2xl">
          <div className="flex h-[600px]">
            
            {/* Sidebar */}
            <div className="w-64 bg-sidebar border-r border-border/50 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-border/30">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sidebar-foreground">NoteAI</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="flex-1 p-3 space-y-1">
                <div className="space-y-1">
                  {mockSidebarItems.map((item, index) => (
                    <div
                      key={item.title}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        item.active 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="pt-4 border-t border-border/30 mt-4">
                  <h4 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide mb-2">Quick Actions</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
                      <PlusCircle className="w-4 h-4" />
                      <span className="text-sm">New Note</span>
                    </div>
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
                      <FolderOpen className="w-4 h-4" />
                      <span className="text-sm">Browse Files</span>
                    </div>
                  </div>
                </div>

                {/* Recent Notes */}
                <div className="pt-4 border-t border-border/30 mt-4">
                  <h4 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wide mb-2">Recent Notes</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {mockRecentNotes.map((note, index) => (
                      <div key={index} className="px-3 py-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 rounded cursor-pointer transition-colors truncate">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-3 border-t border-border/30">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">HU</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">Hubert</p>
                    <p className="text-xs text-sidebar-foreground/70 truncate">Free Plan</p>
                  </div>
                  <Settings className="w-4 h-4 text-sidebar-foreground/70" />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
              
              {/* Top Navigation Bar (Banner) */}
              <div className="h-16 bg-background/80 backdrop-blur-sm border-b border-border/50 p-3">
                <div className="flex items-center justify-between h-full">
                  {/* Welcome Message */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">Welcome back, Hubert!</span>
                  </div>

                  {/* Time and Weather */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="text-center">
                        <div className="font-mono font-semibold text-foreground text-sm">2:34:56 PM</div>
                        <div className="text-xs text-muted-foreground">Friday, January 10, 2025</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <div className="text-center">
                        <div className="font-semibold text-foreground text-sm">22°C</div>
                        <div className="text-xs text-muted-foreground">New York</div>
                      </div>
                    </div>
                  </div>

                  {/* Banner Actions */}
                  <div className="flex items-center gap-2 p-2 bg-background/90 backdrop-blur-sm rounded-lg border border-border/50">
                    <button className="flex items-center gap-2 px-3 py-1 text-sm text-foreground hover:bg-accent/50 rounded transition-colors">
                      <Edit3 className="h-3 w-3" />
                      Edit Layout
                    </button>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="flex-1 overflow-auto p-6 space-y-6">
                
                {/* KPI Stats Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {mockStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border border-border/10 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300">
                          <CardContent className="p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg`}>
                                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                              <p className="text-lg font-bold text-foreground">{stat.value}</p>
                              <p className="text-xs text-green-600 dark:text-green-400">{stat.change}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Dashboard Panels Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Notes Panel */}
                  <Card className="border border-border/10 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-primary" />
                          <h4 className="text-lg font-semibold">Recent Notes</h4>
                        </div>
                        <button className="text-sm text-primary hover:underline">View All</button>
                      </div>
                      <div className="space-y-3">
                        {mockRecentNotes.slice(0, 4).map((note, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                            <span className="text-sm font-medium truncate">{note}</span>
                            <span className="text-xs text-muted-foreground">2m ago</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Assistant Panel */}
                  <Card className="border border-border/10 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Brain className="w-5 h-5 text-primary" />
                        <h4 className="text-lg font-semibold">AI Assistant</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <p className="text-sm text-foreground">✨ Ready to help with your writing</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Summarize', 'Improve', 'Translate', 'Generate'].map((action) => (
                            <span key={action} className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analytics Panel */}
                  <Card className="border border-border/10 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <h4 className="text-lg font-semibold">Writing Progress</h4>
                      </div>
                      <div className="space-y-3">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                          <div key={day} className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground w-8">{day}</span>
                            <div className="flex-1 mx-3 bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${(index + 1) * 15 + Math.random() * 20}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium w-6 text-right">{index + 2}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity Panel */}
                  <Card className="border border-border/10 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <Activity className="w-5 h-5 text-primary" />
                        <h4 className="text-lg font-semibold">Recent Activity</h4>
                      </div>
                      <div className="space-y-3">
                        {[
                          { action: 'Created new note', time: '2m ago', icon: PlusCircle },
                          { action: 'Updated "Project Ideas"', time: '5m ago', icon: Edit3 },
                          { action: 'Shared with team', time: '12m ago', icon: Users },
                          { action: 'Added reminder', time: '1h ago', icon: Bell }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <item.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.action}</p>
                              <p className="text-xs text-muted-foreground">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl rounded-3xl opacity-30" />
      </motion.div>
    </div>
  );
};

export default DashboardScreenshot;