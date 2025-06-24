
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Move } from 'lucide-react';
import { ProjectRealm } from '../../types/project';
import { useProjectRealms } from '../../contexts/ProjectRealmsContext';
import { toast } from 'sonner';

interface ProjectOverviewProps {
  project: ProjectRealm;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  const { updateProject } = useProjectRealms();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const imagePositions = [
    { value: 'center', label: 'Center' },
    { value: 'top', label: 'Top' },
    { value: 'bottom', label: 'Bottom' },
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' }
  ];

  const currentPosition = project.settings?.image_position || 'center';

  const handleImagePositionChange = async () => {
    const currentIndex = imagePositions.findIndex(pos => pos.value === currentPosition);
    const nextIndex = (currentIndex + 1) % imagePositions.length;
    const newPosition = imagePositions[nextIndex];

    try {
      await updateProject(project.id, {
        settings: {
          ...project.settings,
          image_position: newPosition.value
        }
      });
      toast.success(`Image position changed to ${newPosition.label}`);
    } catch (error) {
      toast.error('Failed to update image position');
    }
  };

  const getCurrentPositionLabel = () => {
    const position = imagePositions.find(pos => pos.value === currentPosition);
    return position?.label || 'Center';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Project Overview
          </div>
          {project.settings?.banner_image && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleImagePositionChange}
              className="flex items-center gap-2"
            >
              <Move className="h-4 w-4" />
              Position: {getCurrentPositionLabel()}
            </Button>
          )}
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
