import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabase } from "./supabase";
import { insertUserSchema, insertDocumentSchema, insertFolderSchema, insertDashboardWorkspaceSchema, insertCalendarEventSchema, insertTaskSchema, insertUserPreferencesSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication & User Management
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Use Supabase Auth for registration
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error || !data.user) {
        console.error('Registration error:', error);
        res.status(400).json({ error: error?.message || 'Registration failed' });
        return;
      }
      
      res.json({ 
        user: { 
          id: data.user.id, 
          username: data.user.email || email,
          email: data.user.email,
          name: name
        },
        session: data.session
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Use Supabase Auth for authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error || !data.user) {
        console.error('Login error:', error);
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      
      // Return user data in expected format
      res.json({ 
        user: { 
          id: data.user.id, 
          username: data.user.email || email,
          email: data.user.email
        },
        session: data.session
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // User Profiles
  app.get('/api/profiles/:userId', async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.userId);
      res.json(profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.post('/api/profiles', async (req, res) => {
    try {
      const profile = await storage.createUserProfile(req.body);
      res.json(profile);
    } catch (error) {
      console.error('Profile creation error:', error);
      res.status(500).json({ error: 'Failed to create profile' });
    }
  });

  app.put('/api/profiles/:userId', async (req, res) => {
    try {
      const profile = await storage.updateUserProfile(req.params.userId, req.body);
      res.json(profile);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Documents
  app.get('/api/documents', async (req, res) => {
    try {
      const { userId, folderId } = req.query;
      const documents = await storage.getDocuments(userId as string, folderId as string);
      res.json(documents);
    } catch (error) {
      console.error('Documents fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch documents' });
    }
  });

  app.get('/api/documents/:id', async (req, res) => {
    try {
      const { userId } = req.query;
      const document = await storage.getDocument(req.params.id, userId as string);
      res.json(document);
    } catch (error) {
      console.error('Document fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch document' });
    }
  });

  app.post('/api/documents', async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      console.error('Document creation error:', error);
      res.status(500).json({ error: 'Failed to create document' });
    }
  });

  app.put('/api/documents/:id', async (req, res) => {
    try {
      const { userId } = req.query;
      const document = await storage.updateDocument(req.params.id, userId as string, req.body);
      res.json(document);
    } catch (error) {
      console.error('Document update error:', error);
      res.status(500).json({ error: 'Failed to update document' });
    }
  });

  app.delete('/api/documents/:id', async (req, res) => {
    try {
      const { userId } = req.query;
      const success = await storage.deleteDocument(req.params.id, userId as string);
      res.json({ success });
    } catch (error) {
      console.error('Document deletion error:', error);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  });

  // Folders
  app.get('/api/folders', async (req, res) => {
    try {
      const { userId, parentId } = req.query;
      
      // If no userId provided, return empty array (unauthenticated request)
      if (!userId) {
        res.json([]);
        return;
      }
      
      const folders = await storage.getFolders(userId as string, parentId as string);
      res.json(folders);
    } catch (error) {
      console.error('Folders fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch folders' });
    }
  });

  app.post('/api/folders', async (req, res) => {
    try {
      const folderData = insertFolderSchema.parse(req.body);
      const folder = await storage.createFolder(folderData);
      res.json(folder);
    } catch (error) {
      console.error('Folder creation error:', error);
      res.status(500).json({ error: 'Failed to create folder' });
    }
  });

  // Dashboard Workspaces
  app.get('/api/workspaces/:userId', async (req, res) => {
    try {
      const workspaces = await storage.getDashboardWorkspaces(req.params.userId);
      res.json(workspaces);
    } catch (error) {
      console.error('Workspaces fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch workspaces' });
    }
  });

  app.get('/api/workspaces/:userId/default', async (req, res) => {
    try {
      const workspace = await storage.getDefaultWorkspace(req.params.userId);
      res.json(workspace);
    } catch (error) {
      console.error('Default workspace fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch default workspace' });
    }
  });

  app.post('/api/workspaces', async (req, res) => {
    try {
      const workspaceData = insertDashboardWorkspaceSchema.parse(req.body);
      const workspace = await storage.createWorkspace(workspaceData);
      res.json(workspace);
    } catch (error) {
      console.error('Workspace creation error:', error);
      res.status(500).json({ error: 'Failed to create workspace' });
    }
  });

  app.put('/api/workspaces/:id', async (req, res) => {
    try {
      const { userId } = req.query;
      const workspace = await storage.updateWorkspace(req.params.id, userId as string, req.body);
      res.json(workspace);
    } catch (error) {
      console.error('Workspace update error:', error);
      res.status(500).json({ error: 'Failed to update workspace' });
    }
  });

  // Calendar Events
  app.get('/api/calendar/:userId', async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;
      const events = await storage.getCalendarEvents(req.params.userId, start, end);
      res.json(events);
    } catch (error) {
      console.error('Calendar events fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
  });

  app.post('/api/calendar', async (req, res) => {
    try {
      const eventData = insertCalendarEventSchema.parse(req.body);
      const event = await storage.createCalendarEvent(eventData);
      res.json(event);
    } catch (error) {
      console.error('Calendar event creation error:', error);
      res.status(500).json({ error: 'Failed to create calendar event' });
    }
  });

  app.put('/api/calendar/:id', async (req, res) => {
    try {
      const { userId } = req.query;
      const event = await storage.updateCalendarEvent(req.params.id, userId as string, req.body);
      res.json(event);
    } catch (error) {
      console.error('Calendar event update error:', error);
      res.status(500).json({ error: 'Failed to update calendar event' });
    }
  });

  app.delete('/api/calendar/:id', async (req, res) => {
    try {
      const { userId } = req.query;
      const success = await storage.deleteCalendarEvent(req.params.id, userId as string);
      res.json({ success });
    } catch (error) {
      console.error('Calendar event deletion error:', error);
      res.status(500).json({ error: 'Failed to delete calendar event' });
    }
  });

  // Tasks
  app.get('/api/tasks/:userId', async (req, res) => {
    try {
      const { isCompleted } = req.query;
      const completed = isCompleted === 'true' ? true : isCompleted === 'false' ? false : undefined;
      const tasks = await storage.getTasks(req.params.userId, completed);
      res.json(tasks);
    } catch (error) {
      console.error('Tasks fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  app.post('/api/tasks', async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error('Task creation error:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  });

  app.put('/api/tasks/:id', async (req, res) => {
    try {
      const { userId } = req.query;
      const task = await storage.updateTask(req.params.id, userId as string, req.body);
      res.json(task);
    } catch (error) {
      console.error('Task update error:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  });

  app.delete('/api/tasks/:id', async (req, res) => {
    try {
      const { userId } = req.query;
      const success = await storage.deleteTask(req.params.id, userId as string);
      res.json({ success });
    } catch (error) {
      console.error('Task deletion error:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  // Folders endpoints
  app.get('/api/folders', async (req, res) => {
    try {
      // For now, return empty array since folders aren't implemented in storage
      res.json([]);
    } catch (error) {
      console.error('Folders fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch folders' });
    }
  });

  app.post('/api/folders', async (req, res) => {
    try {
      // Mock implementation for now
      const folder = {
        id: Date.now().toString(),
        ...req.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      res.json(folder);
    } catch (error) {
      console.error('Folder creation error:', error);
      res.status(500).json({ error: 'Failed to create folder' });
    }
  });

  app.put('/api/folders/:id', async (req, res) => {
    try {
      const folder = {
        id: req.params.id,
        ...req.body,
        updated_at: new Date().toISOString()
      };
      res.json(folder);
    } catch (error) {
      console.error('Folder update error:', error);
      res.status(500).json({ error: 'Failed to update folder' });
    }
  });

  app.delete('/api/folders/:id', async (req, res) => {
    try {
      res.json({ success: true });
    } catch (error) {
      console.error('Folder deletion error:', error);
      res.status(500).json({ error: 'Failed to delete folder' });
    }
  });

  // User Preferences
  app.get('/api/preferences/:userId', async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences(req.params.userId);
      res.json(preferences);
    } catch (error) {
      console.error('Preferences fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch preferences' });
    }
  });

  app.post('/api/preferences', async (req, res) => {
    try {
      const preferencesData = insertUserPreferencesSchema.parse(req.body);
      const preferences = await storage.createUserPreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error('Preferences creation error:', error);
      res.status(500).json({ error: 'Failed to create preferences' });
    }
  });

  app.put('/api/preferences/:userId', async (req, res) => {
    try {
      const preferences = await storage.updateUserPreferences(req.params.userId, req.body);
      res.json(preferences);
    } catch (error) {
      console.error('Preferences update error:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  });

  // User Activities
  app.get('/api/activities/:userId', async (req, res) => {
    try {
      const { limit } = req.query;
      const activities = await storage.getUserActivities(req.params.userId, limit ? parseInt(limit as string) : undefined);
      res.json(activities);
    } catch (error) {
      console.error('Activities fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  });

  app.post('/api/activities', async (req, res) => {
    try {
      const activity = await storage.logUserActivity(req.body);
      res.json(activity);
    } catch (error) {
      console.error('Activity logging error:', error);
      res.status(500).json({ error: 'Failed to log activity' });
    }
  });

  // AI & Document Analysis API (replacing Supabase Edge Functions)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history = [], userId } = req.body;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Log user activity
      if (userId) {
        await storage.logUserActivity({
          userId,
          action: 'ai_chat',
          description: 'Used AI chat functionality',
          metadata: { messageLength: message.length }
        });
      }

      const messages = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant integrated into OnlineNote.ai, a comprehensive productivity platform. Help users with their tasks, document analysis, writing assistance, and general productivity questions. Be concise and practical in your responses.'
        },
        ...history.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('OpenAI API error:', errorData);
        return res.status(500).json({ error: 'AI service temporarily unavailable' });
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      res.json({ 
        response: aiResponse,
        usage: data.usage
      });

    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: 'AI chat failed' });
    }
  });

  app.post('/api/documents/analyze', async (req, res) => {
    try {
      const { text, filename, options = {}, userId } = req.body;
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      if (!text) {
        return res.status(400).json({ error: 'Text content is required' });
      }

      // Log user activity
      if (userId) {
        await storage.logUserActivity({
          userId,
          action: 'document_analysis',
          description: `Analyzed document: ${filename || 'Untitled'}`,
          metadata: { textLength: text.length, filename }
        });
      }

      // Calculate basic metrics
      const paragraphs = text.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0).length;
      const sentences = text.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length;
      const words = text.split(/\s+/).filter((w: string) => w.trim().length > 0).length;
      const headings = text.match(/^#+\s+.+$/gm) || [];
      const readingTime = Math.ceil(words / 200);

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

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
        const errorData = await response.text();
        console.error('OpenAI API error:', errorData);
        return res.status(500).json({ error: 'Document analysis service temporarily unavailable' });
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

      // Calculate readability score
      let readabilityScore = 50;
      const avgSentenceLength = words / sentences;
      if (avgSentenceLength < 15) readabilityScore += 20;
      else if (avgSentenceLength < 25) readabilityScore += 10;
      else if (avgSentenceLength > 35) readabilityScore -= 20;
      
      const avgParagraphLength = words / paragraphs;
      if (avgParagraphLength < 100) readabilityScore += 10;
      else if (avgParagraphLength > 200) readabilityScore -= 10;
      
      readabilityScore = Math.max(0, Math.min(100, readabilityScore));
      
      let readabilityLevel = 'Moderate';
      if (readabilityScore >= 80) readabilityLevel = 'Easy to read';
      else if (readabilityScore >= 60) readabilityLevel = 'Moderate';
      else if (readabilityScore >= 40) readabilityLevel = 'High school level';
      else readabilityLevel = 'College level';

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
          headings: headings.map((h: string) => h.replace(/^#+\s+/, '')),
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

      res.json(finalResult);

    } catch (error) {
      console.error('Document analysis error:', error);
      res.status(500).json({ error: 'Document analysis failed' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
