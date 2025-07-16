import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface SearchFilterProps {
  title?: string;
  data?: Array<{ id: string; name: string; category: string; status: string; }>;
  categories?: string[];
  statuses?: string[];
  onFilter?: (filteredData: any[]) => void;
}

const defaultData = [
  { id: '1', name: 'Project Alpha', category: 'Development', status: 'Active' },
  { id: '2', name: 'Marketing Campaign', category: 'Marketing', status: 'Completed' },
  { id: '3', name: 'User Research', category: 'Research', status: 'In Progress' },
  { id: '4', name: 'Design System', category: 'Design', status: 'Active' },
  { id: '5', name: 'Beta Testing', category: 'Development', status: 'In Progress' }
];

export const SearchFilterWidget: React.FC<SearchFilterProps> = ({
  title = "Search & Filter",
  data = defaultData,
  categories = ['All', 'Development', 'Marketing', 'Research', 'Design'],
  statuses = ['All', 'Active', 'In Progress', 'Completed'],
  onFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);

  const filteredData = useMemo(() => {
    let filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (selectedStatus !== 'All') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    return filtered;
  }, [data, searchTerm, selectedCategory, selectedStatus]);

  const handleAddFilter = (type: string, value: string) => {
    const filterId = `${type}-${value}`;
    if (!activeFilters.find(f => f.id === filterId)) {
      const newFilter = { id: filterId, label: `${type}: ${value}`, value };
      setActiveFilters(prev => [...prev, newFilter]);
    }
  };

  const handleRemoveFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
    // Reset corresponding select if needed
    const filter = activeFilters.find(f => f.id === filterId);
    if (filter?.id.startsWith('category-')) {
      setSelectedCategory('All');
    } else if (filter?.id.startsWith('status-')) {
      setSelectedStatus('All');
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setActiveFilters([]);
  };

  React.useEffect(() => {
    if (onFilter) {
      onFilter(filteredData);
    }
  }, [filteredData, onFilter]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Search className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activeFilters.map(filter => (
              <Badge key={filter.id} variant="secondary" className="text-xs">
                {filter.label}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleRemoveFilter(filter.id)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
            </span>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredData.map(item => (
              <div key={item.id} className="p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};