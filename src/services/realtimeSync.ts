import * as Y from 'yjs';

export interface RealtimeSyncConfig {
  documentId: string;
  userId: string;
  onContentChange?: (content: string) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
}

export class RealtimeSyncService {
  private doc: Y.Doc;
  private provider: WebSocket | null = null;
  private config: RealtimeSyncConfig;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(config: RealtimeSyncConfig) {
    this.config = config;
    this.doc = new Y.Doc();
    this.setupDocument();
    this.connect();
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
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
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
    if (this.provider) {
      this.provider.close();
      this.provider = null;
    }
    this.doc.destroy();
  }
}