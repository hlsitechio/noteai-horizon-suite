import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Cloud, 
  HardDrive, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Zap,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { toast } from 'sonner';

interface StorageQuota {
  id: string;
  bucketName: string;
  totalQuotaMb: number;
  usedStorageMb: number;
  lastQuotaCheck: string | null;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
}

interface StorageIndicatorProps {
  variant?: 'full' | 'compact';
  showUpgrade?: boolean;
}

export const StorageIndicator: React.FC<StorageIndicatorProps> = ({ 
  variant = 'full',
  showUpgrade = true 
}) => {
  const { user } = useAuth();
  const [storageData, setStorageData] = useState<StorageQuota | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchStorageData();
    }
  }, [user]);

  const fetchStorageData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('user_storage_quotas')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && (error as any)?.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        // Map database column names to interface
        const mappedData: StorageQuota = {
          id: data.id,
          bucketName: data.bucket_name,
          totalQuotaMb: data.total_quota_mb,
          usedStorageMb: data.used_storage_mb,
          lastQuotaCheck: data.last_quota_check,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          userId: data.user_id
        };
        setStorageData(mappedData);
      } else {
        // No quota record found, create one
        const { error: createError } = await supabase
          .from('user_storage_quotas')
          .insert({
            user_id: user?.id,
            bucket_name: `user-${user?.id}-private`,
            total_quota_mb: 1024, // 1GB default
            used_storage_mb: 0
          });

        if (createError) throw createError;
        
        // Fetch again after creation
        await fetchStorageData();
        return;
      }
    } catch (error) {
      console.error('Error fetching storage data:', error);
      setError('Failed to load storage information');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshQuota = async () => {
    try {
      // Storage quota refresh functionality disabled
      toast.info('Storage quota refresh temporarily disabled');
    } catch (error) {
      toast.error('Failed to update storage quota');
    }
  };

  if (isLoading) {
    return (
      <Card className={variant === 'compact' ? 'p-4' : ''}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (error || !storageData) {
    return (
      <Card className={variant === 'compact' ? 'p-4' : ''}>
        <CardContent className="py-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || 'No storage data available'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const usagePercentage = (storageData.usedStorageMb / storageData.totalQuotaMb) * 100;
  const remainingMb = storageData.totalQuotaMb - storageData.usedStorageMb;
  const isNearLimit = usagePercentage > 80;
  const isAtLimit = usagePercentage >= 95;

  const formatSize = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  const getStatusColor = () => {
    if (isAtLimit) return 'text-destructive';
    if (isNearLimit) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (isAtLimit) return <AlertTriangle className="h-4 w-4 text-destructive" />;
    if (isNearLimit) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  if (variant === 'compact') {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Storage</span>
              {getStatusIcon()}
            </div>
            <Badge variant={isAtLimit ? 'destructive' : isNearLimit ? 'default' : 'secondary'}>
              {usagePercentage.toFixed(0)}%
            </Badge>
          </div>
          
          <Progress 
            value={usagePercentage} 
            className="mb-2 h-2" 
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatSize(storageData.usedStorageMb)} used</span>
            <span>{formatSize(remainingMb)} free</span>
          </div>

          {showUpgrade && isNearLimit && (
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-3"
              onClick={() => window.open('mailto:support@example.com?subject=Storage Upgrade Request', '_blank')}
            >
              <Zap className="h-3 w-3 mr-1" />
              Upgrade
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-primary" />
          Cloud Storage
          {getStatusIcon()}
        </CardTitle>
        <CardDescription>
          Monitor your storage usage and manage your quota
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Usage Overview */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Storage Usage</span>
            <Badge variant={isAtLimit ? 'destructive' : isNearLimit ? 'default' : 'secondary'}>
              {formatSize(storageData.usedStorageMb)} / {formatSize(storageData.totalQuotaMb)}
            </Badge>
          </div>

          <Progress 
            value={usagePercentage} 
            className="h-3" 
          />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {formatSize(storageData.usedStorageMb)}
              </div>
              <div className="text-xs text-muted-foreground">Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {formatSize(remainingMb)}
              </div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {usagePercentage.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Full</div>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {isAtLimit && (
          <Alert className="border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Storage Full:</strong> You've reached your storage limit. Please upgrade or delete some files.
            </AlertDescription>
          </Alert>
        )}

        {isNearLimit && !isAtLimit && (
          <Alert className="border-orange-500">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Storage Warning:</strong> You're running low on storage space. Consider upgrading soon.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshQuota}
            className="flex-1"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Usage
          </Button>
          
          {showUpgrade && (
            <Button 
              size="sm"
              className="flex-1"
              onClick={() => window.open('mailto:support@example.com?subject=Storage Upgrade Request', '_blank')}
            >
              <Zap className="h-4 w-4 mr-2" />
              Upgrade Storage
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>

        {/* Storage Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Bucket: {storageData.bucketName}</div>
          <div>Last updated: {new Date(storageData.lastQuotaCheck || Date.now()).toLocaleString()}</div>
        </div>
      </CardContent>
    </Card>
  );
};