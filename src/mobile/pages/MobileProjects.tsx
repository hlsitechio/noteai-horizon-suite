
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
    <div className="h-full w-full bg-background mobile-page">
      <DynamicMobileHeader 
        title="Mobile/Projects"
        rightActions={
          <Button size="sm" className="h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            New
          </Button>
        }
      />
      
      <div className="h-full mobile-content">
        <div className="p-3 space-y-3 pb-20">
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {['all', 'active', 'archived'].map((tab) => (
            <Button
              key={tab}
              variant={filter === tab ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(tab as any)}
              className="flex-1 capitalize text-xs h-7"
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <Folder className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-medium">No projects found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create your first project to get started
            </p>
            <Button className="mt-3 text-xs h-8">
              <Plus className="w-3 h-3 mr-1" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm">{project.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2 text-xs">
                        {project.description}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {/* Status and Progress */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                        <span className="text-xs capitalize text-muted-foreground">
                          {project.status}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        Project
                      </Badge>
                    </div>

                    {/* Project Stats */}
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
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
                          <Badge key={index} variant="secondary" className="text-[10px]">
                            {agent}
                          </Badge>
                        ))}
                        {project.ai_config.agents.length > 3 && (
                          <Badge variant="secondary" className="text-[10px]">
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
        </div>
      </div>
    </div>
  );
};

export default MobileProjects;
