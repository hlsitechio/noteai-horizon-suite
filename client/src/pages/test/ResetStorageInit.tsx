import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

export default function ResetStorageInit() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const resetUserStorage = async () => {
    try {
      setIsLoading(true);
      
      // First, delete any existing initialization record for this user
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error("No user found");
        return;
      }

      console.log("Resetting storage for user:", user.user.id);

      // Delete existing initialization record
      const { error: deleteError } = await supabase
        .from('user_storage_initialization')
        .delete()
        .eq('user_id', user.user.id);

      if (deleteError) {
        console.error("Error deleting existing record:", deleteError);
      }

      // Delete existing quota record
      const { error: quotaDeleteError } = await supabase
        .from('user_storage_quotas')
        .delete()
        .eq('user_id', user.user.id);

      if (quotaDeleteError) {
        console.error("Error deleting quota record:", quotaDeleteError);
      }

      // Now call the initialization function
      const { data, error } = await supabase.functions.invoke('initialize-user-storage', {
        body: { action: 'initialize-user-storage' }
      });

      if (error) {
        throw error;
      }

      setResult(data);
      
      if (data.success) {
        toast.success("Storage reset and reinitialized successfully!");
      } else {
        toast.error(`Failed to reinitialize storage: ${data.error}`);
      }

    } catch (error) {
      console.error("Error resetting storage:", error);
      toast.error("Failed to reset storage");
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const checkStorageStatus = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('initialize-user-storage', {
        body: { action: 'check-status' }
      });

      if (error) {
        throw error;
      }

      setResult(data);
      toast.success("Status checked successfully");

    } catch (error) {
      console.error("Error checking status:", error);
      toast.error("Failed to check status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Reset Storage Initialization</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Storage Reset & Reinitialization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={checkStorageStatus}
            disabled={isLoading}
            variant="outline"
          >
            Check Current Status
          </Button>

          <Button 
            onClick={resetUserStorage}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Reset & Reinitialize Storage"}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-card border rounded-md">
              <h3 className="text-lg font-medium mb-2">Result:</h3>
              <pre className="whitespace-pre-wrap text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}