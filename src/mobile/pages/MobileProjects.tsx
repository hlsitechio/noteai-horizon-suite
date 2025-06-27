
import React, { useState } from 'react';
import { Plus, Folder, Calendar, Users, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProjectRealms } from '../../contexts/ProjectRealmsContext';
import DynamicMobileHeader from '../components/DynamicMobileHeader';

const MobileProjects: React.FC = () => {
  const { projects } = useProjectRealms();
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all');

  const filteredProjects = projects.filter(project => {
    if (filter === 'active') return project.status === 'active';
    if (filter === 'archived') return project.status === 'archived';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'archived': return 'bg-blue-500';
      case 'hibernating': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      <DynamicMobileHeader 
        title="Projects"
        rightActions={
          <Button size="sm" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        }
      />
      
      <div className="p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex space-x-2 bg-muted p-1 rounded-lg">
          {['all', 'active', 'archived'].map((tab) => (
            <Button
              key={tab}
              variant={filter === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(tab as any)}
              className="flex-1 capitalize"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No projects found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first project to get started
            </p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{project.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Status and Progress */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                        <span className="text-sm capitalize text-muted-foreground">
                          {project.status}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Project
                      </Badge>
                    </div>

                    {/* Project Stats */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>1 member</span>
                      </div>
                    </div>

                    {/* AI Agents Info */}
                    {project.ai_config?.agents && project.ai_config.agents.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.ai_config.agents.slice(0, 3).map((agent, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {agent}
                          </Badge>
                        ))}
                        {project.ai_config.agents.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{project.ai_config.agents.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-20" />
      </div>
    </div>
  );
};

export default MobileProjects;
