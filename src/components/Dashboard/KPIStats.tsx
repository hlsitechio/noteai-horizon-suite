
import React from 'react';
import { FileText, Star, Folder, Calendar, TrendingUp, Zap } from 'lucide-react';
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
      icon: FileText,
      label: "Active",
      color: "accent"
    },
    {
      title: "Priority Items",
      value: favoriteNotes,
      icon: Star,
      label: "Starred",
      color: "accent"
    },
    {
      title: "Categories",
      value: Object.keys(categoryCounts).length,
      icon: Folder,
      label: "Organized",
      color: "accent"
    },
    {
      title: "This Week",
      value: weeklyNotes,
      icon: Calendar,
      label: "Recent",
      color: "accent"
    }
  ];

  return (
    <div className={`w-full grid gap-6 ${
      isMobile 
        ? 'grid-cols-2' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }`}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl hover:shadow-large transition-all duration-300 hover:-translate-y-1 hover:scale-105 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <p className="text-muted-foreground font-medium text-sm uppercase tracking-wider">{stat.title}</p>
                  <p className={`font-bold text-foreground ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-accent" />
                    <span className="text-xs text-accent font-medium">{stat.label}</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center border border-accent/10">
                  <IconComponent className={`text-accent ${isMobile ? 'w-6 h-6' : 'w-7 h-7'}`} />
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
