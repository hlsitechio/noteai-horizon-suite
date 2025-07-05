import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('AI Writing Assistant request received');

    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not configured');
      throw new Error('OpenAI API key not configured');
    }

    const { action, text, targetLanguage, tone, length } = await req.json();
    
    if (!action || !text) {
      throw new Error('Action type and text are required');
    }

    console.log('Processing action:', action);

    const prompts = {
      'improve_text': `Please improve the following text by making it clearer, more engaging, and better structured while maintaining its original meaning:

${text}

Return only the improved text.`,

      'summarize_text': `Please ${length === 'short' ? 'briefly' : length === 'long' ? 'thoroughly' : ''} summarize the following text:

${text}

Return only the summary.`,

      'translate_text': `Please translate the following text to ${targetLanguage || 'English'}:

${text}

Return only the translated text.`,

      'check_grammar': `Please check and correct any grammar, spelling, and punctuation errors in the following text:

${text}

Return the corrected text with explanations for any major changes made.`,

      'adjust_tone': `Please adjust the tone of the following text to be more ${tone || 'professional'}:

${text}

Return only the text with the adjusted tone.`,

      'expand_content': `Please expand the following text by adding more detail, examples, and context while maintaining the original message:

${text}

Return only the expanded text.`,

      'extract_keywords': `Please extract the most important keywords and key phrases from the following text:

${text}

Return the keywords as a comma-separated list.`
    };

    const prompt = prompts[action as keyof typeof prompts];
    if (!prompt) {
      throw new Error(`Unknown action: ${action}`);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional writing assistant. Provide high-quality, helpful responses that directly address the user\'s request. Be concise and focused.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const processedText = result.choices[0].message.content;

    console.log('Writing assistant processing successful');

    return new Response(
      JSON.stringify({ 
        result: processedText,
        action: action,
        originalText: text.substring(0, 100) + (text.length > 100 ? '...' : '')
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in ai-writing-assistant function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});