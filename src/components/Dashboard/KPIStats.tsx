
import React from 'react';
import { FileText, Star, Folder, Calendar, TrendingUp } from 'lucide-react';
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
    <div className="grid grid-cols-4 gap-1 h-full">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="border border-border/10 shadow-sm bg-card/50 backdrop-blur-xl hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-102 rounded-lg h-full">
            <CardContent className="p-2 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-0.5 flex-1">
                  <p className="text-muted-foreground font-medium uppercase tracking-wider text-2xs">{stat.title}</p>
                  <p className="font-bold text-foreground text-base">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-2 h-2 text-accent" />
                    <span className="text-2xs text-accent font-medium">{stat.label}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center border border-accent/10 w-7 h-7 flex-shrink-0">
                  <IconComponent className="text-accent w-3.5 h-3.5" />
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
