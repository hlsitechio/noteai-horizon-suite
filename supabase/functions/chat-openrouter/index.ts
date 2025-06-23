
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model = "meta-llama/llama-3.1-8b-instruct:free" } = await req.json();

    console.log('Chat request received:', { messagesCount: messages.length, model });

    if (!openRouterApiKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Lovable Notes App',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Open Router API error:', errorText);
      throw new Error(`Open Router API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from Open Router API');
    }

    console.log('Chat response generated successfully');

    return new Response(JSON.stringify({ 
      message: data.choices[0].message.content,
      model: data.model || model,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-openrouter function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      details: 'Please check your API key configuration'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
