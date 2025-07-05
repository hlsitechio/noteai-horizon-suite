/**
 * DEPRECATED: This file has been refactored into modular security services.
 * Use the new services from '@/services/security' instead.
 * 
 * @deprecated Use unifiedSecurityService from '@/services/security'
 */

import { unifiedSecurityService, withSecurity } from './security';

// Re-export for backward compatibility
export { unifiedSecurityService as securityService, withSecurity };

// Type exports for backward compatibility
export type { SecurityContext, SecurityResult } from './security';