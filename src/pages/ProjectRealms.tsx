
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Filter } from 'lucide-react';
import { useProjectRealms } from '../contexts/ProjectRealmsContext';
import ProjectCard from '../components/ProjectRealms/ProjectCard';
import CreateProjectModal from '../components/ProjectRealms/CreateProjectModal';
import { ProjectRealm } from '../types/project';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';

const ProjectRealms: React.FC = () => {
  const navigate = useNavigate();
  const {
    filteredProjects,
    filters,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    setFilters,
    setCurrentProject
  } = useProjectRealms();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectRealm | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectRealm | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateProject = async (projectData: Omit<ProjectRealm, 'id' | 'created_at' | 'updated_at' | 'last_activity_at' | 'creator_id'>) => {
    await createProject(projectData);
    setIsCreateModalOpen(false);
  };

  const handleEditProject = async (projectData: Omit<ProjectRealm, 'id' | 'created_at' | 'updated_at' | 'last_activity_at' | 'creator_id'>) => {
    if (editingProject) {
      await updateProject(editingProject.id, projectData);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async () => {
    if (deletingProject) {
      await deleteProject(deletingProject.id);
      setDeletingProject(null);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, searchTerm: value });
  };

  const handleStatusFilter = (status: string) => {
    setFilters({
      ...filters,
      status: status === 'all' ? undefined : status as ProjectRealm['status']
    });
  };

  const handleSelectProject = (project: ProjectRealm) => {
    setCurrentProject(project);
    navigate(`/app/projects/${project.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Realms</h1>
            <p className="text-gray-600 mt-2">
              Manage your AI-powered project environments and knowledge spaces
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select onValueChange={handleStatusFilter} defaultValue="all">
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="hibernating">Hibernating</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500 mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8" />
              </div>
              {filters.searchTerm || filters.status ? (
                <p>No projects match your current filters.</p>
              ) : (
                <>
                  <p className="text-lg mb-2">No projects yet</p>
                  <p>Create your first project realm to get started with AI-powered knowledge management.</p>
                </>
              )}
            </div>
            {!filters.searchTerm && !filters.status && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={handleSelectProject}
              onEdit={setEditingProject}
              onDelete={setDeletingProject}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen || !!editingProject}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleEditProject : handleCreateProject}
        initialData={editingProject || undefined}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingProject} onOpenChange={() => setDeletingProject(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProject?.title}"? This action cannot be undone.
              All associated agents, conversations, and knowledge links will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectRealms;
