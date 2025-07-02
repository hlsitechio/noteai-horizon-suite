
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

// Simple test data
const fetchTestData = async () => {
  console.log('Fetching test data...');
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  return { message: 'TanStack Query is working!', timestamp: Date.now() };
};

const TanStackQueryTest: React.FC = () => {
  const queryClient = useQueryClient();

  // Test query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['test-query'],
    queryFn: fetchTestData,
  });

  // Test mutation
  const testMutation = useMutation({
    mutationFn: async (input: string) => {
      console.log('Running test mutation with input:', input);
      await new Promise(resolve => setTimeout(resolve, 500));
      return { result: `Mutation completed: ${input}` };
    },
    onSuccess: (data) => {
      console.log('Mutation success:', data);
      // Invalidate the test query to refetch
      queryClient.invalidateQueries({ queryKey: ['test-query'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">TanStack Query Test</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Query Status:</p>
          {isLoading && <p className="text-blue-600">Loading...</p>}
          {error && <p className="text-red-600">Error: {String(error)}</p>}
          {data && (
            <div className="bg-green-50 p-2 rounded">
              <p className="text-green-800">{data.message}</p>
              <p className="text-xs text-green-600">Timestamp: {data.timestamp}</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => refetch()} disabled={isLoading}>
            Refetch Query
          </Button>
          <Button 
            onClick={() => testMutation.mutate('Test input')}
            disabled={testMutation.isPending}
          >
            {testMutation.isPending ? 'Running...' : 'Test Mutation'}
          </Button>
        </div>

        {testMutation.data && (
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-blue-800">{testMutation.data.result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TanStackQueryTest;
