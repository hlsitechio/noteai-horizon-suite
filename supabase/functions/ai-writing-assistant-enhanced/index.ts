import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      mode, 
      content, 
      context = '', 
      tone = 'professional', 
      length = 'medium',
      selectedText = '',
      cursorPosition = 0
    } = await req.json();

    console.log(`AI Writing Assistant - Mode: ${mode}, Content length: ${content?.length || 0}`);

    let systemPrompt = '';
    let userPrompt = '';

    switch (mode) {
      case 'continue':
        systemPrompt = `You are an advanced AI writing assistant. Continue the writing in a natural, coherent way that matches the existing tone and style. Keep the ${tone} tone and provide ${length} length continuation.`;
        userPrompt = `Continue this text naturally:\n\n${content}`;
        break;

      case 'enhance':
        systemPrompt = `You are an expert editor. Improve the selected text while maintaining its meaning. Make it more engaging, clear, and ${tone}. Preserve the original intent.`;
        userPrompt = `Enhance this text:\n\n${selectedText || content}`;
        break;

      case 'summarize':
        systemPrompt = `You are a skilled summarizer. Create a concise, well-structured summary that captures the key points and main ideas.`;
        userPrompt = `Summarize this content:\n\n${content}`;
        break;

      case 'expand':
        systemPrompt = `You are a content expansion specialist. Take the given text and expand it with relevant details, examples, and explanations while maintaining coherence.`;
        userPrompt = `Expand on this text with more details:\n\n${selectedText || content}`;
        break;

      case 'rewrite':
        systemPrompt = `You are a rewriting expert. Rewrite the content in a ${tone} tone while preserving the core message and information.`;
        userPrompt = `Rewrite this text in a ${tone} tone:\n\n${selectedText || content}`;
        break;

      case 'grammar':
        systemPrompt = `You are a grammar and style expert. Fix grammar, spelling, punctuation, and improve readability while maintaining the original meaning and tone.`;
        userPrompt = `Fix grammar and improve this text:\n\n${content}`;
        break;

      case 'suggest':
        systemPrompt = `You are a writing coach. Analyze the content and provide 3-5 specific, actionable suggestions to improve clarity, engagement, and effectiveness.`;
        userPrompt = `Provide writing suggestions for:\n\n${content}`;
        break;

      case 'complete':
        const beforeCursor = content.substring(0, cursorPosition);
        const afterCursor = content.substring(cursorPosition);
        systemPrompt = `You are an AI autocomplete assistant. Complete the sentence or thought naturally based on the context. Provide only the completion text, no explanations.`;
        userPrompt = `Complete this text at the cursor position:\n\nBefore cursor: "${beforeCursor}"\nAfter cursor: "${afterCursor}"\n\nProvide only the completion text.`;
        break;

      case 'outline':
        systemPrompt = `You are an expert at creating structured outlines. Create a clear, hierarchical outline based on the content or topic provided.`;
        userPrompt = `Create an outline for:\n\n${content}`;
        break;

      case 'brainstorm':
        systemPrompt = `You are a creative brainstorming assistant. Generate innovative ideas, angles, and approaches related to the given topic or content.`;
        userPrompt = `Brainstorm ideas about:\n\n${content}`;
        break;

      default:
        throw new Error(`Unknown mode: ${mode}`);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: mode === 'brainstorm' ? 0.8 : 0.7,
        max_tokens: length === 'short' ? 200 : length === 'long' ? 800 : 400,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    console.log(`AI Writing Assistant completed - Mode: ${mode}, Result length: ${result.length}`);

    return new Response(JSON.stringify({ 
      result,
      mode,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI Writing Assistant:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'AI Writing Assistant encountered an error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});