
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectRealms } from '../contexts/ProjectRealmsContext';
import { ProjectRealm } from '../types/project';
import ProjectBanner from '../components/ProjectRealms/ProjectBanner';
import ProjectOverview from '../components/ProjectRealms/ProjectOverview';
import ProjectContent from '../components/ProjectRealms/ProjectContent';
import ProjectSidebar from '../components/ProjectRealms/ProjectSidebar';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject } = useProjectRealms();
  const [project, setProject] = useState<ProjectRealm | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  useEffect(() => {
    console.log('ProjectDetail: projectId from URL:', projectId);
    console.log('ProjectDetail: available projects:', projects);
    
    if (projectId) {
      const foundProject = projects.find(p => p.id === projectId);
      console.log('ProjectDetail: found project:', foundProject);
      
      if (foundProject) {
        setProject(foundProject);
        setCurrentProject(foundProject);
        // Check if project has a banner image in settings
        setBannerImage(foundProject.settings?.banner_image || null);
      } else if (projects.length > 0) {
        // Projects are loaded but project not found
        console.log('ProjectDetail: Project not found, redirecting...');
        navigate('/app/projects');
      }
      // If projects are still loading, wait for them
    }
  }, [projectId, projects, setCurrentProject, navigate]);

  const handleImageUpdate = (imageUrl: string) => {
    setBannerImage(imageUrl);
  };

  // Show loading if projects are still loading or project not found yet
  if (!project && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  // If projects are loaded but project not found
  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
          <button 
            onClick={() => navigate('/app/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <ProjectBanner 
        project={project}
        bannerImage={bannerImage}
        onImageUpdate={handleImageUpdate}
      />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto p-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ProjectOverview project={project} />
            <ProjectContent />
          </div>

          {/* Sidebar */}
          <ProjectSidebar project={project} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
