
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useEnhancedAIChat, ChatMessage } from '@/hooks/useEnhancedAIChat';
import { Loader2, Code, FileText, Calendar } from 'lucide-react';

const EXAMPLE_SCHEMAS = {
  weather: {
    name: 'weather_report',
    description: 'Weather information',
    schema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City or location name'
        },
        temperature: {
          type: 'number',
          description: 'Temperature in Celsius'
        },
        conditions: {
          type: 'string',
          description: 'Weather conditions description'
        },
        humidity: {
          type: 'number',
          description: 'Humidity percentage'
        }
      },
      required: ['location', 'temperature', 'conditions'],
      additionalProperties: false
    }
  },
  task: {
    name: 'task_breakdown',
    description: 'Break down a project into tasks',
    schema: {
      type: 'object',
      properties: {
        project_name: {
          type: 'string',
          description: 'Name of the project'
        },
        tasks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                description: 'Task ID'
              },
              title: {
                type: 'string',
                description: 'Task title'
              },
              description: {
                type: 'string',
                description: 'Detailed task description'
              },
              priority: {
                type: 'string',
                enum: ['low', 'medium', 'high'],
                description: 'Task priority level'
              },
              estimated_hours: {
                type: 'number',
                description: 'Estimated hours to complete'
              }
            },
            required: ['id', 'title', 'description', 'priority'],
            additionalProperties: false
          }
        }
      },
      required: ['project_name', 'tasks'],
      additionalProperties: false
    }
  },
  analysis: {
    name: 'text_analysis',
    description: 'Analyze text sentiment and extract key information',
    schema: {
      type: 'object',
      properties: {
        sentiment: {
          type: 'string',
          enum: ['positive', 'negative', 'neutral'],
          description: 'Overall sentiment of the text'
        },
        confidence: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Confidence score for sentiment analysis'
        },
        key_topics: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Main topics discussed in the text'
        },
        summary: {
          type: 'string',
          description: 'Brief summary of the text'
        }
      },
      required: ['sentiment', 'confidence', 'key_topics', 'summary'],
      additionalProperties: false
    }
  }
};

export const StructuredOutputDemo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedSchema, setSelectedSchema] = useState<keyof typeof EXAMPLE_SCHEMAS>('weather');
  const [result, setResult] = useState<string>('');
  const { sendStructuredMessage, isLoading } = useEnhancedAIChat();

  const handleTest = async () => {
    if (!prompt.trim()) return;

    try {
      const messages: ChatMessage[] = [
        {
          id: '1',
          content: prompt,
          isUser: true,
          timestamp: new Date()
        }
      ];

      const schema = EXAMPLE_SCHEMAS[selectedSchema];
      const response = await sendStructuredMessage(messages, schema);
      setResult(response);
    } catch (error) {
      console.error('Error testing structured output:', error);
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Structured Output Demo
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Test AI responses with enforced JSON schema validation
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Schema Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Choose Schema Type:</label>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(EXAMPLE_SCHEMAS).map(([key, schema]) => (
                <Button
                  key={key}
                  variant={selectedSchema === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSchema(key as keyof typeof EXAMPLE_SCHEMAS)}
                  className="capitalize"
                >
                  {key === 'weather' && <FileText className="w-3 h-3 mr-1" />}
                  {key === 'task' && <Calendar className="w-3 h-3 mr-1" />}
                  {key === 'analysis' && <Code className="w-3 h-3 mr-1" />}
                  {key.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Schema Preview */}
          <div>
            <label className="block text-sm font-medium mb-2">Current Schema:</label>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <Badge variant="secondary" className="mb-2">
                {EXAMPLE_SCHEMAS[selectedSchema].name}
              </Badge>
              <pre className="text-xs overflow-auto max-h-32">
                {JSON.stringify(EXAMPLE_SCHEMAS[selectedSchema].schema, null, 2)}
              </pre>
            </div>
          </div>

          {/* Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Prompt:</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={getPlaceholderForSchema(selectedSchema)}
              className="min-h-20"
            />
          </div>

          {/* Test Button */}
          <Button 
            onClick={handleTest} 
            disabled={!prompt.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Structured Response...
              </>
            ) : (
              'Test Structured Output'
            )}
          </Button>

          {/* Result */}
          {result && (
            <div>
              <label className="block text-sm font-medium mb-2">Structured Response:</label>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <pre className="text-sm overflow-auto whitespace-pre-wrap">
                  {JSON.stringify(JSON.parse(result), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function getPlaceholderForSchema(schema: keyof typeof EXAMPLE_SCHEMAS): string {
  switch (schema) {
    case 'weather':
      return 'What\'s the weather like in Tokyo today?';
    case 'task':
      return 'Break down the project "Build a mobile app" into manageable tasks';
    case 'analysis':
      return 'Analyze this text: "I love working with this new AI tool! It makes everything so much easier and more productive."';
    default:
      return 'Enter your prompt here...';
  }
}

export default StructuredOutputDemo;
