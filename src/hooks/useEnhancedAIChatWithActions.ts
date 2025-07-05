import { useState } from 'react';
import { useEnhancedAIChat, ChatMessage } from './useEnhancedAIChat';
import { useAIActions, AIAction } from './useAIActions';
import { useToast } from './useToast';

export interface EnhancedChatMessage extends ChatMessage {
  actions?: AIAction[];
  actionResults?: any[];
}

// Define the JSON schema for AI action responses
const ACTION_SCHEMA = {
  name: "ai_response_with_actions",
  schema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "The conversational response to the user"
      },
      actions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["create_note", "set_reminder", "search_notes", "update_note", "delete_note"]
            },
            data: {
              type: "object",
              description: "The data needed to execute the action"
            },
            message: {
              type: "string",
              description: "Optional message about this specific action"
            }
          },
          required: ["type", "data"]
        }
      },
      needs_clarification: {
        type: "boolean",
        description: "Whether the AI needs more information from the user"
      },
      clarification_question: {
        type: "string",
        description: "Question to ask user if clarification is needed"
      }
    },
    required: ["message"]
  }
};

export const useEnhancedAIChatWithActions = () => {
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { sendStructuredMessage, isLoading } = useEnhancedAIChat();
  const { executeAction, isExecuting } = useAIActions();
  const { toast } = useToast();

  const sendMessageWithActions = async (userMessage: string): Promise<void> => {
    setIsProcessing(true);
    
    try {
      // Add user message
      const newUserMessage: EnhancedChatMessage = {
        id: Date.now().toString(),
        content: userMessage,
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newUserMessage]);

      // Build context for AI with conversation history and system prompt
      const systemPrompt = `You are an intelligent note-taking and productivity assistant. You can help users:

1. CREATE NOTES: When users want to save information, create notes, or write something down
2. SET REMINDERS: When users mention future events, deadlines, or want to be reminded of something
3. SEARCH NOTES: When users ask about finding existing information or notes
4. UPDATE NOTES: When users want to modify existing notes
5. DELETE NOTES: When users want to remove notes

IMPORTANT INSTRUCTIONS:
- Parse user intent carefully and suggest appropriate actions
- For reminders, always include a specific date/time in ISO format
- For note creation, extract a meaningful title and content
- If you need more information, set needs_clarification: true
- Always provide a helpful conversational response
- Be proactive in suggesting actions based on context

Examples:
- "Remind me to call John tomorrow at 2pm" → set_reminder with parsed date
- "Create a note about today's meeting" → create_note
- "Find my notes about project planning" → search_notes
- "I need to remember to buy groceries this weekend" → create_note + set_reminder

Current conversation context: The user is chatting with an AI assistant that can take actions.`;

      const contextMessages: ChatMessage[] = [
        {
          id: 'system',
          content: systemPrompt,
          isUser: false,
          timestamp: new Date()
        },
        ...messages.slice(-5), // Last 5 messages for context
        newUserMessage
      ];

      // Get structured response from AI
      console.log('Sending structured message to AI...');
      const aiResponseJson = await sendStructuredMessage(contextMessages, ACTION_SCHEMA);
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(aiResponseJson);
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        throw new Error('AI returned invalid response format');
      }

      // Create AI message
      const aiMessage: EnhancedChatMessage = {
        id: (Date.now() + 1).toString(),
        content: parsedResponse.message || aiResponseJson,
        isUser: false,
        timestamp: new Date(),
        actions: parsedResponse.actions || []
      };

      setMessages(prev => [...prev, aiMessage]);

      // Execute actions if any
      if (parsedResponse.actions && parsedResponse.actions.length > 0) {
        console.log('Executing actions:', parsedResponse.actions);
        const actionResults = [];
        
        for (const action of parsedResponse.actions) {
          try {
            const result = await executeAction(action);
            actionResults.push(result);
            
            if (result.success) {
              console.log(`Action ${action.type} executed successfully:`, result);
            } else {
              console.error(`Action ${action.type} failed:`, result.message);
              toast.error(`Action failed: ${result.message}`);
            }
          } catch (error: any) {
            console.error(`Error executing action ${action.type}:`, error);
            actionResults.push({
              success: false,
              message: error.message
            });
          }
        }

        // Update the AI message with action results
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessage.id 
            ? { ...msg, actionResults }
            : msg
        ));

        // Provide feedback about completed actions
        const successfulActions = actionResults.filter(r => r.success);
        const failedActions = actionResults.filter(r => !r.success);
        
        if (successfulActions.length > 0) {
          const feedbackMessage: EnhancedChatMessage = {
            id: (Date.now() + 2).toString(),
            content: `✅ Completed ${successfulActions.length} action(s) successfully!`,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, feedbackMessage]);
        }

        if (failedActions.length > 0) {
          console.warn('Some actions failed:', failedActions);
        }
      }

      // Handle clarification if needed
      if (parsedResponse.needs_clarification && parsedResponse.clarification_question) {
        const clarificationMessage: EnhancedChatMessage = {
          id: (Date.now() + 3).toString(),
          content: parsedResponse.clarification_question,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, clarificationMessage]);
      }

    } catch (error: any) {
      console.error('Error in enhanced AI chat:', error);
      
      const errorMessage: EnhancedChatMessage = {
        id: (Date.now() + 4).toString(),
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      toast.error('AI chat error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    sendMessageWithActions,
    clearChat,
    isLoading: isLoading || isProcessing || isExecuting
  };
};