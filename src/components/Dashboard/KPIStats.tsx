
import React from 'react';
import { BookOpen, Heart, TrendingUp, Calendar, Activity, Target, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '../../hooks/use-mobile';

interface KPIStatsProps {
  totalNotes: number;
  favoriteNotes: number;
  categoryCounts: Record<string, number>;
  weeklyNotes: number;
}

const KPIStats: React.FC<KPIStatsProps> = ({ 
  totalNotes, 
  favoriteNotes, 
  categoryCounts, 
  weeklyNotes 
}) => {
  const isMobile = useIsMobile();

  const stats = [
    {
      title: "Total Documents",
      value: totalNotes,
      icon: BookOpen,
      color: "emerald",
      label: "Active"
    },
    {
      title: "Priority Items",
      value: favoriteNotes,
      icon: Heart,
      color: "rose",
      label: "Starred"
    },
    {
      title: "Categories",
      value: Object.keys(categoryCounts).length,
      icon: TrendingUp,
      color: "blue",
      label: "Organized"
    },
    {
      title: "This Week",
      value: weeklyNotes,
      icon: Calendar,
      color: "violet",
      label: "Recent"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: "text-emerald-600",
      rose: "text-rose-600",
      blue: "text-blue-600",
      violet: "text-violet-600"
    };
    return colors[color as keyof typeof colors] || "text-gray-600";
  };

  const getIcon = (color: string) => {
    const icons = {
      emerald: Activity,
      rose: Target,
      blue: Users,
      violet: Calendar
    };
    return icons[color as keyof typeof icons] || Activity;
  };

  return (
    <div className={`w-full grid gap-6 ${
      isMobile 
        ? 'grid-cols-2' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }`}>
      {stats.map((stat, index) => {
        const IconComponent = getIcon(stat.color);
        return (
          <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wide">{stat.title}</p>
                  <p className={`font-bold text-slate-900 dark:text-slate-100 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <IconComponent className={`w-3 h-3 ${getColorClasses(stat.color)}`} />
                    <span className={`text-xs ${getColorClasses(stat.color)} font-medium`}>{stat.label}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-slate-900/5 dark:bg-slate-100/5 flex items-center justify-center">
                  <stat.icon className={`text-slate-700 dark:text-slate-300 ${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KPIStats;
