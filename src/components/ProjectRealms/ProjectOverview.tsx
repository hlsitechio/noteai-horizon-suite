
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { ProjectRealm } from '../../types/project';

interface ProjectOverviewProps {
  project: ProjectRealm;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Project Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Last Activity</p>
            <p className="font-semibold">{formatDate(project.last_activity_at)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Memory Depth</p>
            <p className="font-semibold">{project.ai_config.memory_depth}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectOverview;
