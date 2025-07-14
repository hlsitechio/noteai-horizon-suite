/**
 * Security Headers Type Definitions
 */

export interface CSPConfig {
  enabled: boolean;
  directives: Record<string, string | string[]>;
  reportUri?: string;
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
}

export interface SecurityScore {
  score: number;
  recommendations: string[];
}