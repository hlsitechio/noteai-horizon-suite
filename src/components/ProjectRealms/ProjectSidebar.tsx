
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Users, FileText, Download, Plus, Trash2, Kanban } from 'lucide-react';
import { ProjectRealm } from '../../types/project';
import { useProjectRealms } from '../../contexts/ProjectRealmsContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProjectSidebarProps {
  project: ProjectRealm;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ project }) => {
  const { updateProject } = useProjectRealms();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAgentsOpen, setIsAgentsOpen] = useState(false);

  const handleProjectSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleManageAgents = () => {
    setIsAgentsOpen(true);
  };

  const handleExportData = async () => {
    try {
      // Create export data object
      const exportData = {
        project: {
          id: project.id,
          title: project.title,
          description: project.description,
          settings: project.settings,
          ai_config: project.ai_config,
          status: project.status,
          created_at: project.created_at,
          updated_at: project.updated_at
        },
        export_date: new Date().toISOString(),
        version: '1.0'
      };

      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success('Project data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export project data');
    }
  };

  const handleAddAgent = async () => {
    try {
      const newAgents = [...project.ai_config.agents, `Agent ${project.ai_config.agents.length + 1}`];
      await updateProject(project.id, {
        ai_config: {
          ...project.ai_config,
          agents: newAgents
        }
      });
      toast.success('Agent added successfully');
    } catch (error) {
      console.error('Failed to add agent:', error);
      toast.error('Failed to add agent');
    }
  };

  const handleRemoveAgent = async (agentIndex: number) => {
    try {
      const newAgents = project.ai_config.agents.filter((_, index) => index !== agentIndex);
      await updateProject(project.id, {
        ai_config: {
          ...project.ai_config,
          agents: newAgents
        }
      });
      toast.success('Agent removed successfully');
    } catch (error) {
      console.error('Failed to remove agent:', error);
      toast.error('Failed to remove agent');
    }
  };

  const handleUpdateProjectStatus = async (newStatus: 'active' | 'archived' | 'hibernating') => {
    try {
      await updateProject(project.id, { status: newStatus });
      toast.success('Project status updated');
      setIsSettingsOpen(false);
    } catch (error) {
      console.error('Failed to update project status:', error);
      toast.error('Failed to update project status');
    }
  };

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
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full justify-start" onClick={handleProjectSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Project Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Project Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Project Status</h4>
                  <div className="flex gap-2">
                    <Button
                      variant={project.status === 'active' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateProjectStatus('active')}
                    >
                      Active
                    </Button>
                    <Button
                      variant={project.status === 'hibernating' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateProjectStatus('hibernating')}
                    >
                      Hibernating
                    </Button>
                    <Button
                      variant={project.status === 'archived' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdateProjectStatus('archived')}
                    >
                      Archived
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">AI Memory Depth</h4>
                  <p className="text-sm text-gray-600">
                    Current: {project.ai_config.memory_depth} interactions
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAgentsOpen} onOpenChange={setIsAgentsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start" onClick={handleManageAgents}>
                <Users className="h-4 w-4 mr-2" />
                Manage Agents
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage AI Agents</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Active Agents</h4>
                  <Button size="sm" onClick={handleAddAgent}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Agent
                  </Button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {project.ai_config.agents.length > 0 ? (
                    project.ai_config.agents.map((agent, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{agent}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">Active</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveAgent(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No agents configured</p>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/app/kanban')}>
            <Kanban className="h-4 w-4 mr-2" />
            Kanban Board
          </Button>

          <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
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
              {project.ai_config.agents.slice(0, 3).map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{agent}</span>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
              ))}
              {project.ai_config.agents.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                  +{project.ai_config.agents.length - 3} more agents
                </p>
              )}
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
