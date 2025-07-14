/**
 * HTTP Strict Transport Security Service
 */

import { HSTSConfig } from './types';

export class HSTSService {
  private config: HSTSConfig;

  constructor(config: HSTSConfig) {
    this.config = config;
  }

  generateHSTSHeader(): string {
    if (!this.config.enabled) return '';

    let hsts = `max-age=${this.config.maxAge}`;
    
    if (this.config.includeSubDomains) {
      hsts += '; includeSubDomains';
    }
    
    if (this.config.preload) {
      hsts += '; preload';
    }

    return hsts;
  }

  getHSTSScore(): number {
    let score = 0;
    
    if (this.config.enabled) {
      score += 15;
      if (this.config.includeSubDomains) score += 3;
      if (this.config.preload) score += 2;
    }
    
    return score;
  }
}