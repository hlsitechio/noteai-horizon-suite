/**
 * Incident Response Service for automated threat mitigation
 */
import { logger } from '@/utils/logger';
import { auditLogService } from './auditLogService';
import { threatDetectionService, type ThreatAlert } from './threatDetectionService';
import { rateLimitingService } from './rateLimitingService';

export interface SecurityIncident {
  id: string;
  type: 'brute_force' | 'malware' | 'data_breach' | 'ddos' | 'unauthorized_access' | 'injection_attack';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'false_positive';
  description: string;
  affectedAssets: string[];
  indicators: string[];
  timeline: IncidentTimelineEntry[];
  mitigationActions: MitigationAction[];
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  estimatedImpact: 'low' | 'medium' | 'high' | 'critical';
}

export interface IncidentTimelineEntry {
  timestamp: Date;
  event: string;
  details: string;
  actor: 'system' | 'analyst' | 'attacker';
  evidenceLinks?: string[];
}

export interface MitigationAction {
  id: string;
  type: 'block_ip' | 'rate_limit' | 'quarantine_user' | 'disable_endpoint' | 'alert_team' | 'custom';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  automatedAction: boolean;
  executedAt?: Date;
  executedBy?: string;
  result?: string;
  evidence?: string[];
}

export interface ResponsePlaybook {
  incidentType: string;
  severity: string;
  automatedActions: string[];
  manualActions: string[];
  escalationThreshold: number;
  maxResponseTime: number; // minutes
}

export class IncidentResponseService {
  private activeIncidents = new Map<string, SecurityIncident>();
  private responsePlaybooks = new Map<string, ResponsePlaybook>();
  private automatedActionCooldowns = new Map<string, number>();
  
  constructor() {
    this.initializePlaybooks();
    this.startIncidentMonitoring();
  }

  /**
   * Initialize response playbooks for different incident types
   */
  private initializePlaybooks(): void {
    const playbooks: ResponsePlaybook[] = [
      {
        incidentType: 'brute_force',
        severity: 'high',
        automatedActions: ['block_ip', 'rate_limit'],
        manualActions: ['investigate_source', 'check_other_accounts'],
        escalationThreshold: 100, // requests per minute
        maxResponseTime: 5
      },
      {
        incidentType: 'injection_attack',
        severity: 'critical',
        automatedActions: ['block_ip', 'disable_endpoint', 'alert_team'],
        manualActions: ['forensic_analysis', 'patch_vulnerability'],
        escalationThreshold: 1, // immediate
        maxResponseTime: 2
      },
      {
        incidentType: 'unauthorized_access',
        severity: 'high',
        automatedActions: ['quarantine_user', 'rate_limit', 'alert_team'],
        manualActions: ['password_reset', 'audit_permissions'],
        escalationThreshold: 3, // attempts
        maxResponseTime: 10
      },
      {
        incidentType: 'data_breach',
        severity: 'critical',
        automatedActions: ['alert_team', 'quarantine_user'],
        manualActions: ['isolate_systems', 'notify_authorities', 'assess_damage'],
        escalationThreshold: 1, // immediate
        maxResponseTime: 1
      },
      {
        incidentType: 'ddos',
        severity: 'high',
        automatedActions: ['rate_limit', 'block_ip'],
        manualActions: ['activate_cdn', 'scale_infrastructure'],
        escalationThreshold: 1000, // requests per second
        maxResponseTime: 3
      }
    ];

    playbooks.forEach(playbook => {
      this.responsePlaybooks.set(`${playbook.incidentType}_${playbook.severity}`, playbook);
    });
  }

  /**
   * Create security incident from threat alert
   */
  createIncident(threatAlert: ThreatAlert, additionalContext?: any): SecurityIncident {
    const incidentId = this.generateIncidentId();
    const incidentType = this.determineIncidentType(threatAlert);
    
    const incident: SecurityIncident = {
      id: incidentId,
      type: incidentType,
      severity: threatAlert.aggregatedSeverity,
      status: 'open',
      description: this.generateIncidentDescription(threatAlert),
      affectedAssets: this.identifyAffectedAssets(threatAlert, additionalContext),
      indicators: threatAlert.indicators.map(i => i.description),
      timeline: [{
        timestamp: new Date(),
        event: 'incident_created',
        details: 'Security incident created from threat detection',
        actor: 'system'
      }],
      mitigationActions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedImpact: this.estimateImpact(threatAlert)
    };

    this.activeIncidents.set(incidentId, incident);
    
    // Initiate automated response
    this.initiateAutomatedResponse(incident);
    
    // Log incident creation
    this.logIncidentEvent(incident, 'incident_created');
    
    return incident;
  }

  /**
   * Initiate automated response based on incident type and severity
   */
  private async initiateAutomatedResponse(incident: SecurityIncident): Promise<void> {
    const playbookKey = `${incident.type}_${incident.severity}`;
    const playbook = this.responsePlaybooks.get(playbookKey);
    
    if (!playbook) {
      logger.warn('No playbook found for incident', { type: incident.type, severity: incident.severity });
      return;
    }

    // Execute automated actions
    for (const actionType of playbook.automatedActions) {
      const action = await this.executeAutomatedAction(incident, actionType);
      incident.mitigationActions.push(action);
    }

    // Update incident status
    incident.status = 'investigating';
    incident.updatedAt = new Date();
    incident.timeline.push({
      timestamp: new Date(),
      event: 'automated_response_initiated',
      details: `Executed ${playbook.automatedActions.length} automated actions`,
      actor: 'system'
    });

    // Check if escalation is needed
    if (this.shouldEscalate(incident, playbook)) {
      this.escalateIncident(incident);
    }
  }

  /**
   * Execute specific automated action
   */
  private async executeAutomatedAction(incident: SecurityIncident, actionType: string): Promise<MitigationAction> {
    const actionId = `${incident.id}_${actionType}_${Date.now()}`;
    
    const action: MitigationAction = {
      id: actionId,
      type: actionType as any,
      description: this.getActionDescription(actionType),
      status: 'pending',
      automatedAction: true,
      executedAt: new Date()
    };

    try {
      // Check cooldown
      const cooldownKey = `${actionType}_cooldown`;
      const lastExecution = this.automatedActionCooldowns.get(cooldownKey) || 0;
      const cooldownPeriod = this.getActionCooldown(actionType);
      
      if (Date.now() - lastExecution < cooldownPeriod) {
        action.status = 'failed';
        action.result = 'Action on cooldown';
        return action;
      }

      action.status = 'in_progress';
      
      switch (actionType) {
        case 'block_ip':
          await this.blockIPAddress(incident);
          break;
        case 'rate_limit':
          await this.applyRateLimit(incident);
          break;
        case 'quarantine_user':
          await this.quarantineUser(incident);
          break;
        case 'disable_endpoint':
          await this.disableEndpoint(incident);
          break;
        case 'alert_team':
          await this.alertSecurityTeam(incident);
          break;
      }

      action.status = 'completed';
      action.result = 'Action executed successfully';
      this.automatedActionCooldowns.set(cooldownKey, Date.now());
      
    } catch (error) {
      action.status = 'failed';
      action.result = `Action failed: ${error}`;
      logger.error('Automated action failed', { actionType, incidentId: incident.id, error });
    }

    return action;
  }

  /**
   * Automated action implementations
   */
  private async blockIPAddress(incident: SecurityIncident): Promise<void> {
    const ipAddresses = this.extractIPAddresses(incident);
    
    for (const ip of ipAddresses) {
      // In production, this would interface with firewall/WAF
      logger.warn('BLOCKING IP ADDRESS', { ip, incidentId: incident.id });
      
      // Simulate blocking by adding to rate limiter's blocked list
      // This is a simplified implementation
      incident.timeline.push({
        timestamp: new Date(),
        event: 'ip_blocked',
        details: `Blocked IP address: ${ip}`,
        actor: 'system'
      });
    }
  }

  private async applyRateLimit(incident: SecurityIncident): Promise<void> {
    const ipAddresses = this.extractIPAddresses(incident);
    
    for (const ip of ipAddresses) {
      // Apply aggressive rate limiting
      logger.warn('APPLYING RATE LIMIT', { ip, incidentId: incident.id });
      
      incident.timeline.push({
        timestamp: new Date(),
        event: 'rate_limit_applied',
        details: `Applied strict rate limiting to IP: ${ip}`,
        actor: 'system'
      });
    }
  }

  private async quarantineUser(incident: SecurityIncident): Promise<void> {
    const userIds = this.extractUserIds(incident);
    
    for (const userId of userIds) {
      // In production, this would disable user account or limit permissions
      logger.warn('QUARANTINING USER', { userId, incidentId: incident.id });
      
      incident.timeline.push({
        timestamp: new Date(),
        event: 'user_quarantined',
        details: `Quarantined user account: ${userId}`,
        actor: 'system'
      });
    }
  }

  private async disableEndpoint(incident: SecurityIncident): Promise<void> {
    const endpoints = this.extractEndpoints(incident);
    
    for (const endpoint of endpoints) {
      // In production, this would disable specific API endpoints
      logger.warn('DISABLING ENDPOINT', { endpoint, incidentId: incident.id });
      
      incident.timeline.push({
        timestamp: new Date(),
        event: 'endpoint_disabled',
        details: `Temporarily disabled endpoint: ${endpoint}`,
        actor: 'system'
      });
    }
  }

  private async alertSecurityTeam(incident: SecurityIncident): Promise<void> {
    // In production, this would send alerts via email, Slack, PagerDuty, etc.
    logger.error('SECURITY TEAM ALERT', {
      incidentId: incident.id,
      type: incident.type,
      severity: incident.severity,
      description: incident.description
    });

    incident.timeline.push({
      timestamp: new Date(),
      event: 'security_team_alerted',
      details: 'Security team has been notified of the incident',
      actor: 'system'
    });
  }

  /**
   * Update incident status
   */
  updateIncidentStatus(incidentId: string, status: SecurityIncident['status'], notes?: string): void {
    const incident = this.activeIncidents.get(incidentId);
    if (!incident) return;

    incident.status = status;
    incident.updatedAt = new Date();
    incident.timeline.push({
      timestamp: new Date(),
      event: 'status_updated',
      details: `Status changed to: ${status}${notes ? `. Notes: ${notes}` : ''}`,
      actor: 'analyst'
    });

    this.logIncidentEvent(incident, 'status_updated');
  }

  /**
   * Get incident statistics
   */
  getIncidentStats() {
    const incidents = Array.from(this.activeIncidents.values());
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const oneDayAgo = now - (24 * 60 * 60 * 1000);

    return {
      totalActiveIncidents: incidents.length,
      recentIncidents: incidents.filter(i => i.createdAt.getTime() > oneHourAgo).length,
      criticalIncidents: incidents.filter(i => i.severity === 'critical').length,
      highIncidents: incidents.filter(i => i.severity === 'high').length,
      averageResponseTime: this.calculateAverageResponseTime(incidents),
      incidentsByType: this.groupIncidentsByType(incidents),
      incidentsByStatus: this.groupIncidentsByStatus(incidents),
      automationEffectiveness: this.calculateAutomationEffectiveness(incidents)
    };
  }

  /**
   * Helper methods
   */
  private determineIncidentType(threatAlert: ThreatAlert): SecurityIncident['type'] {
    const indicators = threatAlert.indicators;
    
    if (indicators.some(i => i.type === 'injection')) return 'injection_attack';
    if (indicators.some(i => i.type === 'brute_force')) return 'brute_force';
    if (indicators.some(i => i.type === 'enumeration')) return 'unauthorized_access';
    if (indicators.some(i => i.type === 'malware')) return 'malware';
    
    return 'unauthorized_access'; // Default
  }

  private generateIncidentDescription(threatAlert: ThreatAlert): string {
    const primaryIndicator = threatAlert.indicators[0];
    return `${primaryIndicator.description} detected from ${threatAlert.ipAddress || 'unknown IP'}`;
  }

  private identifyAffectedAssets(threatAlert: ThreatAlert, context?: any): string[] {
    const assets = [];
    
    if (threatAlert.userId) assets.push(`User:${threatAlert.userId}`);
    if (threatAlert.ipAddress) assets.push(`IP:${threatAlert.ipAddress}`);
    if (context?.endpoint) assets.push(`Endpoint:${context.endpoint}`);
    
    return assets;
  }

  private estimateImpact(threatAlert: ThreatAlert): SecurityIncident['estimatedImpact'] {
    const hasHighConfidenceIndicators = threatAlert.indicators.some(i => i.confidence > 80);
    const hasMultipleIndicators = threatAlert.indicators.length > 2;
    
    if (threatAlert.aggregatedSeverity === 'critical') return 'critical';
    if (threatAlert.aggregatedSeverity === 'high' && hasHighConfidenceIndicators) return 'high';
    if (hasMultipleIndicators) return 'medium';
    
    return 'low';
  }

  private shouldEscalate(incident: SecurityIncident, playbook: ResponsePlaybook): boolean {
    if (incident.severity === 'critical') return true;
    if (incident.estimatedImpact === 'critical') return true;
    
    const timeSinceCreation = Date.now() - incident.createdAt.getTime();
    return timeSinceCreation > (playbook.maxResponseTime * 60 * 1000);
  }

  private escalateIncident(incident: SecurityIncident): void {
    incident.status = 'investigating';
    incident.timeline.push({
      timestamp: new Date(),
      event: 'incident_escalated',
      details: 'Incident escalated to security team for manual investigation',
      actor: 'system'
    });

    logger.error('INCIDENT ESCALATED', {
      incidentId: incident.id,
      type: incident.type,
      severity: incident.severity
    });
  }

  private extractIPAddresses(incident: SecurityIncident): string[] {
    const ips = [];
    for (const asset of incident.affectedAssets) {
      if (asset.startsWith('IP:')) {
        ips.push(asset.substring(3));
      }
    }
    return ips;
  }

  private extractUserIds(incident: SecurityIncident): string[] {
    const userIds = [];
    for (const asset of incident.affectedAssets) {
      if (asset.startsWith('User:')) {
        userIds.push(asset.substring(5));
      }
    }
    return userIds;
  }

  private extractEndpoints(incident: SecurityIncident): string[] {
    const endpoints = [];
    for (const asset of incident.affectedAssets) {
      if (asset.startsWith('Endpoint:')) {
        endpoints.push(asset.substring(9));
      }
    }
    return endpoints;
  }

  private getActionDescription(actionType: string): string {
    const descriptions = {
      block_ip: 'Block IP address at firewall level',
      rate_limit: 'Apply strict rate limiting',
      quarantine_user: 'Quarantine user account',
      disable_endpoint: 'Temporarily disable endpoint',
      alert_team: 'Alert security team'
    };
    
    return descriptions[actionType] || 'Unknown action';
  }

  private getActionCooldown(actionType: string): number {
    const cooldowns = {
      block_ip: 60000, // 1 minute
      rate_limit: 30000, // 30 seconds
      quarantine_user: 300000, // 5 minutes
      disable_endpoint: 600000, // 10 minutes
      alert_team: 900000 // 15 minutes
    };
    
    return cooldowns[actionType] || 60000;
  }

  private calculateAverageResponseTime(incidents: SecurityIncident[]): number {
    const completedIncidents = incidents.filter(i => i.status === 'resolved');
    if (completedIncidents.length === 0) return 0;
    
    const totalTime = completedIncidents.reduce((sum, incident) => {
      return sum + (incident.updatedAt.getTime() - incident.createdAt.getTime());
    }, 0);
    
    return totalTime / completedIncidents.length / 1000 / 60; // Convert to minutes
  }

  private groupIncidentsByType(incidents: SecurityIncident[]): Record<string, number> {
    return incidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {});
  }

  private groupIncidentsByStatus(incidents: SecurityIncident[]): Record<string, number> {
    return incidents.reduce((acc, incident) => {
      acc[incident.status] = (acc[incident.status] || 0) + 1;
      return acc;
    }, {});
  }

  private calculateAutomationEffectiveness(incidents: SecurityIncident[]): number {
    const totalActions = incidents.reduce((sum, incident) => sum + incident.mitigationActions.length, 0);
    const automatedActions = incidents.reduce((sum, incident) => 
      sum + incident.mitigationActions.filter(a => a.automatedAction).length, 0);
    
    return totalActions > 0 ? (automatedActions / totalActions) * 100 : 0;
  }

  private generateIncidentId(): string {
    return `INC-${new Date().getFullYear()}-${String(Date.now()).slice(-8)}`;
  }

  private logIncidentEvent(incident: SecurityIncident, eventType: string): void {
    auditLogService.logEvent({
      eventType,
      userId: incident.assignedTo,
      riskLevel: incident.severity,
      metadata: {
        incidentId: incident.id,
        incidentType: incident.type,
        status: incident.status,
        affectedAssets: incident.affectedAssets.length,
        mitigationActions: incident.mitigationActions.length
      }
    });
  }

  private startIncidentMonitoring(): void {
    // Cleanup resolved incidents older than 30 days
    setInterval(() => {
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      
      for (const [id, incident] of this.activeIncidents.entries()) {
        if (incident.status === 'resolved' && incident.updatedAt.getTime() < thirtyDaysAgo) {
          this.activeIncidents.delete(id);
        }
      }
    }, 24 * 60 * 60 * 1000); // Daily cleanup
  }
}

export const incidentResponseService = new IncidentResponseService();