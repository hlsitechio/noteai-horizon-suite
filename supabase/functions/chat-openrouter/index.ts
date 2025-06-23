
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
    const { messages, model = "deepseek/deepseek-r1-0528:free", response_format } = await req.json();

    console.log('Chat request received:', { 
      messagesCount: messages.length, 
      model,
      hasStructuredOutput: !!response_format 
    });

    if (!openRouterApiKey) {
      console.error('OPENROUTER_API_KEY not configured');
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    console.log('Making request to OpenRouter API...');
    
    const requestBody: any = {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    };

    // Add structured output format if provided
    if (response_format) {
      requestBody.response_format = response_format;
      console.log('Using structured output with schema:', JSON.stringify(response_format, null, 2));
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Lovable Notes App',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('OpenRouter API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Open Router API error:', { 
        status: response.status, 
        statusText: response.statusText,
        errorText 
      });
      
      // Check for specific error types
      if (response.status === 401) {
        throw new Error('Invalid API key or unauthorized access');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (response.status === 402) {
        throw new Error('Insufficient credits or payment required');
      } else {
        throw new Error(`Open Router API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('OpenRouter API response data structure:', {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      model: data.model,
      isStructuredOutput: !!response_format
    });
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure from OpenRouter:', data);
      throw new Error('Invalid response from Open Router API');
    }

    console.log('Chat response generated successfully');

    return new Response(JSON.stringify({ 
      message: data.choices[0].message.content,
      model: data.model || model,
      usage: data.usage,
      structured: !!response_format
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-openrouter function:', error);
    
    // Return a more specific error message
    let errorMessage = 'Unknown error occurred';
    let statusCode = 500;
    
    if (error.message?.includes('API key')) {
      errorMessage = 'API key configuration error';
      statusCode = 401;
    } else if (error.message?.includes('Rate limit')) {
      errorMessage = 'Rate limit exceeded';
      statusCode = 429;
    } else if (error.message?.includes('credits') || error.message?.includes('payment')) {
      errorMessage = 'Insufficient credits';
      statusCode = 402;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: 'Please check the function logs for more information'
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
