import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Copy, 
  Globe, 
  Eye, 
  Activity, 
  Users, 
  MousePointer,
  Clock,
  TrendingUp,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type WebsiteConfigRow = Database['public']['Tables']['seo_website_configs']['Row'];

interface WebsiteConfig {
  id?: string;
  website_domain: string;
  website_name: string;
  tracking_enabled: boolean;
  widget_settings: any;
  goals: any[];
}

interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  avgTimeOnSite: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number }>;
  deviceTypes: Array<{ type: string; count: number }>;
  activeSessions: number;
}

const VisitorTrackingWidget: React.FC = () => {
  const [websiteConfigs, setWebsiteConfigs] = useState<WebsiteConfig[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteConfig | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [newWebsite, setNewWebsite] = useState({
    domain: '',
    name: '',
  });

  useEffect(() => {
    fetchWebsiteConfigs();
  }, []);

  const fetchWebsiteConfigs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('seo_website_configs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform database rows to our interface
      const configs: WebsiteConfig[] = (data || []).map(row => ({
        id: row.id,
        website_domain: row.website_domain,
        website_name: row.website_name,
        tracking_enabled: row.tracking_enabled,
        widget_settings: row.widget_settings,
        goals: Array.isArray(row.goals) ? row.goals : []
      }));
      
      setWebsiteConfigs(configs);
      
      if (configs.length > 0 && !selectedWebsite) {
        setSelectedWebsite(configs[0]);
        fetchAnalytics(configs[0]);
      }
    } catch (error) {
      console.error('Error fetching website configs:', error);
      toast.error('Failed to load website configurations');
    }
  };

  const fetchAnalytics = async (website: WebsiteConfig) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await supabase.functions.invoke('track-visitor', {
        body: JSON.stringify({
          method: 'GET',
          userId: user.id,
          websiteDomain: website.website_domain,
          days: 30
        })
      });

      if (response.error) throw response.error;

      const { analytics, activeSessions } = response.data;
      
      // Process analytics data
      const totalVisitors = new Set(analytics.map((a: any) => a.visitor_id)).size;
      const totalPageViews = analytics.length;
      const avgTimeOnSite = analytics.reduce((acc: number, a: any) => acc + (a.time_on_page || 0), 0) / analytics.length;
      const bounceRate = analytics.filter((a: any) => a.bounce_rate).length / analytics.length;

      // Top pages
      const pageViews: { [key: string]: number } = {};
      analytics.forEach((a: any) => {
        pageViews[a.page_path] = (pageViews[a.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageViews)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Device types
      const deviceCounts: { [key: string]: number } = {};
      analytics.forEach((a: any) => {
        deviceCounts[a.device_type] = (deviceCounts[a.device_type] || 0) + 1;
      });
      const deviceTypes = Object.entries(deviceCounts)
        .map(([type, count]) => ({ type, count }));

      setAnalyticsData({
        totalVisitors,
        totalPageViews,
        avgTimeOnSite: Math.round(avgTimeOnSite),
        bounceRate: Math.round(bounceRate * 100),
        topPages,
        deviceTypes,
        activeSessions: activeSessions?.length || 0
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const addWebsite = async () => {
    if (!newWebsite.domain || !newWebsite.name) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const websiteConfig: WebsiteConfig = {
        website_domain: newWebsite.domain,
        website_name: newWebsite.name,
        tracking_enabled: true,
        widget_settings: {},
        goals: []
      };

      const { data, error } = await supabase
        .from('seo_website_configs')
        .insert({
          user_id: user.id,
          ...websiteConfig
        })
        .select()
        .single();

      if (error) throw error;

      // Transform the new row to our interface
      const newConfig: WebsiteConfig = {
        id: data.id,
        website_domain: data.website_domain,
        website_name: data.website_name,
        tracking_enabled: data.tracking_enabled,
        widget_settings: data.widget_settings,
        goals: Array.isArray(data.goals) ? data.goals : []
      };

      setWebsiteConfigs([newConfig, ...websiteConfigs]);
      setNewWebsite({ domain: '', name: '' });
      toast.success('Website added successfully');
    } catch (error) {
      console.error('Error adding website:', error);
      toast.error('Failed to add website');
    }
  };

  const toggleTracking = async (website: WebsiteConfig) => {
    try {
      const { error } = await supabase
        .from('seo_website_configs')
        .update({ tracking_enabled: !website.tracking_enabled })
        .eq('id', website.id);

      if (error) throw error;

      setWebsiteConfigs(configs => 
        configs.map(config => 
          config.id === website.id 
            ? { ...config, tracking_enabled: !config.tracking_enabled }
            : config
        )
      );

      if (selectedWebsite?.id === website.id) {
        setSelectedWebsite({ ...selectedWebsite, tracking_enabled: !selectedWebsite.tracking_enabled });
      }

      toast.success('Tracking settings updated');
    } catch (error) {
      console.error('Error updating tracking:', error);
      toast.error('Failed to update tracking settings');
    }
  };

  const generateTrackingCode = (websiteDomain: string) => {
    return `<!-- OnlineNote AI Visitor Tracking Widget -->
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://ubxtmbgvibtjtjggjnjm.supabase.co/functions/v1/visitor-widget.js';
  script.async = true;
  script.onload = function() {
    OnlineNoteTracker.init({
      domain: '${websiteDomain}',
      trackPageViews: true,
      trackEvents: true,
      trackSessions: true
    });
  };
  document.head.appendChild(script);
})();
</script>`;
  };

  const copyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Tracking code copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Website Visitor Tracking
          </CardTitle>
          <CardDescription>
            Monitor and analyze your website visitors with real-time analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="websites">Websites</TabsTrigger>
              <TabsTrigger value="tracking-code">Tracking Code</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {selectedWebsite && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{selectedWebsite.website_name}</h3>
                    <Badge variant={selectedWebsite.tracking_enabled ? "default" : "secondary"}>
                      {selectedWebsite.tracking_enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {analyticsData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                              <p className="text-2xl font-bold">{analyticsData.totalVisitors}</p>
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                              <p className="text-2xl font-bold">{analyticsData.totalPageViews}</p>
                            </div>
                            <MousePointer className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Avg. Time on Site</p>
                              <p className="text-2xl font-bold">{analyticsData.avgTimeOnSite}s</p>
                            </div>
                            <Clock className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                              <p className="text-2xl font-bold text-green-600">{analyticsData.activeSessions}</p>
                            </div>
                            <Activity className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {analyticsData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Top Pages</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analyticsData.topPages.map((page, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm truncate">{page.page}</span>
                                <Badge variant="secondary">{page.views} views</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Device Types</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analyticsData.deviceTypes.map((device, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm capitalize">{device.type}</span>
                                <Badge variant="secondary">{device.count} visits</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="websites" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Website</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="domain">Domain</Label>
                      <Input
                        id="domain"
                        placeholder="example.com"
                        value={newWebsite.domain}
                        onChange={(e) => setNewWebsite({ ...newWebsite, domain: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Website Name</Label>
                      <Input
                        id="name"
                        placeholder="My Website"
                        value={newWebsite.name}
                        onChange={(e) => setNewWebsite({ ...newWebsite, name: e.target.value })}
                      />
                    </div>
                    <Button onClick={addWebsite} className="w-full">
                      Add Website
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Websites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {websiteConfigs.map((website) => (
                        <div key={website.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{website.website_name}</p>
                            <p className="text-sm text-muted-foreground">{website.website_domain}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={website.tracking_enabled}
                              onCheckedChange={() => toggleTracking(website)}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedWebsite(website);
                                fetchAnalytics(website);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tracking-code" className="space-y-4">
              {selectedWebsite && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Tracking Code for {selectedWebsite.website_name}
                    </CardTitle>
                    <CardDescription>
                      Copy and paste this code into your website's HTML head section
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={generateTrackingCode(selectedWebsite.website_domain)}
                        className="min-h-[200px] font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyTrackingCode(generateTrackingCode(selectedWebsite.website_domain))}
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tracking Settings</CardTitle>
                  <CardDescription>
                    Configure what data to track and how to track it
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced tracking settings will be available in future updates.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorTrackingWidget;