import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as Y from "https://esm.sh/yjs@13.6.27";
import * as awarenessProtocol from "https://esm.sh/y-protocols@1.0.5/awareness.js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
};

// Store for Y.js documents and awareness
const documents = new Map<string, Y.Doc>();
const awareness = new Map<string, any>();
const connections = new Map<string, Set<WebSocket>>();

serve((req) => {
  console.log('Realtime collaboration function called', req.method, req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if this is a WebSocket upgrade request
  const upgrade = req.headers.get('upgrade') || '';
  if (upgrade.toLowerCase() !== 'websocket') {
    console.log('Not a WebSocket request, upgrade header:', upgrade);
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  const url = new URL(req.url);
  const documentId = url.searchParams.get('documentId') || 'default';
  const userId = url.searchParams.get('userId') || 'anonymous';

  console.log(`WebSocket connection request for document: ${documentId}, user: ${userId}`);

  // Upgrade to WebSocket
  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log('WebSocket upgrade successful');
  
  // Get or create Y.js document and awareness
  if (!documents.has(documentId)) {
    documents.set(documentId, new Y.Doc());
    awareness.set(documentId, new awarenessProtocol.Awareness(documents.get(documentId)));
    connections.set(documentId, new Set());
    console.log(`Created new document and awareness: ${documentId}`);
  }

  const doc = documents.get(documentId)!;
  const docAwareness = awareness.get(documentId)!;
  const documentConnections = connections.get(documentId)!;

  socket.onopen = () => {
    console.log(`WebSocket opened for document: ${documentId}, user: ${userId}`);
    documentConnections.add(socket);

    try {
      // Send current document state to new client
      const state = Y.encodeStateAsUpdate(doc);
      if (state.length > 0) {
        socket.send(JSON.stringify({
          type: 'sync',
          data: Array.from(state)
        }));
        console.log(`Sent initial state to user ${userId}`);
      }

      // Send current awareness state to new client
      const awarenessState = awarenessProtocol.encodeAwarenessUpdate(
        docAwareness,
        Array.from(docAwareness.getStates().keys())
      );
      if (awarenessState.length > 0) {
        socket.send(JSON.stringify({
          type: 'awareness',
          data: Array.from(awarenessState)
        }));
        console.log(`Sent initial awareness state to user ${userId}`);
      }

      // Notify other clients about new connection
      broadcastToOthers(documentId, socket, {
        type: 'user-joined',
        userId: userId,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error in onopen handler:', error);
    }
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
          // Apply awareness update to local awareness instance
          const awarenessUpdate = new Uint8Array(message.data);
          awarenessProtocol.applyAwarenessUpdate(docAwareness, awarenessUpdate, 'remote');
          
          // Broadcast awareness update to all other clients
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
      console.error('Message data:', event.data);
    }
  };

  socket.onclose = () => {
    console.log(`WebSocket closed for document: ${documentId}, user: ${userId}`);
    documentConnections.delete(socket);
    
    // Clean up document if no connections remain
    if (documentConnections.size === 0) {
      // Clean up awareness states for this document
      if (docAwareness) {
        docAwareness.destroy();
        awareness.delete(documentId);
      }
      documents.delete(documentId);
      connections.delete(documentId);
      console.log(`Cleaned up document and awareness: ${documentId}`);
    } else {
      // Notify other clients about disconnection
      try {
        broadcastToOthers(documentId, socket, {
          type: 'user-left',
          userId: userId,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('Error broadcasting user left:', error);
      }
    }
  };

  socket.onerror = (error) => {
    console.error(`WebSocket error for document ${documentId}:`, error);
  };

  return response;
});

function broadcastToOthers(documentId: string, sender: WebSocket, message: any) {
  const documentConnections = connections.get(documentId);
  if (!documentConnections) {
    console.log(`No connections found for document: ${documentId}`);
    return;
  }

  const messageStr = JSON.stringify(message);
  console.log(`Broadcasting to ${documentConnections.size - 1} clients for document: ${documentId}`);
  
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