
export class DatabasePerformanceService {
  private static performanceMetrics = new Map<string, {
    totalTime: number;
    callCount: number;
    slowestExecution: number;
    averageTime: number;
    lastUpdated: Date;
  }>();

  static async analyzeQueryPerformance() {
    const issues = [];
    
    // Check for long-running queries
    const longRunningThreshold = 1000; // 1 second
    const highFrequencyThreshold = 1000; // 1000+ calls
    const totalTimeThreshold = 10000; // 10+ seconds total

    for (const [query, metrics] of this.performanceMetrics) {
      if (metrics.slowestExecution > longRunningThreshold) {
        issues.push({
          type: 'slow_query',
          query,
          slowestTime: metrics.slowestExecution,
          severity: 'high'
        });
      }

      if (metrics.callCount > highFrequencyThreshold) {
        issues.push({
          type: 'high_frequency',
          query,
          callCount: metrics.callCount,
          severity: 'medium'
        });
      }

      if (metrics.totalTime > totalTimeThreshold) {
        issues.push({
          type: 'high_total_time',
          query,
          totalTime: metrics.totalTime,
          severity: 'critical'
        });
      }
    }

    return issues;
  }

  static async getOptimizationRecommendations() {
    const recommendations = [];
    
    // Common optimization strategies
    recommendations.push({
      category: 'Indexing',
      actions: [
        'Add composite indexes on frequently queried columns',
        'Create partial indexes for filtered queries',
        'Add text search indexes for content searches'
      ]
    });

    recommendations.push({
      category: 'Query Optimization',
      actions: [
        'Use query batching for multiple similar operations',
        'Implement pagination for large result sets',
        'Add query result caching',
        'Use materialized views for complex aggregations'
      ]
    });

    recommendations.push({
      category: 'Connection Management',
      actions: [
        'Implement connection pooling',
        'Reduce database round trips',
        'Use prepared statements',
        'Optimize transaction boundaries'
      ]
    });

    return recommendations;
  }

  static logQueryPerformance(queryName: string, executionTime: number) {
    const existing = this.performanceMetrics.get(queryName) || {
      totalTime: 0,
      callCount: 0,
      slowestExecution: 0,
      averageTime: 0,
      lastUpdated: new Date()
    };

    existing.totalTime += executionTime;
    existing.callCount += 1;
    existing.slowestExecution = Math.max(existing.slowestExecution, executionTime);
    existing.averageTime = existing.totalTime / existing.callCount;
    existing.lastUpdated = new Date();

    this.performanceMetrics.set(queryName, existing);

    // Log critical performance issues immediately
    if (executionTime > 500) {
      console.warn(`🐌 Slow query detected: ${queryName} took ${executionTime}ms`);
    }

    if (existing.callCount > 1000 && existing.callCount % 100 === 0) {
      console.warn(`🔥 High frequency query: ${queryName} called ${existing.callCount} times`);
    }
  }

  static getPerformanceReport() {
    const metrics = Array.from(this.performanceMetrics.entries())
      .map(([query, data]) => ({ query, ...data }))
      .sort((a, b) => b.totalTime - a.totalTime);

    return {
      mostTimeConsuming: metrics.slice(0, 10),
      mostFrequent: metrics.sort((a, b) => b.callCount - a.callCount).slice(0, 10),
      slowestExecution: metrics.sort((a, b) => b.slowestExecution - a.slowestExecution).slice(0, 10),
      totalQueries: metrics.length,
      totalExecutionTime: metrics.reduce((sum, m) => sum + m.totalTime, 0),
      totalCalls: metrics.reduce((sum, m) => sum + m.callCount, 0)
    };
  }

  static async generateOptimizationPlan() {
    const issues = await this.analyzeQueryPerformance();
    const report = this.getPerformanceReport();
    
    const plan = {
      immediateActions: [],
      shortTermActions: [],
      longTermActions: [],
      monitoringSetup: []
    };

    // Immediate actions for critical issues
    if (report.slowestExecution.some(q => q.slowestExecution > 1000)) {
      plan.immediateActions.push('Investigate and optimize slowest queries (>1s execution time)');
    }

    if (report.totalExecutionTime > 100000) {
      plan.immediateActions.push('Implement query result caching');
      plan.immediateActions.push('Add database indexes for most frequent queries');
    }

    // Short-term optimizations
    plan.shortTermActions.push('Set up query performance monitoring');
    plan.shortTermActions.push('Implement connection pooling');
    plan.shortTermActions.push('Add pagination to large data queries');
    plan.shortTermActions.push('Create composite indexes based on query patterns');

    // Long-term strategies
    plan.longTermActions.push('Implement read replicas for heavy read operations');
    plan.longTermActions.push('Set up query result caching layer');
    plan.longTermActions.push('Consider database partitioning for large tables');
    plan.longTermActions.push('Implement automated performance monitoring alerts');

    // Monitoring setup
    plan.monitoringSetup.push('Enable pg_stat_statements extension');
    plan.monitoringSetup.push('Set up performance dashboards');
    plan.monitoringSetup.push('Configure slow query logging');
    plan.monitoringSetup.push('Create performance regression alerts');

    return { plan, issues, report };
  }
}
