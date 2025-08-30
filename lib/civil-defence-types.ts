// Civil Defence Alert System Types
export interface CivilDefenceAlert {
  id: string
  title: string
  type: AlertType
  severity: AlertSeverity
  urgencyLevel: UrgencyLevel
  description: string
  affectedZones: CoastalZone[]
  languages: Language[]
  messageTemplates: Record<Language, string>
  broadcastChannels: BroadcastChannel[]
  scheduledTime?: Date
  expiryTime?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
  status: AlertStatus
  deliveryStatus: DeliveryStatus
  estimatedReach: number
  actualReach?: number
}

export type AlertType = 
  | 'cyclone'
  | 'tsunami' 
  | 'storm_surge'
  | 'high_tide'
  | 'coastal_erosion'
  | 'pollution'
  | 'oil_spill'
  | 'illegal_fishing'
  | 'smuggling'
  | 'security_threat'
  | 'all_clear'

export type AlertSeverity = 'info' | 'warning' | 'emergency'

export type UrgencyLevel = 'immediate' | 'high' | 'medium' | 'low'

export type AlertStatus = 'draft' | 'scheduled' | 'broadcasting' | 'sent' | 'expired' | 'cancelled'

export type Language = 
  | 'hindi'
  | 'english' 
  | 'tamil'
  | 'gujarati'
  | 'bengali'
  | 'malayalam'
  | 'marathi'
  | 'telugu'
  | 'kannada'
  | 'odia'

export interface CoastalZone {
  id: string
  name: string
  state: string
  coordinates: {
    lat: number
    lng: number
  }[]
  radius: number // in meters
  population: number
  primaryLanguages: Language[]
  shelters: string[]
  cellTowers: string[]
  harbors: string[]
  villages: string[]
}

export type BroadcastChannel = 'sms' | 'cell_broadcast' | 'satellite' | 'radio' | 'siren'

export interface DeliveryStatus {
  total: number
  sent: number
  delivered: number
  failed: number
  pending: number
  channels: Record<BroadcastChannel, {
    sent: number
    delivered: number
    failed: number
  }>
}

export interface MessageTemplate {
  id: string
  name: string
  type: AlertType
  severity: AlertSeverity
  templates: Record<Language, string>
  variables: string[] // e.g., ['location', 'time', 'shelter']
  characterCount: Record<Language, number>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CivilDefenceUser {
  id: string
  name: string
  role: 'admin' | 'operator'
  organization: string
  jurisdiction: string[]
  permissions: Permission[]
  lastLogin: Date
}

export type Permission = 
  | 'create_alerts'
  | 'broadcast_immediate'
  | 'manage_templates'
  | 'view_analytics'
  | 'manage_zones'
  | 'system_admin'

export interface BroadcastLog {
  id: string
  alertId: string
  timestamp: Date
  channel: BroadcastChannel
  zone: string
  language: Language
  message: string
  recipientCount: number
  deliveryRate: number
  status: 'success' | 'partial' | 'failed'
  errorDetails?: string
}

// CAP 1.2 (Common Alerting Protocol) compliance
export interface CAPAlert {
  identifier: string
  sender: string
  sent: Date
  status: 'Actual' | 'Exercise' | 'System' | 'Test' | 'Draft'
  msgType: 'Alert' | 'Update' | 'Cancel' | 'Ack' | 'Error'
  scope: 'Public' | 'Restricted' | 'Private'
  info: CAPInfo[]
}

export interface CAPInfo {
  language: string
  category: 'Geo' | 'Met' | 'Safety' | 'Security' | 'Rescue' | 'Fire' | 'Health' | 'Env' | 'Transport' | 'Infra' | 'CBRNE' | 'Other'
  event: string
  urgency: 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown'
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'
  certainty: 'Observed' | 'Likely' | 'Possible' | 'Unlikely' | 'Unknown'
  headline: string
  description: string
  instruction: string
  areas: CAPArea[]
}

export interface CAPArea {
  areaDesc: string
  polygon?: string
  circle?: string
  geocode?: Array<{
    valueName: string
    value: string
  }>
}
