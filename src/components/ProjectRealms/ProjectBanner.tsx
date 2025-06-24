
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import { ProjectRealm } from '../../types/project';
import ProjectImageUpload from './ProjectImageUpload';

interface ProjectBannerProps {
  project: ProjectRealm;
  bannerImage: string | null;
  onImageUpdate: (imageUrl: string) => void;
}

const ProjectBanner: React.FC<ProjectBannerProps> = ({ 
  project, 
  bannerImage, 
  onImageUpdate 
}) => {
  const navigate = useNavigate();

  const getStatusColor = (status: ProjectRealm['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'hibernating':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="relative h-64 overflow-hidden">
      {bannerImage ? (
        <>
          <img 
            src={bannerImage} 
            alt="Project banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </>
      )}
      <div className="relative z-10 h-full flex items-end p-8">
        <div className="text-white flex-1">
          <Button
            variant="ghost"
            onClick={() => navigate('/app/projects')}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
          {project.description && (
            <p className="text-xl text-white/90 mb-4">{project.description}</p>
          )}
          <div className="flex items-center space-x-4">
            <Badge className={`${getStatusColor(project.status)} border-0`}>
              {project.status}
            </Badge>
            <div className="flex items-center text-white/80">
              <Users className="h-4 w-4 mr-1" />
              {project.ai_config.agents.length} agents
            </div>
            <div className="flex items-center text-white/80">
              <Calendar className="h-4 w-4 mr-1" />
              Created {formatDate(project.created_at)}
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <ProjectImageUpload 
            projectId={project.id}
            currentImageUrl={bannerImage}
            onImageUpdate={onImageUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectBanner;
