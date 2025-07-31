// Lightweight message handler to prevent blocking operations
import { logger } from './logger';

interface MessageHandler {
  id: string;
  handler: (event: MessageEvent) => void;
  maxExecutionTime: number;
}

export class OptimizedMessageService {
  private static handlers = new Map<string, MessageHandler>();
  private static isListening = false;
  private static messageQueue: MessageEvent[] = [];
  private static processingQueue = false;

  static initialize() {
    if (this.isListening || typeof window === 'undefined') return;

    // Single message listener with queue processing
    window.addEventListener('message', this.handleMessage.bind(this), { passive: true });
    this.isListening = true;
    
    logger.debug('✅ Optimized message service initialized');
  }

  private static handleMessage(event: MessageEvent) {
    // Queue messages instead of processing immediately
    this.messageQueue.push(event);
    
    if (!this.processingQueue) {
      this.processMessageQueue();
    }
  }

  private static processMessageQueue() {
    if (this.processingQueue) return;
    
    this.processingQueue = true;
    
    // Process messages in chunks to prevent blocking
    requestIdleCallback(() => {
      const startTime = performance.now();
      const maxBatchTime = 16; // Max 16ms per batch
      
      while (this.messageQueue.length > 0 && (performance.now() - startTime) < maxBatchTime) {
        const event = this.messageQueue.shift()!;
        this.processMessage(event);
      }
      
      this.processingQueue = false;
      
      // Continue processing if there are more messages
      if (this.messageQueue.length > 0) {
        this.processMessageQueue();
      }
    });
  }

  private static processMessage(event: MessageEvent) {
    for (const [id, messageHandler] of this.handlers.entries()) {
      try {
        const startTime = performance.now();
        
        messageHandler.handler(event);
        
        const executionTime = performance.now() - startTime;
        if (executionTime > messageHandler.maxExecutionTime) {
          logger.warn(`Message handler ${id} took ${executionTime.toFixed(2)}ms (limit: ${messageHandler.maxExecutionTime}ms)`);
        }
      } catch (error) {
        logger.error(`Error in message handler ${id}:`, error);
      }
    }
  }

  static addMessageHandler(
    id: string, 
    handler: (event: MessageEvent) => void,
    maxExecutionTime: number = 50 // Default 50ms limit
  ) {
    this.handlers.set(id, {
      id,
      handler,
      maxExecutionTime
    });
  }

  static removeMessageHandler(id: string): boolean {
    return this.handlers.delete(id);
  }

  static cleanup() {
    if (this.isListening && typeof window !== 'undefined') {
      window.removeEventListener('message', this.handleMessage.bind(this));
    }
    
    this.handlers.clear();
    this.messageQueue.length = 0;
    this.isListening = false;
    this.processingQueue = false;
    
    logger.debug('✅ Optimized message service cleaned up');
  }
}