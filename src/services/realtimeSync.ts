import * as Y from 'yjs';

export interface RealtimeSyncConfig {
  documentId: string;
  userId: string;
  onContentChange?: (content: string) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
}

// Global connection registry to prevent multiple connections to same document
const connectionRegistry = new Map<string, RealtimeSyncService>();

export class RealtimeSyncService {
  private doc: Y.Doc;
  private provider: WebSocket | null = null;
  private config: RealtimeSyncConfig;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3; // Reduced from 5
  private reconnectDelay = 2000; // Increased base delay
  private connectionKey: string;
  private isDestroyed = false;
  private reconnectTimeout: number | null = null;

  constructor(config: RealtimeSyncConfig) {
    this.config = config;
    this.connectionKey = `${config.documentId}-${config.userId}`;
    
    // Check if connection already exists for this document/user
    const existingConnection = connectionRegistry.get(this.connectionKey);
    if (existingConnection && !existingConnection.isDestroyed) {
      throw new Error(`Connection already exists for document ${config.documentId} and user ${config.userId}`);
    }
    
    this.doc = new Y.Doc();
    this.setupDocument();
    
    // Register this connection
    connectionRegistry.set(this.connectionKey, this);
    
    // Connect after a short delay to prevent immediate resource exhaustion
    setTimeout(() => {
      if (!this.isDestroyed) {
        this.connect();
      }
    }, 100);
  }

  private setupDocument() {
    // Create shared text type for note content
    const sharedText = this.doc.getText('content');
    
    // Listen for content changes
    sharedText.observe(() => {
      const content = sharedText.toString();
      this.config.onContentChange?.(content);
    });
  }

  private connect() {
    try {
      const wsUrl = `wss://ubxtmbgvibtjtjggjnjm.supabase.co/functions/v1/realtime-collaboration?documentId=${this.config.documentId}&userId=${this.config.userId}`;
      
      this.provider = new WebSocket(wsUrl);
      
      this.provider.onopen = () => {
        console.log('Connected to realtime sync');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.config.onConnectionStatusChange?.(true);
      };

      this.provider.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      this.provider.onclose = () => {
        console.log('Disconnected from realtime sync');
        this.connected = false;
        this.config.onConnectionStatusChange?.(false);
        this.attemptReconnect();
      };

      this.provider.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect to realtime sync:', error);
      this.attemptReconnect();
    }
  }

  private handleMessage(message: any) {
    switch (message.type) {
      case 'sync':
        // Apply update from other clients
        const update = new Uint8Array(message.data);
        Y.applyUpdate(this.doc, update);
        break;

      case 'user-joined':
        this.config.onUserJoined?.(message.userId);
        break;

      case 'user-left':
        this.config.onUserLeft?.(message.userId);
        break;

      case 'note-update':
        // Handle direct note updates
        this.updateContent(message.content, false);
        break;
    }
  }

  private attemptReconnect() {
    if (this.isDestroyed) {
      return;
    }

    // Clear any existing reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000); // Cap at 30 seconds
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      this.reconnectTimeout = window.setTimeout(() => {
        if (!this.isDestroyed) {
          this.connect();
        }
      }, delay);
    } else {
      console.error('Max reconnection attempts reached for document', this.config.documentId);
      // Stop trying to reconnect
      this.config.onConnectionStatusChange?.(false);
    }
  }

  public updateContent(content: string, broadcast: boolean = true) {
    const sharedText = this.doc.getText('content');
    
    // Clear and insert new content
    sharedText.delete(0, sharedText.length);
    sharedText.insert(0, content);

    if (broadcast && this.provider && this.connected) {
      // Send update to other clients
      const update = Y.encodeStateAsUpdate(this.doc);
      this.provider.send(JSON.stringify({
        type: 'sync',
        data: Array.from(update)
      }));
    }
  }

  public sendNoteUpdate(noteId: string, content: string) {
    if (this.provider && this.connected) {
      this.provider.send(JSON.stringify({
        type: 'note-update',
        noteId,
        content,
        userId: this.config.userId
      }));
    }
  }

  public getContent(): string {
    return this.doc.getText('content').toString();
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public disconnect() {
    this.isDestroyed = true;
    
    // Clear any pending reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Remove from connection registry
    connectionRegistry.delete(this.connectionKey);
    
    if (this.provider) {
      this.provider.close();
      this.provider = null;
    }
    
    this.connected = false;
    this.doc.destroy();
  }
}