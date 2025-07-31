/**
 * Anti-Scraping Service - Advanced protection against bots, scrapers, and automated tools
 */
import { logger } from '@/utils/logger';
import { rateLimitingService } from './rateLimitingService';
import { userAgentAnalysisService } from './userAgentAnalysisService';
import { threatDetectionService } from './threatDetectionService';
import { auditLogService } from './auditLogService';
import type { SecurityContext, SecurityResult } from './payloadValidationService';

interface ScrapingIndicator {
  type: 'behavioral' | 'technical' | 'pattern' | 'content_protection';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  reason: string;
  evidence: string[];
}

interface BrowserFingerprint {
  userAgent: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  platform?: string;
  cookieEnabled?: boolean;
  javaEnabled?: boolean;
  webglSupported?: boolean;
  canvasFingerprint?: string;
}

export class AntiScrapingService {
  private suspiciousIPs = new Set<string>();
  private behaviorProfiles = new Map<string, any>();
  private contentAccessPatterns = new Map<string, number[]>();
  private honeypotTraps = new Set<string>();
  
  // Known scraping tools and frameworks
  private readonly scrapingSignatures = [
    // Python scraping libraries
    { pattern: /requests|urllib|scrapy|beautifulsoup|selenium|playwright/i, weight: 0.9 },
    { pattern: /python-requests|httpx|aiohttp/i, weight: 0.9 },
    
    // JavaScript/Node.js scraping
    { pattern: /puppeteer|cheerio|jsdom|node-fetch|axios/i, weight: 0.8 },
    { pattern: /headless|phantom/i, weight: 0.8 },
    
    // Browser automation
    { pattern: /webdriver|chromedriver|geckodriver/i, weight: 0.9 },
    { pattern: /automated|bot|crawler|spider/i, weight: 0.7 },
    
    // Command line tools
    { pattern: /curl|wget|httpie|aria2/i, weight: 0.9 },
    
    // Commercial scraping tools
    { pattern: /scrapy|octoparse|parsehub|scrapebox/i, weight: 0.9 },
    
    // AI/ML scraping indicators
    { pattern: /openai|anthropic|claude|gpt|llm|ai-scraper/i, weight: 0.8 },
    { pattern: /data-collector|content-extractor/i, weight: 0.7 },
  ];

  constructor() {
    this.initializeHoneypots();
    this.startBehaviorAnalysis();
  }

  /**
   * Main anti-scraping check
   */
  async checkForScraping(
    context: SecurityContext,
    fingerprint?: BrowserFingerprint,
    requestData?: any
  ): Promise<SecurityResult> {
    const indicators: ScrapingIndicator[] = [];

    // 1. User Agent Analysis
    const userAgentIndicators = this.analyzeUserAgent(context.userAgent || '');
    indicators.push(...userAgentIndicators);

    // 2. Behavioral Analysis
    const behaviorIndicators = this.analyzeBehavior(context);
    indicators.push(...behaviorIndicators);

    // 3. Rate Limiting Check
    const rateLimitIndicators = this.analyzeRateLimit(context);
    indicators.push(...rateLimitIndicators);

    // 4. Browser Fingerprint Analysis
    if (fingerprint) {
      const fingerprintIndicators = this.analyzeFingerprint(fingerprint, context);
      indicators.push(...fingerprintIndicators);
    }

    // 5. Content Access Pattern Analysis
    const patternIndicators = this.analyzeContentAccess(context);
    indicators.push(...patternIndicators);

    // 6. Honeypot Detection
    const honeypotIndicators = this.checkHoneypotAccess(context);
    indicators.push(...honeypotIndicators);

    // 7. Request Analysis
    if (requestData) {
      const requestIndicators = this.analyzeRequest(requestData, context);
      indicators.push(...requestIndicators);
    }

    // Calculate overall scraping score
    const scrapingScore = this.calculateScrapingScore(indicators);
    
    // Log analysis
    this.logScrapingAnalysis(context, indicators, scrapingScore);

    // Determine action based on score and indicators
    return this.determineAction(indicators, scrapingScore, context);
  }

  /**
   * Analyze user agent for scraping indicators
   */
  private analyzeUserAgent(userAgent: string): ScrapingIndicator[] {
    const indicators: ScrapingIndicator[] = [];

    if (!userAgent) {
      indicators.push({
        type: 'technical',
        severity: 'medium',
        confidence: 70,
        reason: 'Missing user agent',
        evidence: ['No user agent provided']
      });
      return indicators;
    }

    // Check against scraping signatures
    for (const { pattern, weight } of this.scrapingSignatures) {
      if (pattern.test(userAgent)) {
        indicators.push({
          type: 'technical',
          severity: weight > 0.8 ? 'high' : 'medium',
          confidence: Math.round(weight * 100),
          reason: 'Scraping tool detected in user agent',
          evidence: [`Pattern matched: ${pattern.source}`, `User agent: ${userAgent.substring(0, 100)}`]
        });
      }
    }

    // Check for suspicious characteristics
    if (userAgent.length < 20) {
      indicators.push({
        type: 'technical',
        severity: 'medium',
        confidence: 60,
        reason: 'Suspiciously short user agent',
        evidence: [`Length: ${userAgent.length}`, userAgent]
      });
    }

    if (userAgent.length > 1000) {
      indicators.push({
        type: 'technical',
        severity: 'medium',
        confidence: 50,
        reason: 'Suspiciously long user agent',
        evidence: [`Length: ${userAgent.length}`]
      });
    }

    // Check for headless browser indicators
    if (/headless|phantom|nightmare/i.test(userAgent)) {
      indicators.push({
        type: 'technical',
        severity: 'high',
        confidence: 90,
        reason: 'Headless browser detected',
        evidence: ['Headless browser pattern in user agent']
      });
    }

    return indicators;
  }

  /**
   * Analyze behavioral patterns
   */
  private analyzeBehavior(context: SecurityContext): ScrapingIndicator[] {
    const indicators: ScrapingIndicator[] = [];
    const key = context.ipAddress || context.userId || 'unknown';
    
    // Get or create behavior profile
    let profile = this.behaviorProfiles.get(key);
    if (!profile) {
      profile = {
        requestCount: 0,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        endpoints: new Set(),
        userAgents: new Set(),
        requestIntervals: [],
        patterns: []
      };
      this.behaviorProfiles.set(key, profile);
    }

    // Update profile
    profile.requestCount++;
    profile.lastSeen = Date.now();
    profile.endpoints.add(context.endpoint);
    if (context.userAgent) {
      profile.userAgents.add(context.userAgent);
    }

    // Calculate request interval
    const interval = Date.now() - profile.lastSeen;
    profile.requestIntervals.push(interval);
    if (profile.requestIntervals.length > 50) {
      profile.requestIntervals = profile.requestIntervals.slice(-50);
    }

    // Analyze patterns

    // 1. Rapid requests (bot-like behavior)
    const avgInterval = profile.requestIntervals.reduce((a, b) => a + b, 0) / profile.requestIntervals.length;
    if (avgInterval < 1000 && profile.requestCount > 10) {
      indicators.push({
        type: 'behavioral',
        severity: 'high',
        confidence: 85,
        reason: 'Rapid automated requests detected',
        evidence: [`Average interval: ${avgInterval}ms`, `Request count: ${profile.requestCount}`]
      });
    }

    // 2. Linear access pattern (sequential page scraping)
    if (profile.endpoints.size > 20) {
      const endpoints = Array.from(profile.endpoints) as string[];
      const sequentialPattern = this.detectSequentialPattern(endpoints);
      if (sequentialPattern > 0.7) {
        indicators.push({
          type: 'pattern',
          severity: 'medium',
          confidence: 70,
          reason: 'Sequential content access pattern detected',
          evidence: [`Pattern score: ${sequentialPattern}`, `Endpoints accessed: ${endpoints.length}`]
        });
      }
    }

    // 3. No human-like variations
    if (profile.requestCount > 20) {
      const intervalVariation = this.calculateVariation(profile.requestIntervals);
      if (intervalVariation < 0.2) {
        indicators.push({
          type: 'behavioral',
          severity: 'medium',
          confidence: 60,
          reason: 'Lack of human-like timing variation',
          evidence: [`Variation coefficient: ${intervalVariation}`]
        });
      }
    }

    // 4. Multiple user agents from same source
    if (profile.userAgents.size > 3) {
      indicators.push({
        type: 'behavioral',
        severity: 'medium',
        confidence: 65,
        reason: 'Multiple user agents from same source',
        evidence: [`User agent count: ${profile.userAgents.size}`]
      });
    }

    return indicators;
  }

  /**
   * Analyze rate limiting patterns
   */
  private analyzeRateLimit(context: SecurityContext): ScrapingIndicator[] {
    const indicators: ScrapingIndicator[] = [];
    
    // Check if rate limit is being hit frequently
    const rateLimitStatus = rateLimitingService.checkGlobalLimits(
      context.userId, 
      context.ipAddress
    );

    if (!rateLimitStatus) {
      indicators.push({
        type: 'behavioral',
        severity: 'high',
        confidence: 90,
        reason: 'Rate limit exceeded - automated behavior',
        evidence: ['Frequent rate limit violations indicate scraping']
      });
    }

    return indicators;
  }

  /**
   * Analyze browser fingerprint
   */
  private analyzeFingerprint(fingerprint: BrowserFingerprint, context: SecurityContext): ScrapingIndicator[] {
    const indicators: ScrapingIndicator[] = [];

    // Check for missing browser features
    const missingFeatures = [];
    if (fingerprint.cookieEnabled === false) missingFeatures.push('cookies');
    if (fingerprint.javaEnabled === false) missingFeatures.push('java');
    if (!fingerprint.webglSupported) missingFeatures.push('webgl');
    if (!fingerprint.canvasFingerprint) missingFeatures.push('canvas');

    if (missingFeatures.length > 2) {
      indicators.push({
        type: 'technical',
        severity: 'medium',
        confidence: 60,
        reason: 'Missing browser features suggest automation',
        evidence: [`Missing features: ${missingFeatures.join(', ')}`]
      });
    }

    // Check for suspicious screen resolution
    if (fingerprint.screenResolution) {
      const common = ['1920x1080', '1366x768', '1440x900', '1280x1024'];
      if (!common.some(res => fingerprint.screenResolution?.includes(res))) {
        indicators.push({
          type: 'technical',
          severity: 'low',
          confidence: 30,
          reason: 'Uncommon screen resolution',
          evidence: [`Resolution: ${fingerprint.screenResolution}`]
        });
      }
    }

    // Check for automation indicators in canvas fingerprint
    if (fingerprint.canvasFingerprint) {
      // Headless browsers often produce consistent canvas fingerprints
      if (fingerprint.canvasFingerprint.length < 10) {
        indicators.push({
          type: 'technical',
          severity: 'medium',
          confidence: 50,
          reason: 'Suspicious canvas fingerprint',
          evidence: ['Canvas fingerprint suggests automation']
        });
      }
    }

    return indicators;
  }

  /**
   * Analyze content access patterns
   */
  private analyzeContentAccess(context: SecurityContext): ScrapingIndicator[] {
    const indicators: ScrapingIndicator[] = [];
    const key = context.ipAddress || context.userId || 'unknown';
    
    if (!this.contentAccessPatterns.has(key)) {
      this.contentAccessPatterns.set(key, []);
    }

    const accessTimes = this.contentAccessPatterns.get(key)!;
    accessTimes.push(Date.now());

    // Keep only last 100 accesses
    if (accessTimes.length > 100) {
      accessTimes.splice(0, accessTimes.length - 100);
    }

    // Analyze access patterns
    if (accessTimes.length > 10) {
      // Check for systematic access (too regular)
      const intervals = [];
      for (let i = 1; i < accessTimes.length; i++) {
        intervals.push(accessTimes[i] - accessTimes[i-1]);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const stdDev = Math.sqrt(intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length);
      const coefficient = stdDev / avgInterval;

      if (coefficient < 0.3 && avgInterval < 5000) { // Very regular, fast access
        indicators.push({
          type: 'pattern',
          severity: 'high',
          confidence: 80,
          reason: 'Systematic content access pattern',
          evidence: [`Coefficient of variation: ${coefficient.toFixed(3)}`, `Average interval: ${avgInterval}ms`]
        });
      }
    }

    return indicators;
  }

  /**
   * Check for honeypot access
   */
  private checkHoneypotAccess(context: SecurityContext): ScrapingIndicator[] {
    const indicators: ScrapingIndicator[] = [];

    if (context.endpoint && this.honeypotTraps.has(context.endpoint)) {
      indicators.push({
        type: 'content_protection',
        severity: 'critical',
        confidence: 95,
        reason: 'Honeypot trap accessed',
        evidence: [`Accessed hidden endpoint: ${context.endpoint}`]
      });
    }

    return indicators;
  }

  /**
   * Analyze request characteristics
   */
  private analyzeRequest(requestData: any, context: SecurityContext): ScrapingIndicator[] {
    const indicators: ScrapingIndicator[] = [];

    // Check for missing typical browser headers
    const expectedHeaders = ['accept', 'accept-language', 'accept-encoding', 'cache-control'];
    const missingHeaders = expectedHeaders.filter(h => !requestData.headers?.[h]);

    if (missingHeaders.length > 2) {
      indicators.push({
        type: 'technical',
        severity: 'medium',
        confidence: 60,
        reason: 'Missing typical browser headers',
        evidence: [`Missing headers: ${missingHeaders.join(', ')}`]
      });
    }

    // Check for suspicious accept headers
    const accept = requestData.headers?.accept;
    if (accept && !accept.includes('text/html')) {
      indicators.push({
        type: 'technical',
        severity: 'low',
        confidence: 40,
        reason: 'Unusual accept header',
        evidence: [`Accept: ${accept}`]
      });
    }

    // Check for automation-specific headers
    const automationHeaders = ['x-requested-with', 'x-automation', 'x-bot'];
    const foundAutomationHeaders = automationHeaders.filter(h => requestData.headers?.[h]);
    
    if (foundAutomationHeaders.length > 0) {
      indicators.push({
        type: 'technical',
        severity: 'high',
        confidence: 90,
        reason: 'Automation headers detected',
        evidence: [`Headers: ${foundAutomationHeaders.join(', ')}`]
      });
    }

    return indicators;
  }

  /**
   * Calculate overall scraping score
   */
  private calculateScrapingScore(indicators: ScrapingIndicator[]): number {
    let score = 0;
    
    for (const indicator of indicators) {
      const severityWeight = {
        low: 1,
        medium: 2,
        high: 4,
        critical: 8
      }[indicator.severity];

      score += (indicator.confidence / 100) * severityWeight;
    }

    // Normalize to 0-100 scale
    return Math.min(100, score * 10);
  }

  /**
   * Determine action based on analysis
   */
  private determineAction(
    indicators: ScrapingIndicator[], 
    scrapingScore: number, 
    context: SecurityContext
  ): SecurityResult {
    // Critical indicators = immediate block
    if (indicators.some(i => i.severity === 'critical')) {
      this.blockIP(context.ipAddress);
      return {
        allowed: false,
        reason: 'Critical scraping indicators detected',
        action: 'block'
      };
    }

    // High score = block
    if (scrapingScore > 70) {
      this.addToSuspiciousList(context.ipAddress);
      return {
        allowed: false,
        reason: `High scraping probability (score: ${scrapingScore})`,
        action: 'block'
      };
    }

    // Medium score = challenge or monitor
    if (scrapingScore > 40) {
      return {
        allowed: true,
        reason: `Moderate scraping probability (score: ${scrapingScore})`,
        action: 'monitor' // Monitor closely for CAPTCHA implementation
      };
    }

    // Low score = monitor
    if (scrapingScore > 20) {
      return {
        allowed: true,
        action: 'monitor'
      };
    }

    return { allowed: true };
  }

  /**
   * Initialize honeypot traps
   */
  private initializeHoneypots(): void {
    // Add some common honeypot endpoints
    const honeypots = [
      '/robots.txt.backup',
      '/admin.php',
      '/wp-admin',
      '/hidden-content',
      '/api/internal',
      '/.env',
      '/backup.sql',
      '/admin/users.json'
    ];

    honeypots.forEach(trap => this.honeypotTraps.add(trap));
  }

  /**
   * Utility methods
   */
  private detectSequentialPattern(endpoints: string[]): number {
    // Simple pattern detection - look for numeric sequences
    const numericEndpoints = endpoints
      .map(e => e.match(/\d+/))
      .filter(Boolean)
      .map(m => parseInt(m![0]))
      .sort((a, b) => a - b);

    if (numericEndpoints.length < 3) return 0;

    let sequential = 0;
    for (let i = 1; i < numericEndpoints.length; i++) {
      if (numericEndpoints[i] === numericEndpoints[i-1] + 1) {
        sequential++;
      }
    }

    return sequential / (numericEndpoints.length - 1);
  }

  private calculateVariation(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return stdDev / mean;
  }

  private addToSuspiciousList(ip?: string): void {
    if (ip) {
      this.suspiciousIPs.add(ip);
    }
  }

  private blockIP(ip?: string): void {
    if (ip) {
      this.suspiciousIPs.add(ip);
      // In production, this would integrate with firewall/CDN
      logger.warn('ANTI_SCRAPING', 'IP blocked for scraping', { ip });
    }
  }

  private logScrapingAnalysis(
    context: SecurityContext, 
    indicators: ScrapingIndicator[], 
    score: number
  ): void {
    if (indicators.length > 0) {
      auditLogService.logEvent({
        eventType: 'anti_scraping_analysis',
        userId: context.userId,
        ipAddress: context.ipAddress,
        endpoint: context.endpoint,
        userAgent: context.userAgent,
        riskLevel: score > 70 ? 'high' : score > 40 ? 'medium' : 'low',
        result: score > 70 ? 'blocked' : 'success',
        metadata: {
          scrapingScore: score,
          indicatorCount: indicators.length,
          indicators: indicators.map(i => ({
            type: i.type,
            severity: i.severity,
            confidence: i.confidence,
            reason: i.reason
          }))
        }
      });
    }
  }

  private startBehaviorAnalysis(): void {
    // Clean up old behavior profiles every hour
    setInterval(() => {
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      
      for (const [key, profile] of this.behaviorProfiles.entries()) {
        if (profile.lastSeen < oneHourAgo) {
          this.behaviorProfiles.delete(key);
        }
      }
    }, 60 * 60 * 1000);
  }

  /**
   * Get anti-scraping statistics
   */
  getStats() {
    return {
      suspiciousIPs: this.suspiciousIPs.size,
      behaviorProfiles: this.behaviorProfiles.size,
      honeypotTraps: this.honeypotTraps.size,
      scrapingSignatures: this.scrapingSignatures.length,
      service: 'AntiScrapingService'
    };
  }

  /**
   * Add custom honeypot endpoint
   */
  addHoneypot(endpoint: string): void {
    this.honeypotTraps.add(endpoint);
  }

  /**
   * Check if IP is suspicious
   */
  isSuspiciousIP(ip: string): boolean {
    return this.suspiciousIPs.has(ip);
  }
}

export const antiScrapingService = new AntiScrapingService();
