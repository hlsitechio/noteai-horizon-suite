import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  Calendar,
  FileText,
  Users,
  Bell,
  Download,
  Upload,
  Palette
} from 'lucide-react';

interface DashboardSidebarProps {
  className?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className = "" }) => {
  const sidebarSections = [
    {
      title: "Dashboard",
      items: [
        { label: "Overview", icon: LayoutDashboard, active: true },
        { label: "Analytics", icon: BarChart3 },
        { label: "Calendar", icon: Calendar },
      ]
    },
    {
      title: "Content",
      items: [
        { label: "Documents", icon: FileText },
        { label: "Team", icon: Users },
        { label: "Notifications", icon: Bell, badge: "3" },
      ]
    },
    {
      title: "Tools",
      items: [
        { label: "Export", icon: Download },
        { label: "Import", icon: Upload },
        { label: "Themes", icon: Palette },
      ]
    }
  ];

  return (
    <div className={`h-full bg-card border-r ${className}`}>
      <Card className="h-full border-0 rounded-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Dashboard</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 p-4">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.label}
                      variant={item.active ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start h-8"
                      onClick={() => {
                        // TODO: Implement navigation or action
                        if (import.meta.env.DEV) {
                          console.log(`Clicked: ${item.label}`);
                        }
                      }}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
              {sectionIndex < sidebarSections.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
          
          {/* Settings at bottom */}
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8"
              onClick={() => {
                // TODO: Implement settings functionality
                if (import.meta.env.DEV) {
                  console.log('Settings clicked');
                }
              }}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};