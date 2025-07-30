import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Cloud, Database, FolderPlus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface StorageSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export const StorageSetupModal: React.FC<StorageSetupModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [isSetupRunning, setIsSetupRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: 'wasabi-bucket',
      title: 'Creating Personal Storage',
      description: 'Setting up your private Wasabi cloud storage bucket',
      icon: <Cloud className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'storage-quota',
      title: 'Configuring Storage Quota',
      description: 'Setting up your storage limits and tracking',
      icon: <Database className="h-5 w-5" />,
      status: 'pending'
    },
    {
      id: 'default-workspace',
      title: 'Creating Default Workspace',
      description: 'Setting up your initial dashboard workspace',
      icon: <FolderPlus className="h-5 w-5" />,
      status: 'pending'
    }
  ]);

  const updateStepStatus = (stepIndex: number, status: SetupStep['status']) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const runStorageSetup = async () => {
    setIsSetupRunning(true);
    setProgress(0);
    
    try {
      // Step 1: Create Wasabi bucket
      setCurrentStep(0);
      updateStepStatus(0, 'running');
      setProgress(10);
      
      const { data: bucketResult, error: bucketError } = await supabase.functions.invoke('wasabi-storage', {
        body: { action: 'initialize-user-storage' }
      });
      
      if (bucketError) throw bucketError;
      if (!bucketResult?.success) throw new Error(bucketResult?.error || 'Failed to create bucket');
      
      updateStepStatus(0, 'completed');
      setProgress(40);
      
      // Step 2: Set storage quota
      setCurrentStep(1);
      updateStepStatus(1, 'running');
      
      const { data: quotaResult, error: quotaError } = await supabase.functions.invoke('wasabi-storage', {
        body: { action: 'check-storage-quota' }
      });
      
      if (quotaError) throw quotaError;
      
      updateStepStatus(1, 'completed');
      setProgress(70);
      
      // Step 3: Create default workspace (if not exists)
      setCurrentStep(2);
      updateStepStatus(2, 'running');
      
      const { data: workspaceCheck } = await supabase
        .from('dashboard_workspaces')
        .select('id')
        .eq('is_default', true)
        .single();
      
      if (!workspaceCheck) {
        const { error: workspaceError } = await supabase
          .from('dashboard_workspaces')
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            workspace_name: 'Main Dashboard',
            is_default: true
          });
        
        if (workspaceError) throw workspaceError;
      }
      
      updateStepStatus(2, 'completed');
      setProgress(100);
      
      // Mark initialization as complete
      const { error: initError } = await supabase
        .from('user_storage_initialization')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          wasabi_bucket_created: true,
          wasabi_bucket_name: bucketResult.bucketName,
          default_workspace_created: true,
          storage_quota_set: true,
          initialization_completed: true
        });
      
      if (initError) throw initError;
      
      setSetupComplete(true);
      toast.success('Storage setup completed successfully!');
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        onComplete();
        onClose();
      }, 2000);
      
    } catch (error) {
      logger.auth.error('Storage setup failed:', error);
      updateStepStatus(currentStep, 'error');
      toast.error('Storage setup failed. Please try again.');
    } finally {
      setIsSetupRunning(false);
    }
  };

  // Auto-start setup when modal opens
  useEffect(() => {
    if (isOpen && !isSetupRunning && !setupComplete) {
      // Small delay to show the modal before starting
      setTimeout(runStorageSetup, 500);
    }
  }, [isOpen]);

  const getStepIcon = (step: SetupStep) => {
    switch (step.status) {
      case 'running':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return step.icon;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSetupRunning ? onClose : undefined}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={isSetupRunning ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-primary" />
            Setting Up Your Workspace
          </DialogTitle>
          <DialogDescription>
            We're configuring your personal cloud storage and workspace. This will only take a moment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Setup Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  step.status === 'running' 
                    ? 'bg-primary/5 border-primary/20' 
                    : step.status === 'completed'
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                    : step.status === 'error'
                    ? 'bg-destructive/5 border-destructive/20'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStepIcon(step)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                  {step.status === 'running' && (
                    <div className="text-xs text-primary mt-1">In progress...</div>
                  )}
                  {step.status === 'completed' && (
                    <div className="text-xs text-green-600 dark:text-green-400 mt-1">Completed</div>
                  )}
                  {step.status === 'error' && (
                    <div className="text-xs text-destructive mt-1">Failed</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {setupComplete && (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">All Set!</h3>
              <p className="text-sm text-muted-foreground">
                Your workspace is ready. Redirecting to dashboard...
              </p>
            </div>
          )}
        </div>

        {!isSetupRunning && !setupComplete && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Skip Setup
            </Button>
            <Button onClick={runStorageSetup}>
              Start Setup
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};