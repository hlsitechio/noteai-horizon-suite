/**
 * Advanced Threat Detection Service
 */

export interface ThreatAnalysis {
  riskScore: number;
  threats: string[];
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  source: string;
  metadata: Record<string, any>;
}

export class AdvancedThreatDetectionService {
  private alerts: SecurityAlert[] = [];
  
  getThreatStatistics() {
    return {
      totalThreats: this.alerts.length,
      threatsByType: {},
      criticalAlerts: this.alerts.filter(a => a.severity === 'critical').length,
      recentThreats: this.alerts.filter(a => Date.now() - a.timestamp.getTime() < 3600000).length
    };
  }

  getRecentAlerts(limit: number = 50): SecurityAlert[] {
    return this.alerts.slice(-limit);
  }
}

export const advancedThreatDetection = new AdvancedThreatDetectionService();