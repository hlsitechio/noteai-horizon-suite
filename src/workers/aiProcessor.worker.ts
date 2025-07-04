import * as Comlink from 'comlink';

/**
 * AI Processing Web Worker
 * Offloads heavy AI computations to prevent main thread blocking
 */

export interface AIProcessorAPI {
  processText: (text: string) => Promise<string>;
  generateSummary: (content: string) => Promise<string>;
  extractKeywords: (text: string) => Promise<string[]>;
  analyzeContent: (content: string) => Promise<ContentAnalysis>;
}

interface ContentAnalysis {
  wordCount: number;
  readingTime: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  complexity: 'simple' | 'moderate' | 'complex';
  tags: string[];
}

/**
 * Process text with heavy AI operations
 */
async function processText(text: string): Promise<string> {
  // Simulate heavy AI processing
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Example: Text cleaning and processing
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
}

/**
 * Generate a summary of content
 */
async function generateSummary(content: string): Promise<string> {
  // Simulate AI summarization
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const sentences = content.split('.').filter(s => s.trim().length > 0);
  const summaryLength = Math.max(1, Math.floor(sentences.length * 0.3));
  
  return sentences
    .slice(0, summaryLength)
    .join('. ') + '.';
}

/**
 * Extract keywords from text
 */
async function extractKeywords(text: string): Promise<string[]> {
  // Simulate keyword extraction
  await new Promise(resolve => setTimeout(resolve, 150));
  
  const words = text.toLowerCase().split(/\s+/);
  const wordCount: Record<string, number> = {};
  
  // Count word frequency
  words.forEach(word => {
    const clean = word.replace(/[^\w]/g, '');
    if (clean.length > 3) {
      wordCount[clean] = (wordCount[clean] || 0) + 1;
    }
  });
  
  // Return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

/**
 * Analyze content for various metrics
 */
async function analyzeContent(content: string): Promise<ContentAnalysis> {
  // Simulate complex content analysis
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute
  
  // Simple sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'poor'];
  
  const words = content.toLowerCase().split(/\s+/);
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (positiveCount > negativeCount) sentiment = 'positive';
  else if (negativeCount > positiveCount) sentiment = 'negative';
  
  // Determine complexity
  const avgWordsPerSentence = wordCount / (content.split('.').length || 1);
  let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
  if (avgWordsPerSentence > 20) complexity = 'complex';
  else if (avgWordsPerSentence > 12) complexity = 'moderate';
  
  const tags = await extractKeywords(content);
  
  return {
    wordCount,
    readingTime,
    sentiment,
    complexity,
    tags,
  };
}

// Expose the API
const api: AIProcessorAPI = {
  processText,
  generateSummary,
  extractKeywords,
  analyzeContent,
};

Comlink.expose(api);