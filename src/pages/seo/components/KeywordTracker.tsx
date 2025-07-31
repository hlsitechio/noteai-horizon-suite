import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, TrendingUp, TrendingDown, Minus, Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SEOKeyword {
  id: string;
  keyword: string;
  target_url: string;
  current_position: number | null;
  previous_position: number | null;
  search_volume: string | null;
  difficulty: string | null;
  traffic: string | null;
  last_checked: string;
}

export const KeywordTracker: React.FC = () => {
  const { user } = useAuth();
  const [newKeyword, setNewKeyword] = useState('');
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [bulkKeywords, setBulkKeywords] = useState('');
  const [bulkTargetUrl, setBulkTargetUrl] = useState('/');
  const [keywords, setKeywords] = useState<SEOKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [bulkImporting, setBulkImporting] = useState(false);

  const fetchKeywords = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('seo_keywords')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setKeywords(data || []);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      toast.error('Failed to fetch keywords');
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = async () => {
    if (!user || !newKeyword.trim() || !newTargetUrl.trim()) return;

    setAdding(true);
    try {
      const { data, error } = await supabase
        .from('seo_keywords')
        .insert({
          user_id: user.id,
          keyword: newKeyword.trim(),
          target_url: newTargetUrl.trim(),
          current_position: null,
          previous_position: null,
          search_volume: null,
          difficulty: 'Medium',
          traffic: null
        })
        .select()
        .single();

      if (error) throw error;

      setKeywords(prev => [data, ...prev]);
      setNewKeyword('');
      setNewTargetUrl('');
      toast.success('Keyword added successfully');
    } catch (error) {
      console.error('Error adding keyword:', error);
      toast.error('Failed to add keyword');
    } finally {
      setAdding(false);
    }
  };

  const bulkImportKeywords = async () => {
    if (!user || !bulkKeywords.trim() || !bulkTargetUrl.trim()) return;

    setBulkImporting(true);
    try {
      // Parse keywords - split by lines and filter out empty lines
      const keywordList = bulkKeywords
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(keyword => ({
          user_id: user.id,
          keyword,
          target_url: bulkTargetUrl.trim(),
          current_position: null,
          previous_position: null,
          search_volume: null,
          difficulty: 'Medium',
          traffic: null
        }));

      if (keywordList.length === 0) {
        toast.error('Please enter at least one keyword');
        return;
      }

      const { data, error } = await supabase
        .from('seo_keywords')
        .insert(keywordList)
        .select();

      if (error) throw error;

      setKeywords(prev => [...(data || []), ...prev]);
      setBulkKeywords('');
      setBulkTargetUrl('/');
      toast.success(`Successfully imported ${keywordList.length} keywords`);
    } catch (error) {
      console.error('Error bulk importing keywords:', error);
      toast.error('Failed to import keywords');
    } finally {
      setBulkImporting(false);
    }
  };

  const deleteKeyword = async (id: string) => {
    try {
      const { error } = await supabase
        .from('seo_keywords')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setKeywords(prev => prev.filter(k => k.id !== id));
      toast.success('Keyword deleted');
    } catch (error) {
      console.error('Error deleting keyword:', error);
      toast.error('Failed to delete keyword');
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, [user]);

  const getTrendIcon = (current: number | null, previous: number | null) => {
    if (!current || !previous) return <Minus className="h-4 w-4 text-gray-500" />;
    if (current < previous) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current > previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Keyword</CardTitle>
          <CardDescription>Track a new keyword's ranking performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter keyword to track..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Target URL (e.g., /features)"
                value={newTargetUrl}
                onChange={(e) => setNewTargetUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={addKeyword}
                disabled={adding || !newKeyword.trim() || !newTargetUrl.trim()}
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Add Keyword
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bulk Import Keywords</CardTitle>
          <CardDescription>Import multiple keywords at once - paste one keyword per line</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Textarea
                  placeholder="AI note-taking app&#10;AI note-taking&#10;AI note taker&#10;Note-taking app&#10;Online note-taking tool&#10;..."
                  value={bulkKeywords}
                  onChange={(e) => setBulkKeywords(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Target URL (e.g., /)"
                  value={bulkTargetUrl}
                  onChange={(e) => setBulkTargetUrl(e.target.value)}
                />
                <Button 
                  onClick={bulkImportKeywords}
                  disabled={bulkImporting || !bulkKeywords.trim() || !bulkTargetUrl.trim()}
                  className="w-full"
                >
                  {bulkImporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Import Keywords
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracked Keywords ({keywords.length})</CardTitle>
          <CardDescription>Monitor your keyword rankings and performance</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading keywords...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Keyword</th>
                    <th className="text-left py-3 px-2">Position</th>
                    <th className="text-left py-3 px-2">Trend</th>
                    <th className="text-left py-3 px-2">Search Volume</th>
                    <th className="text-left py-3 px-2">Difficulty</th>
                    <th className="text-left py-3 px-2">Traffic</th>
                    <th className="text-left py-3 px-2">Landing Page</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No keywords tracked yet. Add your first keyword above.
                      </td>
                    </tr>
                  ) : (
                    keywords.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.keyword}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {item.current_position ? (
                            <Badge variant="outline">#{item.current_position}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not ranked</span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            {getTrendIcon(item.current_position, item.previous_position)}
                            <span className="text-sm text-muted-foreground">
                              {item.current_position && item.previous_position 
                                ? Math.abs(item.current_position - item.previous_position)
                                : '-'
                              }
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2">{item.search_volume || '-'}</td>
                        <td className="py-3 px-2">
                          {item.difficulty ? (
                            <Badge className={getDifficultyColor(item.difficulty)}>
                              {item.difficulty}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </td>
                        <td className="py-3 px-2">{item.traffic || '-'}</td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-muted-foreground">{item.target_url}</span>
                        </td>
                        <td className="py-3 px-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteKeyword(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};