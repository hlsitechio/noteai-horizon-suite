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

interface SidebarItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  badge?: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ className = "" }) => {
  const sidebarSections: SidebarSection[] = [
    {
      title: "Dashboard",
      items: [
        { label: "Overview", icon: LayoutDashboard, active: true },
        { label: "Analytics", icon: BarChart3, active: false },
        { label: "Calendar", icon: Calendar, active: false },
      ]
    },
    {
      title: "Content",
      items: [
        { label: "Documents", icon: FileText, active: false },
        { label: "Team", icon: Users, active: false },
      ]
    },
    {
      title: "Notifications",
      items: [
        { label: "Alerts", icon: Bell, active: false, badge: "3" },
      ]
    },
    {
      title: "Settings",
      items: [
        { label: "Configuration", icon: Settings, active: false },
        { label: "Import", icon: Download, active: false },
        { label: "Export", icon: Upload, active: false },
        { label: "Themes", icon: Palette, active: false },
      ]
    }
  ];

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Navigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sidebarSections.map((section, index) => (
          <div key={section.title} className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
              {section.title}
            </div>
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
            {index < sidebarSections.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};