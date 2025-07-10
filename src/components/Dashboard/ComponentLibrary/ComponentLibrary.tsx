import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ComponentCard } from './ComponentCard';
import { useComponentLibrary } from './useComponentLibrary';

interface ComponentLibraryProps {
  onAddComponent?: (componentKey: string, panelKey: string) => void;
  availablePanels?: string[];
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ 
  onAddComponent,
  availablePanels = ['topLeft', 'topRight', 'middleLeft', 'middleRight', 'bottomLeft', 'bottomRight']
}) => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    filteredComponents,
    handleAddToPanel,
    categories
  } = useComponentLibrary(availablePanels);

  const onAddToPanel = async (componentKey: string, panelKey: string) => {
    await handleAddToPanel(componentKey, panelKey);
    if (onAddComponent) {
      onAddComponent(componentKey, panelKey);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Component Library</h2>
          <p className="text-muted-foreground">
            Browse and add components to your dashboard panels
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComponents.map((component) => (
          <ComponentCard
            key={component.id}
            component={component}
            availablePanels={availablePanels}
            onAddToPanel={onAddToPanel}
          />
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-12">
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium">No components found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms or category filter
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};