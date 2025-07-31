/**
 * Context Validation Utilities
 * Helps debug React context issues and provider problems
 */

interface ContextInfo {
  name: string;
  isAvailable: boolean;
  error?: string;
}

/**
 * Validate that all required contexts are available
 */
export const validateContexts = (): ContextInfo[] => {
  const results: ContextInfo[] = [];

  // Test AuthContext
  try {
    const { useAuth } = require('../contexts/AuthContext');
    const authContext = useAuth();
    results.push({
      name: 'AuthContext',
      isAvailable: !!authContext,
    });
  } catch (error) {
    results.push({
      name: 'AuthContext',
      isAvailable: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  // Test OnboardingContext
  try {
    const { useOnboardingContext } = require('../components/Onboarding/OnboardingProvider');
    const onboardingContext = useOnboardingContext();
    results.push({
      name: 'OnboardingContext',
      isAvailable: !!onboardingContext,
    });
  } catch (error) {
    results.push({
      name: 'OnboardingContext',
      isAvailable: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }

  return results;
};

/**
 * Log context validation results
 */
export const logContextValidation = () => {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('🔍 Context Validation');
  const results = validateContexts();
  
  results.forEach(({ name, isAvailable, error }) => {
    if (isAvailable) {
      console.log(`✅ ${name}: Available`);
    } else {
      console.error(`❌ ${name}: ${error || 'Not available'}`);
    }
  });
  
  console.groupEnd();
};

/**
 * React hook to validate contexts in development
 */
export const useContextValidation = () => {
  if (typeof window === 'undefined') return;
  
  const { useEffect } = require('react') as typeof import('react');

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Delay validation to ensure all providers are mounted
      setTimeout(logContextValidation, 100);
    }
  }, []);
};

// Development helper
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__validateContexts = validateContexts;
  (window as any).__logContextValidation = logContextValidation;
}