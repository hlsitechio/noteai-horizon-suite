import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, Mail, MessageSquare, User, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const SupportTabContent: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    department: '',
    message: ''
  });

  // Get user info
  const [user, setUser] = React.useState<any>(null);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [workspaceId, setWorkspaceId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(profile);

        // Get default workspace ID
        const { data: workspace } = await supabase
          .from('dashboard_workspaces')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .single();
        setWorkspaceId(workspace?.id || null);
      }
    };

    getUser();
  }, []);

  const departments = [
    { value: 'technical', label: 'Technical Support' },
    { value: 'billing', label: 'Billing & Account' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'general', label: 'General Inquiry' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully.`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.department || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a support request.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Attempting to call edge function with data:', {
        subject: formData.subject,
        department: formData.department,
        message: formData.message,
        userId: user.id,
        workspaceId: workspaceId,
        userEmail: user.email
      });

      const { data, error } = await supabase.functions.invoke('send-support-email', {
        body: {
          subject: formData.subject,
          department: formData.department,
          message: formData.message,
          userId: user.id,
          workspaceId: workspaceId,
          userEmail: user.email
        }
      });

      console.log('Edge function response:', { data, error });

      if (error) {
        console.error('Edge function error details:', error);
        throw error;
      }

      toast({
        title: "Support request submitted",
        description: `Your request has been sent to our support team. Ticket ID: ${data.ticketId?.slice(0, 8)}...`
      });

      // Reset form
      setFormData({
        subject: '',
        department: '',
        message: ''
      });

    } catch (error: any) {
      console.error('Error submitting support request:', error);
      toast({
        title: "Failed to submit request",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Support Center</h3>
        <p className="text-sm text-muted-foreground">
          Get help with your account, report issues, or request new features.
        </p>
      </div>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details for support reference
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">User ID</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {user?.id || 'Not available'}
                </Badge>
                {user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(user.id, 'User ID')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Workspace ID</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-xs">
                  {workspaceId || 'Not available'}
                </Badge>
                {workspaceId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(workspaceId, 'Workspace ID')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Email</Label>
            <Badge variant="outline">
              {user?.email || 'Not available'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Submit Support Request
          </CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={formData.department} 
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please provide detailed information about your issue or request..."
                className="min-h-32"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Submit Support Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Other Ways to Reach Us
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Direct email: </span>
            <Badge variant="outline">info@onlinenote.ai</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            We typically respond within 24 hours during business days.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};