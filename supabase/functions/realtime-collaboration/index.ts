import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as Y from "https://esm.sh/yjs@13.6.27";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
};

// Store for Y.js documents
const documents = new Map<string, Y.Doc>();
const connections = new Map<string, Set<WebSocket>>();

serve(async (req) => {
  try {
    const { headers } = req;
    const upgradeHeader = headers.get("upgrade") || "";

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (upgradeHeader.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket connection", { 
        status: 400,
        headers: corsHeaders 
      });
    }

    const url = new URL(req.url);
    const documentId = url.searchParams.get('documentId') || 'default';
    const userId = url.searchParams.get('userId') || 'anonymous';

    console.log(`WebSocket connection request for document: ${documentId}, user: ${userId}`);

    // Try to upgrade to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req, {
      headers: corsHeaders
    });
    
    // Get or create Y.js document
    if (!documents.has(documentId)) {
      documents.set(documentId, new Y.Doc());
      connections.set(documentId, new Set());
    }

    const doc = documents.get(documentId)!;
    const documentConnections = connections.get(documentId)!;

    socket.onopen = () => {
      console.log(`WebSocket opened for document: ${documentId}, user: ${userId}`);
      documentConnections.add(socket);

      // Send current document state to new client
      const state = Y.encodeStateAsUpdate(doc);
      if (state.length > 0) {
        socket.send(JSON.stringify({
          type: 'sync',
          data: Array.from(state)
        }));
      }

      // Notify other clients about new connection
      broadcastToOthers(documentId, socket, {
        type: 'user-joined',
        userId: userId,
        timestamp: Date.now()
      });
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log(`Message received for document ${documentId}:`, message.type);

        switch (message.type) {
          case 'sync':
            // Apply update to document
            const update = new Uint8Array(message.data);
            Y.applyUpdate(doc, update);
            
            // Broadcast update to all other clients
            broadcastToOthers(documentId, socket, message);
            break;

          case 'awareness':
            // Broadcast awareness information (cursor position, selection, etc.)
            broadcastToOthers(documentId, socket, message);
            break;

          case 'note-update':
            // Handle note content updates
            broadcastToOthers(documentId, socket, {
              type: 'note-update',
              noteId: message.noteId,
              content: message.content,
              userId: userId,
              timestamp: Date.now()
            });
            break;

          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    socket.onclose = () => {
      console.log(`WebSocket closed for document: ${documentId}, user: ${userId}`);
      documentConnections.delete(socket);
      
      // Clean up document if no connections remain
      if (documentConnections.size === 0) {
        documents.delete(documentId);
        connections.delete(documentId);
      } else {
        // Notify other clients about disconnection
        broadcastToOthers(documentId, socket, {
          type: 'user-left',
          userId: userId,
          timestamp: Date.now()
        });
      }
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for document ${documentId}:`, error);
    };

    return response;
    
  } catch (error) {
    console.error('Error in WebSocket handler:', error);
    return new Response(`WebSocket error: ${error.message}`, { 
      status: 500,
      headers: corsHeaders 
    });
  }
});

function broadcastToOthers(documentId: string, sender: WebSocket, message: any) {
  const documentConnections = connections.get(documentId);
  if (!documentConnections) return;

  const messageStr = JSON.stringify(message);
  
  for (const socket of documentConnections) {
    if (socket !== sender && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(messageStr);
      } catch (error) {
        console.error('Error broadcasting message:', error);
        // Remove broken connection
        documentConnections.delete(socket);
      }
    }
  }
}