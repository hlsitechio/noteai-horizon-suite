import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Send } from 'lucide-react';

const DeepSeekChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const { data, error } = await supabase.functions.invoke('chat-openrouter', {
        body: {
          messages: [
            {
              role: 'user',
              content: input
            }
          ],
          model: 'moonshotai/kimi-k2'
        }
      });

      if (error) {
        console.error('Error calling DeepSeek:', error);
        setResponse(`Error: ${error.message}`);
      } else {
        setResponse(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Kimi AI Chat</span>
          <span className="text-sm text-muted-foreground">(K2 Model)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Kimi anything..."
            className="min-h-[100px]"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>

        {response && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Response:</h3>
            <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
              {response}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeepSeekChat;