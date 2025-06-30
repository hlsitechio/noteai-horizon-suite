
export class DatabasePerformanceService {
  private static performanceMetrics = new Map<string, {
    totalTime: number;
    callCount: number;
    slowestExecution: number;
    averageTime: number;
    lastUpdated: Date;
    errorCount: number;
    successRate: number;
  }>();

  private static connectionMetrics = {
    activeConnections: 0,
    totalConnections: 0,
    failedConnections: 0,
    averageConnectionTime: 0,
    poolUtilization: 0
  };

  static async analyzeQueryPerformance() {
    const issues = [];
    
    // Check for long-running queries
    const longRunningThreshold = 1000; // 1 second
    const highFrequencyThreshold = 1000; // 1000+ calls
    const totalTimeThreshold = 10000; // 10+ seconds total
    const errorRateThreshold = 0.05; // 5% error rate

    for (const [query, metrics] of this.performanceMetrics) {
      if (metrics.slowestExecution > longRunningThreshold) {
        issues.push({
          type: 'slow_query',
          query,
          slowestTime: metrics.slowestExecution,
          severity: metrics.slowestExecution > 5000 ? 'critical' : 'high',
          recommendation: 'Consider adding indexes or optimizing query structure'
        });
      }

      if (metrics.callCount > highFrequencyThreshold) {
        issues.push({
          type: 'high_frequency',
          query,
          callCount: metrics.callCount,
          severity: 'medium',
          recommendation: 'Consider implementing caching or query batching'
        });
      }

      if (metrics.totalTime > totalTimeThreshold) {
        issues.push({
          type: 'high_total_time',
          query,
          totalTime: metrics.totalTime,
          severity: 'critical',
          recommendation: 'This query consumes significant database resources'
        });
      }

      if (metrics.successRate < (1 - errorRateThreshold)) {
        issues.push({
          type: 'high_error_rate',
          query,
          errorRate: (1 - metrics.successRate) * 100,
          severity: 'high',
          recommendation: 'Investigate query errors and connection issues'
        });
      }
    }

    return issues;
  }

  static async getOptimizationRecommendations() {
    const recommendations = [];
    const issues = await this.analyzeQueryPerformance();
    
    // Indexing recommendations
    const slowQueries = issues.filter(i => i.type === 'slow_query');
    if (slowQueries.length > 0) {
      recommendations.push({
        category: 'Indexing',
        priority: 'high',
        actions: [
          'Add composite indexes on frequently queried columns',
          'Create partial indexes for filtered queries',
          'Add text search indexes for content searches',
          'Review and remove unused indexes'
        ],
        impact: 'Can reduce query execution time by 70-90%'
      });
    }

    // Caching recommendations
    const frequentQueries = issues.filter(i => i.type === 'high_frequency');
    if (frequentQueries.length > 0) {
      recommendations.push({
        category: 'Query Caching',
        priority: 'medium',
        actions: [
          'Implement Redis caching for frequent queries',
          'Use query result caching with TTL',
          'Add client-side caching with React Query',
          'Implement materialized views for complex aggregations'
        ],
        impact: 'Can reduce database load by 50-80%'
      });
    }

    // Connection management
    recommendations.push({
      category: 'Connection Management',
      priority: 'medium',
      actions: [
        'Implement connection pooling with pgBouncer',
        'Optimize connection pool size based on usage',
        'Use prepared statements for repeated queries',
        'Implement connection retry logic with exponential backoff'
      ],
      impact: 'Improves application reliability and performance'
    });

    // Query optimization
    recommendations.push({
      category: 'Query Optimization',
      priority: 'high',
      actions: [
        'Use EXPLAIN ANALYZE to identify bottlenecks',
        'Implement pagination for large result sets',
        'Avoid N+1 query problems with proper joins',
        'Use batch operations for bulk inserts/updates'
      ],
      impact: 'Reduces query complexity and execution time'
    });

    return recommendations;
  }

  static logQueryPerformance(queryName: string, executionTime: number, success: boolean = true) {
    const existing = this.performanceMetrics.get(queryName) || {
      totalTime: 0,
      callCount: 0,
      slowestExecution: 0,
      averageTime: 0,
      lastUpdated: new Date(),
      errorCount: 0,
      successRate: 1
    };

    existing.totalTime += executionTime;
    existing.callCount += 1;
    existing.slowestExecution = Math.max(existing.slowestExecution, executionTime);
    existing.averageTime = existing.totalTime / existing.callCount;
    existing.lastUpdated = new Date();

    if (!success) {
      existing.errorCount += 1;
    }
    existing.successRate = (existing.callCount - existing.errorCount) / existing.callCount;

    this.performanceMetrics.set(queryName, existing);

    // Log critical performance issues immediately
    if (executionTime > 500) {
      console.warn(`🐌 Slow query detected: ${queryName} took ${executionTime}ms`);
    }

    if (existing.callCount > 1000 && existing.callCount % 100 === 0) {
      console.warn(`🔥 High frequency query: ${queryName} called ${existing.callCount} times`);
    }

    if (!success) {
      console.error(`❌ Query failed: ${queryName}`);
    }
  }

  static updateConnectionMetrics(metrics: Partial<typeof this.connectionMetrics>) {
    Object.assign(this.connectionMetrics, metrics);
  }

  static getPerformanceReport() {
    const metrics = Array.from(this.performanceMetrics.entries())
      .map(([query, data]) => ({ query, ...data }))
      .sort((a, b) => b.totalTime - a.totalTime);

    return {
      mostTimeConsuming: metrics.slice(0, 10),
      mostFrequent: metrics.sort((a, b) => b.callCount - a.callCount).slice(0, 10),
      slowestExecution: metrics.sort((a, b) => b.slowestExecution - a.slowestExecution).slice(0, 10),
      highestErrors: metrics.filter(m => m.errorCount > 0).sort((a, b) => b.errorCount - a.errorCount).slice(0, 5),
      totalQueries: metrics.length,
      totalExecutionTime: metrics.reduce((sum, m) => sum + m.totalTime, 0),
      totalCalls: metrics.reduce((sum, m) => sum + m.callCount, 0),
      totalErrors: metrics.reduce((sum, m) => sum + m.errorCount, 0),
      connectionMetrics: { ...this.connectionMetrics }
    };
  }

  static async generateOptimizationPlan() {
    const issues = await this.analyzeQueryPerformance();
    const report = this.getPerformanceReport();
    const recommendations = await this.getOptimizationRecommendations();
    
    const plan = {
      immediateActions: [],
      shortTermActions: [],
      longTermActions: [],
      monitoringSetup: []
    };

    // Immediate actions for critical issues
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      plan.immediateActions.push('🚨 Address critical performance issues immediately');
      plan.immediateActions.push('🔍 Run EXPLAIN ANALYZE on slowest queries');
      plan.immediateActions.push('📊 Enable query logging for detailed analysis');
    }

    if (report.slowestExecution.some(q => q.slowestExecution > 1000)) {
      plan.immediateActions.push('⚡ Optimize queries taking >1 second');
    }

    if (report.totalErrors > 0) {
      plan.immediateActions.push('🛠️ Fix failing queries and connection issues');
    }

    // Short-term optimizations
    plan.shortTermActions.push('📈 Set up comprehensive performance monitoring');
    plan.shortTermActions.push('🏊 Implement connection pooling');
    plan.shortTermActions.push('📄 Add pagination to large data queries');
    plan.shortTermActions.push('🗂️ Create indexes based on query patterns');
    plan.shortTermActions.push('💾 Implement query result caching');

    // Long-term strategies
    plan.longTermActions.push('🔄 Set up read replicas for heavy read operations');
    plan.longTermActions.push('⚡ Implement advanced caching strategies');
    plan.longTermActions.push('📊 Consider database partitioning for large tables');
    plan.longTermActions.push('🤖 Set up automated performance monitoring alerts');
    plan.longTermActions.push('🔧 Regular performance audits and optimization');

    // Monitoring setup
    plan.monitoringSetup.push('📊 Enable pg_stat_statements extension');
    plan.monitoringSetup.push('📈 Set up performance dashboards');
    plan.monitoringSetup.push('⏱️ Configure slow query logging');
    plan.monitoringSetup.push('🚨 Create performance regression alerts');
    plan.monitoringSetup.push('📱 Set up real-time monitoring notifications');

    return { plan, issues, report, recommendations };
  }

  // Helper method to simulate some performance data for demo
  static generateDemoData() {
    // Simulate some performance metrics for demonstration
    this.logQueryPerformance('SELECT * FROM notes WHERE user_id = ?', 45, true);
    this.logQueryPerformance('SELECT * FROM notes WHERE user_id = ?', 52, true);
    this.logQueryPerformance('SELECT * FROM folders WHERE user_id = ?', 23, true);
    this.logQueryPerformance('INSERT INTO notes (title, content, user_id)', 156, true);
    this.logQueryPerformance('UPDATE notes SET content = ? WHERE id = ?', 89, true);
    this.logQueryPerformance('DELETE FROM notes WHERE id = ?', 34, true);
    this.logQueryPerformance('Complex aggregation query', 1200, true);
    this.logQueryPerformance('Complex aggregation query', 1450, false);
    
    // Simulate high-frequency queries
    for (let i = 0; i < 500; i++) {
      this.logQueryPerformance('SELECT * FROM notes WHERE user_id = ?', Math.random() * 100 + 20, Math.random() > 0.02);
    }

    this.updateConnectionMetrics({
      activeConnections: 15,
      totalConnections: 1250,
      failedConnections: 8,
      averageConnectionTime: 45,
      poolUtilization: 0.75
    });
  }
}
