import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Edit3, 
  Trash2, 
  Plus,
  Star,
  Folder,
  Download,
  Upload,
  Settings,
  Eye,
  ArrowLeft,
  Search,
  Calendar,
  Filter,
  ExternalLink
} from 'lucide-react';
import { ActivityService, UserActivity } from '@/services/activityService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const getActivityIcon = (activityType: string) => {
  switch (activityType) {
    case 'note_created': return Plus;
    case 'note_updated': return Edit3;
    case 'note_deleted': return Trash2;
    case 'note_favorited': return Star;
    case 'note_unfavorited': return Star;
    case 'folder_created': return Plus;
    case 'folder_updated': return Edit3;
    case 'folder_deleted': return Trash2;
    case 'export_notes': return Download;
    case 'import_notes': return Upload;
    case 'dashboard_viewed': return Eye;
    case 'settings_updated': return Settings;
    default: return FileText;
  }
};

const getActivityColor = (activityType: string) => {
  switch (activityType) {
    case 'note_created':
    case 'folder_created': return 'bg-green-500';
    case 'note_updated':
    case 'folder_updated': return 'bg-blue-500';
    case 'note_deleted':
    case 'folder_deleted': return 'bg-red-500';
    case 'note_favorited': return 'bg-yellow-500';
    case 'note_unfavorited': return 'bg-gray-500';
    case 'export_notes': return 'bg-purple-500';
    case 'import_notes': return 'bg-orange-500';
    case 'dashboard_viewed': return 'bg-indigo-500';
    case 'settings_updated': return 'bg-teal-500';
    default: return 'bg-gray-500';
  }
};

export function ActivityPage() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const { activities: fetchedActivities, count } = await ActivityService.getUserActivities(
        itemsPerPage,
        offset
      );
      setActivities(fetchedActivities);
      setTotalCount(count);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [currentPage]);

  const filteredActivities = activities.filter(activity =>
    activity.activity_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.activity_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.activity_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activity Log</h1>
              <p className="text-muted-foreground">Track all your actions and activities</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            {totalCount} total activities
          </Badge>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Activities</span>
              <span className="text-sm font-normal text-muted-foreground">
                Showing {filteredActivities.length} of {totalCount} activities
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading activities...</p>
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="space-y-3">
                {filteredActivities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.activity_type);
                  const colorClass = getActivityColor(activity.activity_type);
                  
                  // Determine navigation path based on activity type and entity
                  const getNavigationPath = () => {
                    if (activity.entity_id) {
                      switch (activity.entity_type) {
                        case 'note':
                          return `/app/editor/${activity.entity_id}`;
                        case 'folder':
                          return `/app/folders/${activity.entity_id}`;
                        case 'project':
                          return `/app/projects/${activity.entity_id}`;
                        default:
                          return null;
                      }
                    }
                    
                    // Fallback navigation based on activity type
                    switch (activity.activity_type) {
                      case 'note_created':
                      case 'note_updated':
                      case 'note_deleted':
                      case 'note_favorited':
                      case 'note_unfavorited':
                        return '/app/notes';
                      case 'folder_created':
                      case 'folder_updated':
                      case 'folder_deleted':
                        return '/app/notes';
                      case 'dashboard_viewed':
                        return '/app/dashboard';
                      case 'settings_updated':
                        return '/app/settings';
                      default:
                        return null;
                    }
                  };

                  const navigationPath = getNavigationPath();
                  const isClickable = !!navigationPath;
                  
                  const ActivityContent = () => (
                    <div className="flex items-start space-x-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                      <div className={`p-2 rounded-full ${colorClass}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-medium text-foreground ${isClickable ? 'hover:text-primary cursor-pointer' : ''}`}>
                            {activity.activity_title}
                            {isClickable && activity.entity_id && (
                              <span className="ml-2 text-xs text-primary">→</span>
                            )}
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{format(new Date(activity.created_at), 'MMM d, yyyy')}</span>
                            <span>•</span>
                            <span>{format(new Date(activity.created_at), 'h:mm a')}</span>
                          </div>
                        </div>
                        {activity.activity_description && (
                          <p className="text-sm text-muted-foreground">
                            {activity.activity_description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {activity.activity_type.replace('_', ' ')}
                            </Badge>
                            {activity.entity_type && (
                              <Badge variant="secondary" className="text-xs">
                                {activity.entity_type}
                              </Badge>
                            )}
                          </div>
                          {isClickable && (
                            <div className="text-xs text-primary font-medium">
                              {activity.entity_id ? 'Open' : 'Go to section'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                  
                  return (
                    <div 
                      key={activity.id} 
                      className={isClickable ? 'cursor-pointer' : ''}
                      onClick={() => {
                        if (isClickable && navigationPath) {
                          navigate(navigationPath);
                        }
                      }}
                    >
                      <ActivityContent />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No activities found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No activities match your search criteria." : "Start creating notes to see your activity history."}
                </p>
                {searchTerm && (
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ActivityPage;