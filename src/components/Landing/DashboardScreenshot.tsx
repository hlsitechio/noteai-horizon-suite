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
  Brain
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

  const mockPanels = [
    {
      title: 'Recent Notes',
      icon: FileText,
      content: 'Quick access to your latest thoughts and ideas',
      features: ['Smart organization', 'Auto-save', 'Quick search']
    },
    {
      title: 'AI Assistant',
      icon: Brain,
      content: 'Intelligent writing suggestions and content enhancement',
      features: ['Writing assistance', 'Content optimization', 'Smart suggestions']
    },
    {
      title: 'Analytics Dashboard',
      icon: BarChart3,
      content: 'Track your writing progress and productivity insights',
      features: ['Writing metrics', 'Progress tracking', 'Productivity insights']
    },
    {
      title: 'Collaboration Hub',
      icon: Users,
      content: 'Share and collaborate on notes with your team',
      features: ['Real-time collaboration', 'Team spaces', 'Version control']
    },
    {
      title: 'Smart Reminders',
      icon: Clock,
      content: 'Never miss important deadlines or follow-ups',
      features: ['Smart scheduling', 'Custom alerts', 'Priority management']
    },
    {
      title: 'Performance Insights',
      icon: Activity,
      content: 'Monitor your productivity and writing patterns',
      features: ['Activity tracking', 'Goal setting', 'Performance metrics']
    }
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

        {/* Dashboard content */}
        <div className="bg-gradient-to-br from-background via-background/95 to-accent/5 border border-border/20 border-t-0 rounded-b-2xl overflow-hidden shadow-2xl">
          <div className="p-6 space-y-6">
            
            {/* KPI Stats Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Performance Overview</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {mockStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
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

            {/* Dashboard Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockPanels.map((panel, index) => (
                <motion.div
                  key={panel.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card className="border border-border/10 bg-card/80 backdrop-blur-sm hover:bg-card/90 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl">
                          <panel.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <h4 className="text-lg font-semibold text-foreground">{panel.title}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{panel.content}</p>
                          <div className="flex flex-wrap gap-2">
                            {panel.features.map((feature, featureIndex) => (
                              <span
                                key={featureIndex}
                                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bottom section with mock charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-border/10 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold">Writing Progress</h4>
                  </div>
                  <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{day}</span>
                        <div className="flex-1 mx-3 bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.random() * 80 + 20}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.floor(Math.random() * 10 + 1)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/10 bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Activity className="w-5 h-5 text-primary" />
                    <h4 className="text-lg font-semibold">Recent Activity</h4>
                  </div>
                  <div className="space-y-3">
                    {[
                      'Created new note in "Project Ideas"',
                      'Shared "Meeting Notes" with team',
                      'Added 3 tags to "Research Notes"',
                      'Completed daily writing goal',
                      'Backed up 15 notes to cloud'
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{activity}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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