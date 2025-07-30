import * as Y from 'yjs';
import * as awarenessProtocol from 'y-protocols/awareness.js';

export interface RealtimeSyncConfig {
  documentId: string;
  userId: string;
  userName?: string;
  userColor?: string;
  onContentChange?: (content: string) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
  onConnectionStatusChange?: (connected: boolean, connecting?: boolean) => void;
  onError?: (error: string) => void;
  onAwarenessChange?: (states: Map<number, any>) => void;
  onCursorChange?: (cursors: Array<{ clientId: number, user: any, cursor: any }>) => void;
}

// Global connection registry to prevent multiple connections to same document
const connectionRegistry = new Map<string, RealtimeSyncService>();

export class RealtimeSyncService {
  private doc: Y.Doc;
  private awareness: awarenessProtocol.Awareness;
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
    this.awareness = new awarenessProtocol.Awareness(this.doc);
    this.setupDocument();
    this.setupAwareness();
    
    // Register this connection
    connectionRegistry.set(this.connectionKey, this);
    
    // Set initial user state
    this.setUserState({
      user: {
        id: config.userId,
        name: config.userName || 'Anonymous',
        color: config.userColor || this.generateUserColor()
      }
    });
    
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

  private setupAwareness() {
    // Listen for awareness changes
    this.awareness.on('change', ({ added, updated, removed }) => {
      console.log('Awareness changed:', { added, updated, removed });
      this.config.onAwarenessChange?.(this.awareness.getStates());
      
      // Extract cursor information
      const cursors = Array.from(this.awareness.getStates().entries())
        .filter(([clientId]) => clientId !== this.awareness.clientID)
        .map(([clientId, state]) => ({
          clientId,
          user: state.user,
          cursor: state.cursor
        }));
      
      this.config.onCursorChange?.(cursors);
    });

    // Broadcast awareness updates
    this.awareness.on('update', ({ added, updated, removed }) => {
      if (this.provider && this.connected) {
        const changedClients = added.concat(updated).concat(removed);
        const update = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients);
        
        this.provider.send(JSON.stringify({
          type: 'awareness',
          data: Array.from(update)
        }));
      }
    });
  }

  private generateUserColor(): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private connect() {
    // Real-time connections completely disabled
    console.log('Real-time subscription for tasks disabled');
    
    if (this.isDestroyed) {
      return;
    }
    
    // Never attempt connections
    this.connecting = false;
    this.connected = false;
    this.config.onConnectionStatusChange?.(false, false);
    return;
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

      case 'awareness':
        // Apply awareness update
        const awarenessUpdate = new Uint8Array(message.data);
        awarenessProtocol.applyAwarenessUpdate(this.awareness, awarenessUpdate, 'remote');
        break;

      case 'user-joined':
        this.config.onUserJoined?.(message.userId);
        break;

      case 'user-left':
        this.config.onUserLeft?.(message.userId);
        // Remove awareness state for disconnected user
        if (message.clientId) {
          awarenessProtocol.removeAwarenessStates(this.awareness, [message.clientId], 'user-left');
        }
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

  public setUserState(state: any) {
    this.awareness.setLocalState(state);
  }

  public setCursor(position: any) {
    const currentState = this.awareness.getLocalState();
    this.awareness.setLocalState({
      ...currentState,
      cursor: position
    });
  }

  public setSelection(selection: any) {
    const currentState = this.awareness.getLocalState();
    this.awareness.setLocalState({
      ...currentState,
      selection: selection
    });
  }

  public getAwarenessStates(): Map<number, any> {
    return this.awareness.getStates();
  }

  public disconnect() {
    this.isDestroyed = true;
    
    // Clear any pending reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    // Mark local client as offline before disconnecting
    if (this.awareness) {
      awarenessProtocol.removeAwarenessStates(
        this.awareness,
        [this.awareness.clientID],
        'disconnect'
      );
      this.awareness.destroy();
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