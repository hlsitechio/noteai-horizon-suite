
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
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Edge function called for tag generation');
    
    // Check if OpenAI API key is configured
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key is not configured in Supabase secrets' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { title, content } = await req.json();

    console.log('Received request with:', { 
      titleLength: title?.length || 0, 
      contentLength: content?.length || 0 
    });

    if (!title && !content) {
      console.log('No title or content provided');
      return new Response(JSON.stringify({ error: 'Title or content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Combine title and content for analysis
    const textToAnalyze = `Title: ${title || ''}\n\nContent: ${content || ''}`;
    
    // Truncate if too long to avoid token limits
    const truncatedText = textToAnalyze.length > 3000 
      ? textToAnalyze.substring(0, 3000) + '...' 
      : textToAnalyze;

    console.log('Analyzing text of length:', truncatedText.length);

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
            content: `You are a helpful assistant that generates relevant tags for notes. 
            Analyze the provided note content and generate 5-10 descriptive, relevant tags that capture the main topics, themes, and concepts.
            
            Guidelines:
            - Tags should be concise (1-3 words each)
            - Focus on key topics, concepts, and themes
            - Include both specific and general tags
            - Avoid overly generic tags like "note" or "text"
            - Use lowercase
            - Return only the tags as a JSON array of strings
            - No explanations, just the JSON array`
          },
          {
            role: 'user',
            content: truncatedText
          }
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    console.log('Raw AI response:', generatedContent);

    // Parse the JSON response
    let tags: string[] = [];
    try {
      tags = JSON.parse(generatedContent);
      
      // Validate and clean tags
      if (Array.isArray(tags)) {
        tags = tags
          .filter(tag => typeof tag === 'string' && tag.trim().length > 0)
          .map(tag => tag.toLowerCase().trim())
          .slice(0, 10); // Limit to 10 tags max
      } else {
        console.error('AI response is not an array:', tags);
        tags = [];
      }
        
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      
      // Fallback: extract tags from text if JSON parsing fails
      const tagMatches = generatedContent.match(/["']([^"']+)["']/g);
      if (tagMatches) {
        tags = tagMatches
          .map(match => match.replace(/["']/g, '').toLowerCase().trim())
          .filter(tag => tag.length > 0)
          .slice(0, 10);
      }
    }

    console.log('Final generated tags:', tags);

    return new Response(JSON.stringify({ tags }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-note-tags function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate tags',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
