
import React, { useState, useEffect } from 'react';
import { Book, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useOptimizedNotes } from '@/contexts/OptimizedNotesContext';
import { UserPreferencesService, UserPreferences } from '@/services/userPreferencesService';
import { ActivityService } from '@/services/activityService';
import { toast } from 'sonner';
import { format } from 'date-fns';

const DataExportSection: React.FC = () => {
  const { notes } = useOptimizedNotes();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const userPrefs = await UserPreferencesService.getUserPreferences();
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Failed to load data preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (updates: Partial<UserPreferences>) => {
    if (!preferences) return;

    try {
      const updatedPrefs = await UserPreferencesService.updateUserPreferences(updates);
      if (updatedPrefs) {
        setPreferences(updatedPrefs);
        
        // Log activity
        await ActivityService.logActivity({
          activity_type: ActivityService.ActivityTypes.SETTINGS_UPDATED,
          activity_title: 'Updated data settings',
          activity_description: `Changed: ${Object.keys(updates).join(', ')}`,
          metadata: updates
        });
        
        toast.success('Data settings updated successfully');
      } else {
        toast.error('Failed to update data settings');
      }
    } catch (error) {
      console.error('Failed to update data preference:', error);
      toast.error('Failed to update data settings');
    }
  };

  const handleExportNotes = async () => {
    if (notes.length === 0) {
      toast.error('No notes to export');
      return;
    }

    setIsExporting(true);
    try {
      // Create comprehensive export data
      const exportData = {
        export_info: {
          exported_at: new Date().toISOString(),
          total_notes: notes.length,
          export_format: 'complete_json',
          app_version: '1.0.0'
        },
        notes: notes.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          category: note.category,
          tags: note.tags,
          isFavorite: note.isFavorite,
          createdAt: note.createdAt,
          updatedAt: note.updatedAt
        })),
        statistics: {
          total_notes: notes.length,
          favorite_notes: notes.filter(n => n.isFavorite).length,
          categories: [...new Set(notes.map(n => n.category))],
          all_tags: [...new Set(notes.flatMap(n => n.tags))]
        }
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `notes-complete-export-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Log export activity
      await ActivityService.logActivity({
        activity_type: ActivityService.ActivityTypes.EXPORT_NOTES,
        activity_title: 'Exported complete data',
        activity_description: `Exported ${notes.length} notes with complete metadata`,
        metadata: { 
          export_format: 'complete_json',
          notes_count: notes.length,
          export_size: blob.size
        }
      });

      toast.success(`Successfully exported ${notes.length} notes with complete data`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export notes');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Data & Export</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Export Notes</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download all your notes ({notes.length} notes) with complete metadata
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleExportNotes}
                disabled={isExporting || notes.length === 0}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </>
                )}
              </Button>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Backup to Cloud</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically backup your data</p>
              </div>
              <Switch 
                checked={preferences?.backup_to_cloud_enabled ?? true}
                onCheckedChange={(checked) => updatePreference({ backup_to_cloud_enabled: checked })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExportSection;
