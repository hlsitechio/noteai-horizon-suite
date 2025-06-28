
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, TrendingUp, FileText } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

interface CategoriesOverviewProps {
  categoryCounts: Record<string, number>;
  totalNotes: number;
}

const CategoriesOverview: React.FC<CategoriesOverviewProps> = ({
  categoryCounts,
  totalNotes,
}) => {
  const isMobile = useIsMobile();

  const sortedCategories = Object.entries(categoryCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8); // Show top 8 categories

  const getPercentage = (count: number) => {
    return totalNotes > 0 ? Math.round((count / totalNotes) * 100) : 0;
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'work':
      case 'business':
        return <FileText className="w-4 h-4" />;
      case 'personal':
      case 'life':
        return <Tag className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-emerald-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-cyan-500',
      'bg-yellow-500',
      'bg-indigo-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <Card className="w-full h-full border border-border/10 shadow-premium bg-card/50 backdrop-blur-xl rounded-2xl flex flex-col">
      <CardHeader className={`${isMobile ? 'p-4 pb-3' : 'p-6 pb-4'} border-b border-border/10 flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center border border-accent/10">
            <Tag className="w-5 h-5 text-accent" />
          </div>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-foreground`}>
            Categories Overview
          </CardTitle>
          <Badge variant="secondary" className="ml-auto text-xs">
            {Object.keys(categoryCounts).length} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} flex-1 flex flex-col`}>
        {sortedCategories.length === 0 ? (
          <div className={`text-center flex-1 flex flex-col justify-center ${isMobile ? 'py-6' : 'py-8'}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center mx-auto mb-4 border border-accent/10">
              <Tag className={`text-accent ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`} />
            </div>
            <h3 className={`font-bold text-foreground mb-2 ${isMobile ? 'text-base' : 'text-lg'}`}>
              No categories yet
            </h3>
            <p className={`text-muted-foreground max-w-sm mx-auto ${isMobile ? 'text-sm' : ''}`}>
              Start organizing your notes with categories to see insights here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {sortedCategories.map(([category, count], index) => {
              const percentage = getPercentage(count);
              const colorClass = getCategoryColor(index);
              
              return (
                <div
                  key={category}
                  className="group flex items-center gap-4 p-4 rounded-xl hover:bg-card/80 transition-all duration-200 border border-border/10 hover:border-accent/20 hover:shadow-premium"
                >
                  <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0 text-white`}>
                    {getCategoryIcon(category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold capitalize truncate text-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {category}
                      </h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`font-bold text-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                          {count}
                        </span>
                        <Badge variant="outline" className="text-2xs">
                          {percentage}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full ${colorClass} transition-all duration-500 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            
            {Object.keys(categoryCounts).length > 8 && (
              <div className="text-center py-2">
                <p className="text-xs text-muted-foreground">
                  +{Object.keys(categoryCounts).length - 8} more categories
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoriesOverview;
