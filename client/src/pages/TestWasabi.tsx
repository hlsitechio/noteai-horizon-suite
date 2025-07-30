import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { WasabiStorageService } from '@/services/wasabiStorageService';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TestWasabi() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const initializeBucket = async () => {
    try {
      setIsLoading(true);
      const response = await WasabiStorageService.initializeUserStorage();
      setResult(response);
      
      if (response.success) {
        toast.success("Bucket created successfully!");
      } else {
        toast.error(`Failed to create bucket: ${response.error}`);
      }
    } catch (error) {
      console.error("Error initializing Wasabi storage:", error);
      toast.error("Failed to initialize storage");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Wasabi Storage Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Initialize User Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={initializeBucket}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create User Bucket"}
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