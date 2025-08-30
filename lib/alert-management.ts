import { CivilDefenceAlert, AlertType, AlertSeverity, Language, CoastalZone, BroadcastChannel, CAPAlert } from './civil-defence-types'
import { messageTemplates, processMessageTemplate, validateMessageLength, coastalZones } from './message-templates'

export class AlertManagementService {
  private static instance: AlertManagementService
  private alerts: CivilDefenceAlert[] = []
  private broadcastLogs: any[] = []

  static getInstance(): AlertManagementService {
    if (!AlertManagementService.instance) {
      AlertManagementService.instance = new AlertManagementService()
    }
    return AlertManagementService.instance
  }

  // Create new alert
  createAlert(alertData: Partial<CivilDefenceAlert>): CivilDefenceAlert {
    const alert: CivilDefenceAlert = {
      id: `alert-${Date.now()}`,
      title: alertData.title || '',
      type: alertData.type || 'cyclone',
      severity: alertData.severity || 'warning',
      urgencyLevel: alertData.urgencyLevel || 'medium',
      description: alertData.description || '',
      affectedZones: alertData.affectedZones || [],
      languages: alertData.languages || ['english', 'hindi'],
      messageTemplates: this.generateMessageTemplates(alertData.type!, alertData.severity!, alertData.languages!),
      broadcastChannels: alertData.broadcastChannels || ['sms', 'cell_broadcast'],
      scheduledTime: alertData.scheduledTime,
      expiryTime: alertData.expiryTime,
      createdBy: alertData.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      deliveryStatus: {
        total: 0,
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: 0,
        channels: {}
      },
      estimatedReach: this.calculateEstimatedReach(alertData.affectedZones || [])
    }

    this.alerts.push(alert)
    return alert
  }

  // Generate multilingual message templates
  generateMessageTemplates(type: AlertType, severity: AlertSeverity, languages: Language[]): Record<Language, string> {
    const templates: Record<Language, string> = {}
    const templateKey = `${type}_${severity}`
    
    languages.forEach(lang => {
      if (messageTemplates[templateKey] && messageTemplates[templateKey][lang]) {
        templates[lang] = messageTemplates[templateKey][lang]
      } else {
        // Fallback to English if template not available
        templates[lang] = messageTemplates[templateKey]?.english || `Alert: {location} - Civil Defence`
      }
    })

    return templates
  }

  // Process and validate message for broadcast
  processMessage(template: string, variables: Record<string, string>): { message: string; isValid: boolean; errors: string[] } {
    const processed = processMessageTemplate(template, variables)
    const errors: string[] = []
    
    if (!validateMessageLength(processed)) {
      errors.push(`Message exceeds 160 characters (${processed.length} chars)`)
    }

    return {
      message: processed,
      isValid: errors.length === 0,
      errors
    }
  }

  // Broadcast alert to all channels
  async broadcastAlert(alertId: string, variables: Record<string, string>): Promise<boolean> {
    const alert = this.alerts.find(a => a.id === alertId)
    if (!alert) return false

    alert.status = 'broadcasting'
    alert.updatedAt = new Date()

    // Simulate broadcasting to different channels
    for (const zone of alert.affectedZones) {
      for (const language of alert.languages) {
        const template = alert.messageTemplates[language]
        if (template) {
          const { message, isValid } = this.processMessage(template, variables)
          
          if (isValid) {
            // Simulate broadcast to each channel
            for (const channel of alert.broadcastChannels) {
              await this.simulateBroadcast(alert, zone, language, message, channel)
            }
          }
        }
      }
    }

    alert.status = 'sent'
    alert.deliveryStatus.total = this.calculateTotalRecipients(alert.affectedZones)
    alert.deliveryStatus.sent = alert.deliveryStatus.total
    alert.deliveryStatus.delivered = Math.floor(alert.deliveryStatus.total * 0.95) // 95% delivery rate
    alert.deliveryStatus.failed = alert.deliveryStatus.total - alert.deliveryStatus.delivered

    return true
  }

  // Simulate broadcast to specific channel
  private async simulateBroadcast(
    alert: CivilDefenceAlert, 
    zone: CoastalZone, 
    language: Language, 
    message: string, 
    channel: BroadcastChannel
  ): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000))

    const log = {
      id: `log-${Date.now()}-${Math.random()}`,
      alertId: alert.id,
      timestamp: new Date(),
      channel,
      zone: zone.name,
      language,
      message,
      recipientCount: Math.floor(zone.population * 0.8), // 80% have phones
      deliveryRate: 0.95,
      status: 'success' as const
    }

    this.broadcastLogs.push(log)
  }

  // Calculate estimated reach based on zones
  private calculateEstimatedReach(zones: CoastalZone[]): number {
    return zones.reduce((total, zone) => total + Math.floor(zone.population * 0.8), 0)
  }

  // Calculate total recipients
  private calculateTotalRecipients(zones: CoastalZone[]): number {
    return zones.reduce((total, zone) => total + Math.floor(zone.population * 0.8), 0)
  }

  // Get all alerts
  getAlerts(): CivilDefenceAlert[] {
    return [...this.alerts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Get alert by ID
  getAlert(id: string): CivilDefenceAlert | undefined {
    return this.alerts.find(a => a.id === id)
  }

  // Update alert status
  updateAlertStatus(id: string, status: CivilDefenceAlert['status']): boolean {
    const alert = this.alerts.find(a => a.id === id)
    if (alert) {
      alert.status = status
      alert.updatedAt = new Date()
      return true
    }
    return false
  }

  // Get broadcast logs
  getBroadcastLogs(alertId?: string): any[] {
    if (alertId) {
      return this.broadcastLogs.filter(log => log.alertId === alertId)
    }
    return [...this.broadcastLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Generate CAP 1.2 compliant alert
  generateCAPAlert(alert: CivilDefenceAlert): CAPAlert {
    return {
      identifier: alert.id,
      sender: 'civil-defence@gov.in',
      sent: alert.createdAt,
      status: 'Actual',
      msgType: 'Alert',
      scope: 'Public',
      info: alert.languages.map(lang => ({
        language: lang,
        category: this.mapAlertTypeToCAP(alert.type),
        event: alert.title,
        urgency: this.mapUrgencyToCAP(alert.urgencyLevel),
        severity: this.mapSeverityToCAP(alert.severity),
        certainty: 'Likely',
        headline: alert.title,
        description: alert.description,
        instruction: alert.messageTemplates[lang] || '',
        areas: alert.affectedZones.map(zone => ({
          areaDesc: zone.name,
          polygon: zone.coordinates.map(coord => `${coord.lat},${coord.lng}`).join(' ')
        }))
      }))
    }
  }

  private mapAlertTypeToCAP(type: AlertType): any {
    const mapping = {
      cyclone: 'Met',
      tsunami: 'Geo', 
      storm_surge: 'Met',
      high_tide: 'Met',
      coastal_erosion: 'Env',
      pollution: 'Env',
      oil_spill: 'Env',
      illegal_fishing: 'Security',
      smuggling: 'Security',
      security_threat: 'Security',
      all_clear: 'Safety'
    }
    return mapping[type] || 'Other'
  }

  private mapUrgencyToCAP(urgency: CivilDefenceAlert['urgencyLevel']): any {
    const mapping = {
      immediate: 'Immediate',
      high: 'Expected', 
      medium: 'Future',
      low: 'Future'
    }
    return mapping[urgency]
  }

  private mapSeverityToCAP(severity: AlertSeverity): any {
    const mapping = {
      emergency: 'Extreme',
      warning: 'Severe',
      info: 'Moderate'
    }
    return mapping[severity]
  }
}
