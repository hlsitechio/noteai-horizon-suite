import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

interface SEOContentRequest {
  keyword: string;
  contentType: 'landing_page' | 'blog_post' | 'feature_page' | 'comparison';
  targetAudience?: string;
  competitorUrls?: string[];
  currentContent?: string;
  wordCount?: number;
}

interface SEOContentResponse {
  title: string;
  metaDescription: string;
  headings: string[];
  contentOutline: string;
  keywords: string[];
  internalLinkSuggestions: string[];
  seoScore: number;
  recommendations: string[];
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { keyword, contentType, targetAudience, competitorUrls, currentContent, wordCount }: SEOContentRequest = await req.json();

    if (!keyword || !contentType) {
      return new Response(
        JSON.stringify({ error: 'Keyword and content type are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const systemPrompt = `You are an expert SEO content strategist and AI writing assistant. Your job is to create comprehensive, SEO-optimized content strategies that will rank highly on Google.

Key Responsibilities:
1. Analyze search intent and competitor content
2. Create compelling, search-optimized titles and meta descriptions  
3. Develop detailed content outlines with proper heading structure (H1, H2, H3)
4. Identify relevant LSI keywords and semantic variations
5. Suggest internal linking opportunities
6. Provide actionable SEO recommendations

Guidelines:
- Focus on user intent and search behavior
- Create content that's better than existing top-ranking pages
- Use semantic SEO principles and related keywords
- Ensure content is comprehensive and authoritative
- Follow Google's E-A-T guidelines (Expertise, Authoritativeness, Trustworthiness)
- Optimize for featured snippets and voice search when relevant
- Consider user experience and engagement metrics

Return your analysis in a structured JSON format.`;

    const userPrompt = `
Create an SEO-optimized content strategy for:

Primary Keyword: "${keyword}"
Content Type: ${contentType}
Target Audience: ${targetAudience || 'General users interested in productivity and note-taking'}
Word Count Target: ${wordCount || 1500} words

${competitorUrls ? `Competitor URLs to analyze: ${competitorUrls.join(', ')}` : ''}
${currentContent ? `Current content to improve: ${currentContent.substring(0, 500)}...` : ''}

Provide a comprehensive SEO content strategy including:

1. Optimized page title (55-60 characters, include primary keyword)
2. Meta description (150-160 characters, compelling with keyword)
3. Detailed heading structure (H1, H2, H3) with keyword variations
4. Comprehensive content outline with specific talking points
5. Related keywords and LSI terms to include naturally
6. Internal linking suggestions to other relevant pages
7. SEO score prediction (1-100) based on the strategy
8. Specific recommendations for ranking improvement

Focus on creating content that's more comprehensive and valuable than competitors while being highly relevant to search intent.

Response must be valid JSON in this exact structure:
{
  "title": "optimized page title",
  "metaDescription": "compelling meta description", 
  "headings": ["H1 title", "H2 heading 1", "H3 subheading", "H2 heading 2", ...],
  "contentOutline": "detailed paragraph describing the complete content strategy and what each section should cover",
  "keywords": ["primary keyword", "related keyword 1", "LSI keyword", ...],
  "internalLinkSuggestions": ["suggested internal link 1", "suggested internal link 2", ...],
  "seoScore": 85,
  "recommendations": ["specific actionable recommendation 1", "recommendation 2", ...]
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'OnlineNote AI SEO Content Generator',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response from AI
    let seoContent: SEOContentResponse;
    try {
      seoContent = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      
      // Fallback: create a basic response
      seoContent = {
        title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} - Complete Guide | OnlineNote AI`,
        metaDescription: `Discover everything you need to know about ${keyword}. Comprehensive guide with expert insights and practical tips.`,
        headings: [
          `The Ultimate Guide to ${keyword}`,
          `What is ${keyword}?`,
          `Key Benefits and Features`,
          `How to Get Started`,
          `Best Practices and Tips`,
          `Common Challenges and Solutions`,
          `Conclusion`
        ],
        contentOutline: `This comprehensive guide covers ${keyword} in detail, starting with fundamental concepts, exploring key benefits, providing practical implementation strategies, and addressing common challenges. The content is structured to satisfy search intent while providing actionable value to readers.`,
        keywords: [keyword, ...keyword.split(' ').map(word => `${word} guide`), `best ${keyword}`, `${keyword} tips`],
        internalLinkSuggestions: ['/features', '/dashboard', '/pricing', '/blog'],
        seoScore: 75,
        recommendations: [
          'Include relevant internal links to boost page authority',
          'Add FAQ section to capture long-tail keywords',
          'Include images with optimized alt text',
          'Ensure mobile-friendly design and fast loading speed'
        ]
      };
    }

    return new Response(
      JSON.stringify(seoContent),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('SEO Content Generator Error:', error);

    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate SEO content strategy',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});