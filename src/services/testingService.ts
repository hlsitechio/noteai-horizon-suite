
import { logger } from '../utils/logger';

interface TestResult {
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  timestamp: number;
}

interface TestSuite {
  suiteName: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  duration: number;
}

export class TestingService {
  private static testResults: Map<string, TestSuite> = new Map();
  private static isRunning = false;

  static async runComponentTests(): Promise<TestSuite> {
    this.isRunning = true;
    const startTime = performance.now();
    const results: TestResult[] = [];

    try {
      // Test critical components
      const componentTests = [
        { name: 'Sidebar Navigation', test: () => this.testSidebarNavigation() },
        { name: 'Dashboard Loading', test: () => this.testDashboardLoading() },
        { name: 'User Authentication', test: () => this.testUserAuth() },
        { name: 'Error Handling', test: () => this.testErrorHandling() },
        { name: 'Performance Metrics', test: () => this.testPerformanceMetrics() }
      ];

      for (const { name, test } of componentTests) {
        const testStart = performance.now();
        try {
          await test();
          results.push({
            testName: name,
            status: 'passed',
            duration: performance.now() - testStart,
            timestamp: Date.now()
          });
        } catch (error) {
          results.push({
            testName: name,
            status: 'failed',
            duration: performance.now() - testStart,
            error: error instanceof Error ? error.message : String(error),
            timestamp: Date.now()
          });
        }
      }

      const suite: TestSuite = {
        suiteName: 'Component Tests',
        tests: results,
        totalTests: results.length,
        passedTests: results.filter(r => r.status === 'passed').length,
        failedTests: results.filter(r => r.status === 'failed').length,
        skippedTests: results.filter(r => r.status === 'skipped').length,
        duration: performance.now() - startTime
      };

      this.testResults.set('component-tests', suite);
      logger.info('Component tests completed', { suite });
      
      return suite;
    } finally {
      this.isRunning = false;
    }
  }

  private static async testSidebarNavigation(): Promise<void> {
    // Test sidebar exists and is functional
    const sidebar = document.querySelector('[data-onboarding="sidebar"]');
    if (!sidebar) {
      throw new Error('Sidebar not found');
    }

    // Test navigation items
    const navItems = sidebar.querySelectorAll('[role="button"], button, a');
    if (navItems.length === 0) {
      throw new Error('No navigation items found in sidebar');
    }
  }

  private static async testDashboardLoading(): Promise<void> {
    // Test dashboard initialization
    const dashboard = document.querySelector('[data-testid="dashboard"]') || 
                     document.querySelector('.dashboard') ||
                     document.querySelector('[class*="dashboard"]');
    
    if (!dashboard) {
      // Dashboard might be loading, wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      const retryDashboard = document.querySelector('[data-testid="dashboard"]') || 
                            document.querySelector('.dashboard');
      if (!retryDashboard) {
        throw new Error('Dashboard not found after loading');
      }
    }
  }

  private static async testUserAuth(): Promise<void> {
    // Test if user context is available
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('supabase.auth.token') || 
                       sessionStorage.getItem('supabase.auth.token');
      if (!authData) {
        throw new Error('No authentication data found');
      }
    }
  }

  private static async testErrorHandling(): Promise<void> {
    // Test error boundaries and handlers
    const errorElements = document.querySelectorAll('[data-error], .error-boundary');
    // This test passes if no critical errors are displayed
    const criticalErrors = Array.from(errorElements).filter(el => 
      el.textContent?.includes('critical') || 
      el.textContent?.includes('fatal')
    );
    
    if (criticalErrors.length > 0) {
      throw new Error(`Found ${criticalErrors.length} critical errors displayed`);
    }
  }

  private static async testPerformanceMetrics(): Promise<void> {
    // Test performance monitoring
    const performanceEntries = performance.getEntriesByType('navigation');
    if (performanceEntries.length === 0) {
      throw new Error('No performance navigation entries found');
    }

    const navigationEntry = performanceEntries[0] as PerformanceNavigationTiming;
    const loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
    
    if (loadTime > 5000) {
      throw new Error(`Page load time too slow: ${loadTime}ms`);
    }
  }

  static getTestResults(): Map<string, TestSuite> {
    return this.testResults;
  }

  static getHealthScore(): number {
    let totalTests = 0;
    let passedTests = 0;

    for (const suite of this.testResults.values()) {
      totalTests += suite.totalTests;
      passedTests += suite.passedTests;
    }

    return totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  }

  static isTestingInProgress(): boolean {
    return this.isRunning;
  }
}
