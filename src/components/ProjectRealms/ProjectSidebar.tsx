
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, FileText } from 'lucide-react';
import { ProjectRealm } from '../../types/project';

interface ProjectSidebarProps {
  project: ProjectRealm;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ project }) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Project Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Users className="h-4 w-4 mr-2" />
            Manage Agents
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </CardContent>
      </Card>

      {/* AI Agents */}
      <Card>
        <CardHeader>
          <CardTitle>AI Agents</CardTitle>
        </CardHeader>
        <CardContent>
          {project.ai_config.agents.length > 0 ? (
            <div className="space-y-2">
              {project.ai_config.agents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{agent}</span>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No agents configured</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSidebar;
