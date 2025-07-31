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
  private config: RealtimeSyncConfig;
  private isDestroyed = false;

  constructor(config: RealtimeSyncConfig) {
    this.config = config;
    // All real-time functionality disabled
    console.log('RealtimeSyncService: Real-time functionality disabled');
  }

  // All real-time functionality removed

  // All connection methods removed - real-time disabled

  public updateContent(content: string, broadcast: boolean = true) {
    // Real-time functionality disabled
  }

  public sendNoteUpdate(noteId: string, content: string) {
    // Real-time functionality disabled
  }

  public getContent(): string {
    return '';
  }

  public isConnected(): boolean {
    return false;
  }

  public isConnecting(): boolean {
    return false;
  }

  public getLastError(): string | null {
    return 'Real-time functionality disabled';
  }

  public retry() {
    // Real-time functionality disabled
  }

  public setUserState(state: any) {
    // Real-time functionality disabled
  }

  public setCursor(position: any) {
    // Real-time functionality disabled
  }

  public setSelection(selection: any) {
    // Real-time functionality disabled
  }

  public getAwarenessStates(): Map<number, any> {
    return new Map();
  }

  public disconnect() {
    this.isDestroyed = true;
  }
}