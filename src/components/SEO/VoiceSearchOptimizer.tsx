import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Search, 
  Brain, 
  Volume2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

interface VoiceSearchResult {
  query: string;
  intent: 'question' | 'navigation' | 'action' | 'information';
  confidence: number;
  suggestions: string[];
  optimization: {
    naturalLanguage: string;
    keywords: string[];
    semanticVariants: string[];
  };
}

const VoiceSearchOptimizer: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [searchResults, setSearchResults] = useState<VoiceSearchResult | null>(null);
  const [textQuery, setTextQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        toast.info('Listening... Speak your search query');
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setTranscript(transcript);
        
        if (event.results[0].isFinal) {
          setTextQuery(transcript);
          handleVoiceSearch(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        toast.error(`Speech recognition error: ${event.error}`);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    } else {
      toast.error('Speech recognition not supported in this browser');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setLoading(true);
    
    try {
      // Simulate AI processing of voice search
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock voice search analysis - in a real app, this would use NLP services
      const mockResult: VoiceSearchResult = {
        query: query,
        intent: detectIntent(query),
        confidence: Math.random() * 0.3 + 0.7,
        suggestions: generateSuggestions(query),
        optimization: {
          naturalLanguage: convertToNaturalLanguage(query),
          keywords: extractKeywords(query),
          semanticVariants: generateSemanticVariants(query)
        }
      };
      
      setSearchResults(mockResult);
      toast.success('Voice search analyzed successfully!');
    } catch (error) {
      console.error('Voice search analysis failed:', error);
      toast.error('Failed to analyze voice search');
    } finally {
      setLoading(false);
    }
  };

  const detectIntent = (query: string): 'question' | 'navigation' | 'action' | 'information' => {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('how') || lowerQuery.includes('what') || lowerQuery.includes('why') || lowerQuery.includes('when')) {
      return 'question';
    }
    if (lowerQuery.includes('go to') || lowerQuery.includes('navigate') || lowerQuery.includes('open')) {
      return 'navigation';
    }
    if (lowerQuery.includes('create') || lowerQuery.includes('make') || lowerQuery.includes('add')) {
      return 'action';
    }
    return 'information';
  };

  const generateSuggestions = (query: string): string[] => {
    return [
      `"${query}" - exact match`,
      `How to ${query.toLowerCase()}`,
      `Best practices for ${query.toLowerCase()}`,
      `${query} tutorial`,
      `${query} guide`
    ];
  };

  const convertToNaturalLanguage = (query: string): string => {
    return `When someone asks "${query}", they're likely looking for comprehensive information that directly answers their question in a conversational tone.`;
  };

  const extractKeywords = (query: string): string[] => {
    return query.toLowerCase()
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 5);
  };

  const generateSemanticVariants = (query: string): string[] => {
    const variants = [
      `${query} tutorial`,
      `How to ${query}`,
      `${query} guide`,
      `Learn ${query}`,
      `${query} tips`
    ];
    return variants.slice(0, 3);
  };

  const getIntentColor = (intent: string) => {
    switch (intent) {
      case 'question': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'navigation': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'action': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'information': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Search Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Voice Search Optimizer
          </CardTitle>
          <CardDescription>
            Optimize your content for voice search and conversational queries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type or speak your search query..."
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              variant={isListening ? "destructive" : "default"}
              size="icon"
              onClick={isListening ? stopListening : startListening}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button 
              onClick={() => handleVoiceSearch(textQuery)}
              disabled={!textQuery.trim() || loading}
            >
              {loading ? (
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Analyze
            </Button>
          </div>

          {isListening && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Listening... {transcript || 'Speak now'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Search Results */}
      {searchResults && (
        <div className="space-y-4">
          {/* Analysis Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Voice Search Analysis
              </CardTitle>
              <CardDescription>AI-powered analysis of your voice search query</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Query</label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">"{searchResults.query}"</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intent & Confidence</label>
                  <div className="flex items-center gap-2">
                    <Badge className={`capitalize ${getIntentColor(searchResults.intent)}`}>
                      {searchResults.intent}
                    </Badge>
                    <Badge variant="outline">
                      {Math.round(searchResults.confidence * 100)}% confidence
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Content Optimization
              </CardTitle>
              <CardDescription>How to optimize your content for this voice search</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Natural Language Optimization</label>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {searchResults.optimization.naturalLanguage}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Keywords</label>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.optimization.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Semantic Variants</label>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.optimization.semanticVariants.map((variant, index) => (
                      <Badge key={index} variant="secondary">
                        {variant}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Content Suggestions
              </CardTitle>
              <CardDescription>Recommended content formats for voice search optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {searchResults.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <p className="text-sm font-medium">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VoiceSearchOptimizer;