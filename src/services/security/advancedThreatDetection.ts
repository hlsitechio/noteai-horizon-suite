import { logger } from '@/utils/logger';

interface ThreatPattern {
  id: string;
  name: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface AIThreatAnalysis {
  riskScore: number;
  threatType: string;
  confidence: number;
  recommendations: string[];
}

class AdvancedThreatDetectionService {
  private threatPatterns: ThreatPattern[] = [
    {
      id: 'sql_injection',
      name: 'SQL Injection',
      pattern: /(union\s+select|or\s+1\s*=\s*1|drop\s+table|exec\s*\(|script\s*>)/i,
      severity: 'critical',
      description: 'Potential SQL injection attempt detected'
    },
    {
      id: 'xss_attack',
      name: 'Cross-Site Scripting',
      pattern: /<script[^>]*>|javascript:|on\w+\s*=|eval\s*\(|setTimeout\s*\(/i,
      severity: 'high',
      description: 'Potential XSS attack detected'
    },
    {
      id: 'path_traversal',
      name: 'Path Traversal',
      pattern: /(\.\.[\/\\]){2,}|%2e%2e[\/\\]|\.\.%2f/i,
      severity: 'high',
      description: 'Path traversal attempt detected'
    },
    {
      id: 'command_injection',
      name: 'Command Injection',
      pattern: /(\||;|&|`|\$\(|\${)/,
      severity: 'critical',
      description: 'Command injection attempt detected'
    },
    {
      id: 'suspicious_user_agent',
      name: 'Suspicious User Agent',
      pattern: /(sqlmap|nmap|nikto|burp|metasploit|curl\/|wget\/)/i,
      severity: 'medium',
      description: 'Suspicious user agent detected'
    }
  ];

  private anomalyBaseline = {
    avgRequestsPerMinute: 30,
    avgPayloadSize: 2048,
    commonEndpoints: ['/api', '/dashboard', '/auth'],
    normalResponseTimes: { min: 50, max: 500 }
  };

  analyzePayload(payload: string): { threats: ThreatPattern[]; riskScore: number } {
    const threats: ThreatPattern[] = [];
    let riskScore = 0;

    for (const pattern of this.threatPatterns) {
      if (pattern.pattern.test(payload)) {
        threats.push(pattern);
        riskScore += this.getSeverityScore(pattern.severity);
      }
    }

    return { threats, riskScore };
  }

  analyzeRequestBehavior(
    requestData: {
      endpoint: string;
      method: string;
      payloadSize: number;
      responseTime: number;
      userAgent: string;
      ipAddress: string;
    }
  ): AIThreatAnalysis {
    let riskScore = 0;
    const threatTypes: string[] = [];
    const recommendations: string[] = [];

    // Analyze payload size anomalies
    if (requestData.payloadSize > this.anomalyBaseline.avgPayloadSize * 5) {
      riskScore += 30;
      threatTypes.push('large_payload');
      recommendations.push('Monitor for potential DDoS or data exfiltration attempts');
    }

    // Analyze response time anomalies
    if (requestData.responseTime > this.anomalyBaseline.normalResponseTimes.max * 3) {
      riskScore += 20;
      threatTypes.push('slow_response');
      recommendations.push('Check for potential resource exhaustion attacks');
    }

    // Analyze user agent patterns
    if (this.threatPatterns.find(p => p.id === 'suspicious_user_agent')?.pattern.test(requestData.userAgent)) {
      riskScore += 40;
      threatTypes.push('suspicious_client');
      recommendations.push('Block or monitor suspicious user agents');
    }

    // Analyze endpoint patterns
    if (!this.anomalyBaseline.commonEndpoints.some(ep => requestData.endpoint.startsWith(ep))) {
      riskScore += 15;
      threatTypes.push('uncommon_endpoint');
      recommendations.push('Verify endpoint legitimacy');
    }

    return {
      riskScore: Math.min(riskScore, 100),
      threatType: threatTypes.join(', ') || 'none',
      confidence: this.calculateConfidence(riskScore),
      recommendations
    };
  }

  detectAnomalousPatterns(
    requests: Array<{
      timestamp: number;
      ipAddress: string;
      endpoint: string;
      statusCode: number;
    }>
  ): { anomalies: string[]; severity: string } {
    const anomalies: string[] = [];
    let maxSeverity: 'low' | 'medium' | 'high' = 'low';

    // Group requests by IP
    const ipGroups = requests.reduce((acc, req) => {
      if (!acc[req.ipAddress]) acc[req.ipAddress] = [];
      acc[req.ipAddress].push(req);
      return acc;
    }, {} as Record<string, typeof requests>);

    // Check for rapid fire requests (potential DDoS)
    Object.entries(ipGroups).forEach(([ip, reqs]) => {
      const recentRequests = reqs.filter(r => 
        Date.now() - r.timestamp < 60000 // Last minute
      );

      if (recentRequests.length > 100) {
        anomalies.push(`High request rate from ${ip}: ${recentRequests.length} requests/minute`);
        maxSeverity = 'high';
      }

      // Check for error rate patterns
      const errorRequests = recentRequests.filter(r => r.statusCode >= 400);
      if (errorRequests.length > recentRequests.length * 0.5) {
        anomalies.push(`High error rate from ${ip}: ${(errorRequests.length/recentRequests.length*100).toFixed(1)}%`);
        maxSeverity = maxSeverity === 'high' ? 'high' : 'medium';
      }
    });

    return { anomalies, severity: maxSeverity };
  }

  generateThreatIntelligence(
    recentThreats: Array<{
      type: string;
      severity: string;
      timestamp: number;
      source: string;
    }>
  ): {
    trendAnalysis: string;
    riskLevel: string;
    recommendations: string[];
  } {
    const threatCounts = recentThreats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topThreats = Object.entries(threatCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    const criticalThreats = recentThreats.filter(t => t.severity === 'critical');
    const riskLevel = criticalThreats.length > 5 ? 'high' : 
                     criticalThreats.length > 2 ? 'medium' : 'low';

    const recommendations: string[] = [];
    
    if (topThreats.length > 0) {
      recommendations.push(`Focus on ${topThreats[0][0]} threats (${topThreats[0][1]} incidents)`);
    }
    
    if (criticalThreats.length > 0) {
      recommendations.push('Implement additional monitoring for critical threats');
    }

    return {
      trendAnalysis: `Top threats: ${topThreats.map(([type, count]) => `${type}(${count})`).join(', ')}`,
      riskLevel,
      recommendations
    };
  }

  private getSeverityScore(severity: string): number {
    switch (severity) {
      case 'critical': return 40;
      case 'high': return 30;
      case 'medium': return 20;
      case 'low': return 10;
      default: return 0;
    }
  }

  private calculateConfidence(riskScore: number): number {
    if (riskScore >= 70) return 0.9;
    if (riskScore >= 50) return 0.7;
    if (riskScore >= 30) return 0.5;
    return 0.3;
  }

  logThreatDetection(threat: {
    type: string;
    severity: string;
    details: any;
    source: string;
  }): void {
    logger.warn('SECURITY', 'Advanced threat detected', {
      type: threat.type,
      severity: threat.severity,
      details: threat.details,
      source: threat.source,
      timestamp: new Date().toISOString()
    });
  }
}

export const advancedThreatDetectionService = new AdvancedThreatDetectionService();