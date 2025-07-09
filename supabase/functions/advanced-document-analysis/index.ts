import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, filename, options = {} } = await req.json();
    
    if (!text) {
      throw new Error('No text content provided');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Starting advanced document analysis for:', filename);
    console.log('Text length:', text.length, 'characters');
    console.log('Analysis options:', options);

    // Calculate basic structure metrics
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.split(/\s+/).filter(w => w.trim().length > 0).length;
    const headings = text.match(/^#+\s+.+$/gm) || [];

    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    // Build comprehensive analysis prompt
    const analysisPrompt = `
Analyze the following document text and provide a comprehensive analysis in JSON format:

Document: "${text.substring(0, 4000)}${text.length > 4000 ? '...' : ''}"

Please provide analysis in the following JSON structure:
{
  "summary": "A comprehensive 2-3 sentence summary of the document",
  "key_points": ["array", "of", "main", "key", "points", "from", "document"],
  "sentiment": "positive|negative|neutral",
  "topics": ["array", "of", "main", "topics", "discussed"],
  "language": "detected language code (e.g., en, es, fr)",
  "entities": [
    {"text": "entity name", "type": "PERSON|ORG|LOCATION|MISC", "confidence": 0.95}
  ],
  "readability": {
    "score": 75,
    "level": "College level|High school|Easy to read",
    "complexity": "Simple|Moderate|Complex"
  },
  "suggestions": [
    "Specific suggestions for improving the document"
  ],
  "keywords": ["important", "keywords", "from", "text"]
}

Analysis requirements:
${options.analyze_sentiment ? '- Analyze overall sentiment' : ''}
${options.extract_entities ? '- Extract named entities with confidence scores' : ''}
${options.generate_summary ? '- Generate comprehensive summary' : ''}
${options.extract_keywords ? '- Extract 5-10 most important keywords' : ''}
${options.analyze_structure ? '- Analyze document structure and readability' : ''}
${options.provide_suggestions ? '- Provide specific improvement suggestions' : ''}

Return only valid JSON without any markdown formatting.
    `;

    // Call OpenAI for comprehensive analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert document analyst. Always return valid JSON and be thorough in your analysis.' 
          },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${await response.text()}`);
    }

    const analysisData = await response.json();
    let analysisResult;

    try {
      analysisResult = JSON.parse(analysisData.choices[0].message.content);
    } catch (parseError) {
      console.warn('Failed to parse AI analysis, using fallback');
      analysisResult = {
        summary: 'Document analysis completed',
        key_points: [],
        sentiment: 'neutral',
        topics: [],
        language: 'en',
        entities: [],
        readability: { score: 50, level: 'Moderate', complexity: 'Moderate' },
        suggestions: [],
        keywords: []
      };
    }

    // Calculate readability score based on structure
    let readabilityScore = 50; // Base score
    
    // Adjust based on sentence length
    const avgSentenceLength = words / sentences;
    if (avgSentenceLength < 15) readabilityScore += 20;
    else if (avgSentenceLength < 25) readabilityScore += 10;
    else if (avgSentenceLength > 35) readabilityScore -= 20;
    
    // Adjust based on paragraph structure
    const avgParagraphLength = words / paragraphs;
    if (avgParagraphLength < 100) readabilityScore += 10;
    else if (avgParagraphLength > 200) readabilityScore -= 10;
    
    // Ensure score is between 0-100
    readabilityScore = Math.max(0, Math.min(100, readabilityScore));
    
    // Determine readability level
    let readabilityLevel = 'Moderate';
    if (readabilityScore >= 80) readabilityLevel = 'Easy to read';
    else if (readabilityScore >= 60) readabilityLevel = 'Moderate';
    else if (readabilityScore >= 40) readabilityLevel = 'High school level';
    else readabilityLevel = 'College level';

    // Combine results
    const finalResult = {
      summary: analysisResult.summary || 'Document analysis completed',
      key_points: analysisResult.key_points || [],
      sentiment: analysisResult.sentiment || 'neutral',
      topics: analysisResult.topics || analysisResult.keywords || [],
      language: analysisResult.language || 'en',
      entities: analysisResult.entities || [],
      readability: {
        score: analysisResult.readability?.score || readabilityScore,
        level: analysisResult.readability?.level || readabilityLevel,
        reading_time: readingTime,
        complexity: analysisResult.readability?.complexity || 'Moderate'
      },
      structure: {
        headings: headings.map(h => h.replace(/^#+\s+/, '')),
        paragraphs,
        sentences,
        words
      },
      suggestions: analysisResult.suggestions || [
        'Consider breaking long paragraphs into shorter ones for better readability',
        'Add headings to improve document structure',
        'Review sentence length for clarity'
      ],
      keywords: analysisResult.keywords || [],
      metadata: {
        filename,
        processed_at: new Date().toISOString(),
        analysis_version: '1.0'
      }
    };

    console.log('Document analysis complete:', {
      words: finalResult.structure.words,
      sentences: finalResult.structure.sentences,
      readability: finalResult.readability.score,
      topics: finalResult.topics.length,
      entities: finalResult.entities.length
    });

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in document analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      summary: '',
      key_points: [],
      sentiment: 'neutral',
      topics: [],
      language: 'en',
      entities: [],
      readability: { score: 0, level: 'Unknown', reading_time: 0 },
      structure: { headings: [], paragraphs: 0, sentences: 0, words: 0 },
      suggestions: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});