import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardComponentRenderer } from './ComponentRegistry';
import { Plus, X, Settings, Save, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelectedComponents } from '@/hooks/useSelectedComponents';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SelectedComponentsAreaProps {
  className?: string;
}

export const SelectedComponentsArea: React.FC<SelectedComponentsAreaProps> = ({ className }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { selectedComponents, removeComponent } = useSelectedComponents();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleRemoveComponent = (componentId: string) => {
    removeComponent(componentId);
  };

  const handleSaveComponents = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save components.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Prepare component data for database
      const componentKeys = selectedComponents.map(comp => comp.componentKey);
      
      // Save to user_preferences
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          dashboard_components: componentKeys,
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        throw error;
      }

      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Dashboard components saved successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error('Failed to save components:', error);
      toast({
        title: "Error",
        description: "Failed to save dashboard components. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMoreComponents = () => {
    navigate('/app/components');
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2"> {/* Reduced padding from pb-3 to pb-2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-base">Selected Components</CardTitle> {/* Reduced font size from text-lg to text-base */}
            <Badge variant="secondary" className="text-xs">
              {selectedComponents.length} items
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddMoreComponents}
              className="flex items-center space-x-1 text-xs"
            >
              <Plus className="h-3 w-3" />
              <span>Add More</span>
            </Button>
            {selectedComponents.length > 0 && (
              <Button 
                onClick={handleSaveComponents}
                disabled={isSaving}
                size="sm"
                className="flex items-center space-x-1 bg-primary hover:bg-primary/90 text-xs"
              >
                {isSaving ? (
                  <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                ) : lastSaved ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Save className="h-3 w-3" />
                )}
                <span>{isSaving ? 'Saving...' : lastSaved ? 'Saved' : 'Save'}</span>
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedComponents.length === 0 ? (
          <div className="text-center py-6"> {/* Reduced padding from py-8 to py-6 */}
            <div className="space-y-2"> {/* Reduced from space-y-3 to space-y-2 */}
              <div className="mx-auto w-10 h-10 bg-muted rounded-full flex items-center justify-center"> {/* Reduced size from w-12 h-12 to w-10 h-10 */}
                <Plus className="h-5 w-5 text-muted-foreground" /> {/* Reduced icon size from h-6 w-6 to h-5 w-5 */}
              </div>
              <div>
                <h3 className="font-medium">No components selected</h3>
                <p className="text-sm text-muted-foreground">
                  Browse the component library to add components here
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleAddMoreComponents}
                className="mt-4"
              >
                Browse Components
              </Button>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[320px]"> {/* Reduced height from 400px to 320px */}
            <div className="space-y-3"> {/* Reduced from space-y-4 to space-y-3 */}
              {selectedComponents.map((component) => (
                <div key={component.id} className="relative">
                  <div className="border-2 border-dashed border-muted rounded-lg p-3 bg-muted/10"> {/* Reduced padding from p-4 to p-3 */}
                    <div className="flex items-start justify-between mb-1.5"> {/* Reduced margin from mb-2 to mb-1.5 */}
                      <div className="flex items-center space-x-1.5"> {/* Reduced spacing from space-x-2 to space-x-1.5 */}
                        <span className="text-sm font-medium">{component.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {new Date(component.addedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveComponent(component.id)}
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="max-w-full mx-auto">
                      <DashboardComponentRenderer componentKey={component.componentKey} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};