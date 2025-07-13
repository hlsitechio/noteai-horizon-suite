import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Upload,
  FileText,
  Brain,
  Tag,
  TrendingUp,
  Key,
  Languages,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Sparkles
} from 'lucide-react';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';

export interface DocumentAnalysisResult {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  topics: string[];
  entities: Array<{ text: string; type: string; confidence: number }>;
  language: string;
  readability: {
    score: number;
    level: string;
    readingTime: number;
  };
  structure: {
    headings: string[];
    paragraphs: number;
    sentences: number;
    words: number;
  };
  suggestions: string[];
}

const SmartDocumentAnalyzer: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<DocumentAnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<DocumentAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    analyzeDocument,
    extractText,
    generateSummary,
    isAnalyzing,
    analysisProgress
  } = useDocumentAnalysis();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.includes('text') || 
      file.type.includes('pdf') || 
      file.type.includes('doc') ||
      file.type.includes('application/pdf') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    );
    
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Only text, PDF, and document files are supported.');
    }
    
    setSelectedFiles(validFiles);
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) return;

    const results: DocumentAnalysisResult[] = [];
    
    for (const file of selectedFiles) {
      try {
        console.log(`Analyzing document: ${file.name}`);
        const result = await analyzeDocument(file);
        if (result) {
          results.push(result);
        }
      } catch (error) {
        console.error(`Failed to analyze ${file.name}:`, error);
      }
    }
    
    setAnalysisResults(results);
    if (results.length > 0) {
      setCurrentAnalysis(results[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.includes('text') || 
      file.type.includes('pdf') || 
      file.type.includes('doc') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    );
    
    setSelectedFiles(validFiles);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getReadabilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Smart Document Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF, TXT, MD, DOC, and DOCX files
            </p>
            
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedFiles.map((file, index) => (
                  <Badge key={file.name} variant="secondary" className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {file.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          
          <div className="flex justify-center mt-4">
            <Button
              onClick={handleAnalyze}
              disabled={selectedFiles.length === 0 || isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Analyze Documents
                </>
              )}
            </Button>
          </div>
          
          {isAnalyzing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Analysis Progress</span>
                <span className="text-sm font-medium">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Document List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Analyzed Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {analysisResults.map((result, index) => (
                    <Button
                      key={index}
                      variant={currentAnalysis === result ? "default" : "ghost"}
                      className="w-full justify-start text-left"
                      onClick={() => setCurrentAnalysis(result)}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Document {index + 1}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Analysis Details */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Analysis Results</span>
                {currentAnalysis && (
                  <div className="flex items-center gap-2">
                    <Badge className={getSentimentColor(currentAnalysis.sentiment)}>
                      {currentAnalysis.sentiment}
                    </Badge>
                    <Badge variant="outline">
                      <Languages className="w-3 h-3 mr-1" />
                      {currentAnalysis.language}
                    </Badge>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            
            {currentAnalysis && (
              <CardContent>
                <Tabs defaultValue="summary" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                    <TabsTrigger value="entities">Entities</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Summary
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {currentAnalysis.summary}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Key Points
                      </h4>
                      <ul className="space-y-1">
                        {currentAnalysis.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="insights" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Readability
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Score</span>
                            <span className={`font-semibold ${getReadabilityColor(currentAnalysis.readability.score)}`}>
                              {currentAnalysis.readability.score}/100
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Level</span>
                            <Badge variant="secondary">{currentAnalysis.readability.level}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Reading Time</span>
                            <span className="text-sm font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {currentAnalysis.readability.readingTime} min
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          Topics
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.topics.map((topic, index) => (
                            <Badge key={index} variant="outline">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="structure" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {currentAnalysis.structure.paragraphs}
                        </div>
                        <div className="text-sm text-muted-foreground">Paragraphs</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {currentAnalysis.structure.sentences}
                        </div>
                        <div className="text-sm text-muted-foreground">Sentences</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {currentAnalysis.structure.words}
                        </div>
                        <div className="text-sm text-muted-foreground">Words</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {currentAnalysis.structure.headings.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Headings</div>
                      </div>
                    </div>
                    
                    {currentAnalysis.structure.headings.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Document Structure</h4>
                        <ul className="space-y-1">
                          {currentAnalysis.structure.headings.map((heading, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Eye className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{heading}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="entities" className="space-y-4">
                    <div className="space-y-3">
                      {currentAnalysis.entities.map((entity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <span className="font-medium">{entity.text}</span>
                            <Badge variant="secondary" className="ml-2">
                              {entity.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(entity.confidence * 100)}% confidence
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="suggestions" className="space-y-4">
                    <div className="space-y-3">
                      {currentAnalysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                          <span className="text-sm text-blue-800">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default SmartDocumentAnalyzer;