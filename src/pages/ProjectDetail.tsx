
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Users, Activity, Calendar, FolderOpen, FileText, Plus } from 'lucide-react';
import { useProjectRealms } from '../contexts/ProjectRealmsContext';
import { ProjectRealm } from '../types/project';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject } = useProjectRealms();
  const [project, setProject] = useState<ProjectRealm | null>(null);

  useEffect(() => {
    if (projectId) {
      const foundProject = projects.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        setCurrentProject(foundProject);
      } else {
        navigate('/app/projects');
      }
    }
  }, [projectId, projects, setCurrentProject, navigate]);

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

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 h-full flex items-end p-8">
          <div className="text-white">
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
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto p-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
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

            {/* Folders & Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2" />
                    Folders & Notes
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Placeholder for folders and notes */}
                  <div className="text-center py-12 text-gray-500">
                    <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No content yet</p>
                    <p>Start by adding folders and notes to organize your project knowledge.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
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
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
