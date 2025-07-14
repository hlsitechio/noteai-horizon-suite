/**
 * Security Services Public API
 */

export { SecurityHeadersService } from './securityHeadersService';
export { CSPService } from './cspService';
export { HSTSService } from './hstsService';
export { PermissionsPolicyService } from './permissionsPolicyService';
export { UnifiedSecurityService, unifiedSecurityService, withSecurity } from './unifiedSecurityService';

export type {
  SecurityHeadersConfig,
  CSPConfig,
  HSTSConfig,
  CSPViolation,
  SecurityScore
} from './types';

export type {
  SecurityContext,
  SecurityResult
} from './payloadValidationService';

export * from './utils';

// Create and export the singleton instance
import { SecurityHeadersService } from './securityHeadersService';
export const securityHeadersService = new SecurityHeadersService();