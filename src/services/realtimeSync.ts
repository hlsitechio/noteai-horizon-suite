import * as Y from 'yjs';

export interface RealtimeSyncConfig {
  documentId: string;
  userId: string;
  onContentChange?: (content: string) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
  onConnectionStatusChange?: (connected: boolean, connecting?: boolean) => void;
  onError?: (error: string) => void;
}

// Global connection registry to prevent multiple connections to same document
const connectionRegistry = new Map<string, RealtimeSyncService>();

export class RealtimeSyncService {
  private doc: Y.Doc;
  private provider: WebSocket | null = null;
  private config: RealtimeSyncConfig;
  private connected = false;
  private connecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;
  private connectionKey: string;
  private isDestroyed = false;
  private reconnectTimeout: number | null = null;
  private lastError: string | null = null;

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
    if (this.isDestroyed || this.connecting) {
      return;
    }

    this.connecting = true;
    this.config.onConnectionStatusChange?.(false, true);

    try {
      const wsUrl = `wss://ubxtmbgvibtjtjggjnjm.supabase.co/functions/v1/realtime-collaboration?documentId=${this.config.documentId}&userId=${this.config.userId}`;
      
      this.provider = new WebSocket(wsUrl);
      
      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (this.connecting) {
          this.provider?.close();
          this.handleConnectionError('Connection timeout');
        }
      }, 10000);
      
      this.provider.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('Connected to realtime sync');
        this.connected = true;
        this.connecting = false;
        this.reconnectAttempts = 0;
        this.lastError = null;
        this.config.onConnectionStatusChange?.(true, false);
      };

      this.provider.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing message:', error);
          this.config.onError?.('Failed to parse server message');
        }
      };

      this.provider.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('Disconnected from realtime sync', event.code, event.reason);
        this.connected = false;
        this.connecting = false;
        
        const reason = event.reason || `Connection closed (code: ${event.code})`;
        this.lastError = reason;
        
        this.config.onConnectionStatusChange?.(false, false);
        
        // Don't auto-reconnect on certain error codes
        if (event.code !== 1000 && event.code !== 1001) {
          this.attemptReconnect();
        }
      };

      this.provider.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket error:', error);
        this.handleConnectionError('WebSocket connection failed');
      };

    } catch (error) {
      console.error('Failed to connect to realtime sync:', error);
      this.handleConnectionError(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private handleConnectionError(errorMessage: string) {
    this.connecting = false;
    this.connected = false;
    this.lastError = errorMessage;
    this.config.onConnectionStatusChange?.(false, false);
    this.config.onError?.(errorMessage);
    this.attemptReconnect();
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

  public isConnecting(): boolean {
    return this.connecting;
  }

  public getLastError(): string | null {
    return this.lastError;
  }

  public retry() {
    if (!this.connected && !this.connecting) {
      this.reconnectAttempts = 0;
      this.connect();
    }
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