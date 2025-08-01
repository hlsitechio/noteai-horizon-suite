/**
 * Security Headers Type Definitions
 */

export interface CSPConfig {
  enabled: boolean;
  directives: Record<string, string | string[]>;
  reportUri?: string;
  reportTo?: string;
  reportOnly?: boolean;
}

export interface HSTSConfig {
  enabled: boolean;
  maxAge: number;
  includeSubDomains: boolean;
  preload: boolean;
}

export interface SecurityHeadersConfig {
  csp: CSPConfig;
  hsts: HSTSConfig;
  frameOptions: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';
  contentTypeOptions: boolean;
  referrerPolicy: string;
  permissionsPolicy: Record<string, string[]>;
}

export interface CSPViolation {
  documentUri: string;
  violatedDirective: string;
  blockedUri: string;
  sourceFile?: string;
  lineNumber?: number;
  timestamp?: string;
  severity?: 'high' | 'medium' | 'low';
  category?: string;
}

export interface SecurityScore {
  score: number;
  recommendations: string[];
}