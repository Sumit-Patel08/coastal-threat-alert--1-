// Mock data for demo purposes
export interface Alert {
  id: string
  title: string
  severity: "low" | "high" | "critical"
  location: string
  coordinates?: { lat: number; lng: number }
  timeIssued: string
  lastUpdate: string
  description: string
  safetyActions: string[]
  category: "weather" | "sea-level" | "current" | "cyclone" | "tsunami"
  status: "active" | "resolved" | "monitoring"
}

export interface SafetyTip {
  id: string
  title: string
  category: "Weather" | "Navigation" | "Emergency" | "Health"
  shortDescription: string
  detailedExplanation: string
  steps: string[]
  images?: string[]
  priority: "high" | "medium" | "low"
}

export interface CoastalCondition {
  id: string
  location: string
  coordinates: { lat: number; lng: number }
  seaLevel: "normal" | "high" | "very-high"
  windSpeed: string
  visibility: "poor" | "moderate" | "good" | "excellent"
  fishingSafety: "safe" | "caution" | "unsafe"
  temperature: string
  waveHeight: string
  currentStrength: "weak" | "moderate" | "strong"
  lastUpdated: string
}

export const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    title: "Cyclone Warning - Severe Weather Approaching",
    severity: "critical",
    location: "50km offshore from Chennai Coast",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    timeIssued: "2025-08-30T08:30:00Z",
    lastUpdate: "2025-08-30T14:00:00Z",
    description: "A severe cyclonic storm is approaching the coast with wind speeds up to 120 km/h. Heavy rainfall and storm surge expected.",
    safetyActions: [
      "Return to shore immediately if currently at sea",
      "Secure all fishing equipment and boats",
      "Move to higher ground away from the coast",
      "Stock up on emergency supplies (water, food, medicines)",
      "Stay indoors and avoid coastal areas",
      "Monitor weather updates regularly"
    ],
    category: "cyclone",
    status: "active"
  },
  {
    id: "alert-002", 
    title: "High Sea Level Rise Alert",
    severity: "high",
    location: "Nearby Coast - Fishing Zone A",
    coordinates: { lat: 13.0500, lng: 80.2500 },
    timeIssued: "2025-08-30T06:00:00Z",
    lastUpdate: "2025-08-30T13:30:00Z",
    description: "Sea levels are rising above normal due to high tide and strong onshore winds. Coastal flooding possible.",
    safetyActions: [
      "Avoid low-lying coastal areas",
      "Move boats to higher moorings",
      "Check tide schedules before venturing out",
      "Wear life jackets when near water",
      "Have emergency contact numbers ready"
    ],
    category: "sea-level",
    status: "active"
  },
  {
    id: "alert-003",
    title: "Strong Current Advisory",
    severity: "high",
    location: "Deep Water Fishing Zone B",
    coordinates: { lat: 12.9500, lng: 80.3000 },
    timeIssued: "2025-08-30T05:00:00Z",
    lastUpdate: "2025-08-30T12:00:00Z",
    description: "Unusually strong underwater currents detected. Risk of boats being pulled offshore.",
    safetyActions: [
      "Use extra caution when fishing in deep waters",
      "Stay close to shore",
      "Fish in groups, never alone",
      "Ensure GPS and communication devices are working",
      "Inform others of your fishing location and return time"
    ],
    category: "current",
    status: "monitoring"
  },
  {
    id: "alert-004",
    title: "Weather Advisory - Fog and Low Visibility",
    severity: "low",
    location: "Harbor Area and Near Shore",
    coordinates: { lat: 13.1000, lng: 80.2800 },
    timeIssued: "2025-08-30T04:00:00Z",
    lastUpdate: "2025-08-30T11:00:00Z",
    description: "Dense fog reducing visibility to less than 500 meters. Navigation hazards increased.",
    safetyActions: [
      "Use fog horns and navigation lights",
      "Reduce speed and maintain safe distances",
      "Use GPS and radar if available",
      "Stay in familiar waters",
      "Consider postponing trips until visibility improves"
    ],
    category: "weather",
    status: "active"
  }
]

export const mockSafetyTips: SafetyTip[] = [
  {
    id: "tip-001",
    title: "Pre-Departure Weather Check",
    category: "Weather",
    shortDescription: "Always check weather forecast before going to sea",
    detailedExplanation: "Weather conditions can change rapidly at sea. A thorough weather check can prevent dangerous situations and save lives.",
    steps: [
      "Check local weather forecast for next 6-12 hours",
      "Look for wind speed, wave height, and visibility reports",
      "Check for any weather warnings or advisories",
      "Consult with other fishermen about recent conditions",
      "Have a backup plan if weather deteriorates"
    ],
    priority: "high"
  },
  {
    id: "tip-002",
    title: "Emergency Communication Setup",
    category: "Emergency",
    shortDescription: "Keep emergency contacts readily available",
    detailedExplanation: "Quick access to emergency contacts can be life-saving during maritime emergencies.",
    steps: [
      "Program Coast Guard number (1554) in your phone",
      "Save local fisheries helpline (1800-425-1555)",
      "Keep family contact numbers easily accessible",
      "Ensure your phone is fully charged before departure",
      "Consider carrying a backup communication device",
      "Inform someone on shore about your fishing plans"
    ],
    priority: "high"
  },
  {
    id: "tip-003",
    title: "Tide Monitoring for Safe Navigation",
    category: "Navigation",
    shortDescription: "Monitor sea level changes during high tide",
    detailedExplanation: "Understanding tidal patterns helps in safe navigation and prevents grounding or getting stranded.",
    steps: [
      "Check tide tables before departure",
      "Note high and low tide times",
      "Plan your route considering tidal changes",
      "Be extra cautious during spring tides",
      "Know the depth of areas you'll be fishing in",
      "Have alternative routes planned"
    ],
    priority: "medium"
  },
  {
    id: "tip-004",
    title: "Cyclone Season Precautions",
    category: "Weather",
    shortDescription: "Avoid fishing during cyclone warnings",
    detailedExplanation: "Cyclones pose extreme danger to fishing vessels. Preparation and avoidance are key to safety.",
    steps: [
      "Monitor cyclone tracking websites regularly",
      "Secure your boat well in advance of storms",
      "Stock emergency supplies at home",
      "Never venture out during cyclone warnings",
      "Help other fishermen secure their equipment",
      "Follow official evacuation orders if issued"
    ],
    priority: "high"
  },
  {
    id: "tip-005",
    title: "Essential Safety Equipment",
    category: "Emergency",
    shortDescription: "Carry life jackets and safety equipment",
    detailedExplanation: "Proper safety equipment can mean the difference between life and death in emergency situations.",
    steps: [
      "Ensure life jackets for all crew members",
      "Carry flares and signaling devices",
      "Have a first aid kit on board",
      "Bring extra fuel and water",
      "Pack emergency food supplies",
      "Test all safety equipment regularly"
    ],
    priority: "high"
  },
  {
    id: "tip-006",
    title: "Heat Stroke Prevention",
    category: "Health",
    shortDescription: "Protect yourself from sun exposure and dehydration",
    detailedExplanation: "Long hours under the sun can lead to heat-related illnesses. Prevention is crucial for your health and safety.",
    steps: [
      "Wear wide-brimmed hats and protective clothing",
      "Apply sunscreen regularly (SPF 30+)",
      "Drink water frequently, even if not thirsty",
      "Take breaks in shade when possible",
      "Recognize early signs of heat exhaustion",
      "Carry oral rehydration salts"
    ],
    priority: "medium"
  }
]

export const mockCoastalConditions: CoastalCondition[] = [
  {
    id: "condition-001",
    location: "Current Fishing Zone",
    coordinates: { lat: 13.0827, lng: 80.2707 },
    seaLevel: "normal",
    windSpeed: "15 km/h",
    visibility: "good",
    fishingSafety: "safe",
    temperature: "28°C",
    waveHeight: "0.5-1.0m",
    currentStrength: "weak",
    lastUpdated: "2025-08-30T14:00:00Z"
  },
  {
    id: "condition-002",
    location: "Nearby Harbor",
    coordinates: { lat: 13.1000, lng: 80.2800 },
    seaLevel: "high",
    windSpeed: "25 km/h",
    visibility: "moderate",
    fishingSafety: "caution",
    temperature: "27°C",
    waveHeight: "1.0-1.5m",
    currentStrength: "moderate",
    lastUpdated: "2025-08-30T14:00:00Z"
  },
  {
    id: "condition-003",
    location: "Deep Water Zone",
    coordinates: { lat: 12.9500, lng: 80.3000 },
    seaLevel: "normal",
    windSpeed: "20 km/h",
    visibility: "good",
    fishingSafety: "safe",
    temperature: "26°C",
    waveHeight: "1.0-2.0m",
    currentStrength: "moderate",
    lastUpdated: "2025-08-30T14:00:00Z"
  }
]

// Helper functions
export function getSeverityColor(severity: Alert["severity"]) {
  switch (severity) {
    case "low":
      return "text-green-700 bg-green-50 border-green-200"
    case "high":
      return "text-orange-700 bg-orange-50 border-orange-200"
    case "critical":
      return "text-red-700 bg-red-50 border-red-200"
    default:
      return "text-gray-700 bg-gray-50 border-gray-200"
  }
}

export function getSeverityBadgeVariant(severity: Alert["severity"]) {
  switch (severity) {
    case "low":
      return "default" as const
    case "high":
      return "secondary" as const
    case "critical":
      return "destructive" as const
    default:
      return "outline" as const
  }
}

export function getFishingSafetyColor(safety: CoastalCondition["fishingSafety"]) {
  switch (safety) {
    case "safe":
      return "text-green-700 bg-green-50"
    case "caution":
      return "text-yellow-700 bg-yellow-50"
    case "unsafe":
      return "text-red-700 bg-red-50"
    default:
      return "text-gray-700 bg-gray-50"
  }
}

// AI Alert System Mock Data
export interface AIAlert {
  id: string
  type: string
  severity: "Critical" | "High" | "Medium" | "Low"
  source: "AI Analysis System"
  city: string
  description: string
  detectedAt: string
  confidence: number
  autoGenerated: boolean
}

// City-specific AI alerts that change based on selection
export const aiAlertsByCity: Record<string, AIAlert[]> = {
  "Mumbai": [
    {
      id: "ai-mum-001",
      type: "Sea Level Rise",
      severity: "Critical",
      source: "AI Analysis System",
      city: "Mumbai",
      description: "Critical sea level rise detected. Current level: 1.10m above normal. Immediate evacuation protocols recommended.",
      detectedAt: new Date().toLocaleString(),
      confidence: 92,
      autoGenerated: true
    },
    {
      id: "ai-mum-002",
      type: "Storm Surge Warning",
      severity: "Critical",
      source: "AI Analysis System",
      city: "Mumbai",
      description: "High probability of storm surge within 24-48 hours. Expected height: 3.5-4.2m above normal tide levels.",
      detectedAt: new Date().toLocaleString(),
      confidence: 85,
      autoGenerated: true
    },
    {
      id: "ai-mum-003",
      type: "Coastal Erosion",
      severity: "High",
      source: "AI Analysis System",
      city: "Mumbai",
      description: "Accelerated coastal erosion detected. Erosion rate: 1.1m/month. Infrastructure at risk.",
      detectedAt: new Date().toLocaleString(),
      confidence: 78,
      autoGenerated: true
    }
  ],
  "Chennai": [
    {
      id: "ai-che-001",
      type: "Cyclone Formation",
      severity: "Critical",
      source: "AI Analysis System",
      city: "Chennai",
      description: "Cyclonic disturbance detected 150km offshore. Wind speeds increasing to 95 km/h. Landfall expected in 18-24 hours.",
      detectedAt: new Date().toLocaleString(),
      confidence: 94,
      autoGenerated: true
    },
    {
      id: "ai-che-002",
      type: "Heavy Rainfall Alert",
      severity: "High",
      source: "AI Analysis System",
      city: "Chennai",
      description: "Intense precipitation forecast. Expected rainfall: 150-200mm in next 12 hours. Urban flooding likely.",
      detectedAt: new Date().toLocaleString(),
      confidence: 88,
      autoGenerated: true
    },
    {
      id: "ai-che-003",
      type: "Tidal Surge",
      severity: "Medium",
      source: "AI Analysis System",
      city: "Chennai",
      description: "Abnormal tidal patterns detected. High tide levels 0.8m above predicted. Coastal areas may experience flooding.",
      detectedAt: new Date().toLocaleString(),
      confidence: 76,
      autoGenerated: true
    }
  ],
  "Kolkata": [
    {
      id: "ai-kol-001",
      type: "River Flooding",
      severity: "High",
      source: "AI Analysis System",
      city: "Kolkata",
      description: "Hooghly River water levels rising rapidly. Current level: 2.3m above danger mark. Embankment stress detected.",
      detectedAt: new Date().toLocaleString(),
      confidence: 91,
      autoGenerated: true
    },
    {
      id: "ai-kol-002",
      type: "Monsoon Intensity",
      severity: "Critical",
      source: "AI Analysis System",
      city: "Kolkata",
      description: "Severe monsoon activity detected. Rainfall intensity: 45mm/hour. Drainage system capacity exceeded.",
      detectedAt: new Date().toLocaleString(),
      confidence: 89,
      autoGenerated: true
    },
    {
      id: "ai-kol-003",
      type: "Salinity Intrusion",
      severity: "Medium",
      source: "AI Analysis System",
      city: "Kolkata",
      description: "Saltwater intrusion detected in Sundarbans region. Salinity levels 15% above normal. Ecosystem impact likely.",
      detectedAt: new Date().toLocaleString(),
      confidence: 82,
      autoGenerated: true
    }
  ],
  "Kochi": [
    {
      id: "ai-koc-001",
      type: "Backwater Pollution",
      severity: "High",
      source: "AI Analysis System",
      city: "Kochi",
      description: "Toxic algal bloom detected in Vembanad Lake. Oxygen levels dropping. Marine life mortality risk elevated.",
      detectedAt: new Date().toLocaleString(),
      confidence: 87,
      autoGenerated: true
    },
    {
      id: "ai-koc-002",
      type: "Coastal Subsidence",
      severity: "Medium",
      source: "AI Analysis System",
      city: "Kochi",
      description: "Land subsidence detected in coastal areas. Rate: 2.5cm/year. Infrastructure stability concerns.",
      detectedAt: new Date().toLocaleString(),
      confidence: 79,
      autoGenerated: true
    },
    {
      id: "ai-koc-003",
      type: "Fishing Zone Alert",
      severity: "Low",
      source: "AI Analysis System",
      city: "Kochi",
      description: "Unusual fish migration patterns detected. Traditional fishing zones showing 30% reduced catch rates.",
      detectedAt: new Date().toLocaleString(),
      confidence: 71,
      autoGenerated: true
    }
  ],
  "Visakhapatnam": [
    {
      id: "ai-vis-001",
      type: "Industrial Pollution",
      severity: "Critical",
      source: "AI Analysis System",
      city: "Visakhapatnam",
      description: "Chemical discharge detected near port area. Heavy metal concentrations 400% above safe limits. Immediate containment required.",
      detectedAt: new Date().toLocaleString(),
      confidence: 96,
      autoGenerated: true
    },
    {
      id: "ai-vis-002",
      type: "Ship Traffic Anomaly",
      severity: "Medium",
      source: "AI Analysis System",
      city: "Visakhapatnam",
      description: "Unusual vessel movement patterns detected. 25% increase in unscheduled arrivals. Port congestion likely.",
      detectedAt: new Date().toLocaleString(),
      confidence: 73,
      autoGenerated: true
    }
  ],
  "Mangalore": [
    {
      id: "ai-man-001",
      type: "Coastal Erosion",
      severity: "High",
      source: "AI Analysis System",
      city: "Mangalore",
      description: "Severe beach erosion detected at Panambur. Erosion rate: 1.8m/month. Tourist infrastructure at risk.",
      detectedAt: new Date().toLocaleString(),
      confidence: 84,
      autoGenerated: true
    },
    {
      id: "ai-man-002",
      type: "Monsoon Delay",
      severity: "Medium",
      source: "AI Analysis System",
      city: "Mangalore",
      description: "Southwest monsoon onset delayed by 12 days. Agricultural water stress indicators rising.",
      detectedAt: new Date().toLocaleString(),
      confidence: 77,
      autoGenerated: true
    }
  ]
}

// Helper function to get AI alerts for a specific city
export function getAIAlertsForCity(city: string): AIAlert[] {
  return aiAlertsByCity[city] || []
}

// Helper function to get all available cities with AI alerts
export function getAvailableCities(): string[] {
  return Object.keys(aiAlertsByCity)
}

// Helper function to get trend color based on change
export function getTrendColor(change: number): string {
  if (change > 0.15) return "text-red-600"
  if (change > 0) return "text-orange-600"
  if (change < -0.1) return "text-green-600"
  return "text-gray-600"
}

// Helper function to get cyclone severity color
export function getCycloneSeverityColor(severity: string): string {
  switch (severity) {
    case "verySevere": return "bg-red-500"
    case "severe": return "bg-orange-500"
    case "moderate": return "bg-yellow-500"
    case "low": return "bg-green-500"
    default: return "bg-gray-500"
  }
}

// Helper function to get severity color for AI alerts
export function getAISeverityColor(severity: AIAlert["severity"]) {
  switch (severity) {
    case "Critical":
      return "text-red-700 bg-red-50 border-red-200"
    case "High":
      return "text-orange-700 bg-orange-50 border-orange-200"
    case "Medium":
      return "text-yellow-700 bg-yellow-50 border-yellow-200"
    case "Low":
      return "text-green-700 bg-green-50 border-green-200"
    default:
      return "text-gray-700 bg-gray-50 border-gray-200"
  }
}

// Historical Trends Data
export interface SeaLevelData {
  month: string
  level: number
  change: number
}

export interface CycloneData {
  year: number
  count: number
  severity: {
    low: number
    moderate: number
    severe: number
    verySevere: number
  }
}

export interface TrendData {
  seaLevelTrends: SeaLevelData[]
  cycloneFrequency: CycloneData[]
}

// Mock historical data for coastal trends
export const historicalTrendsData: TrendData = {
  seaLevelTrends: [
    { month: "Jan 2024", level: 1.2, change: 0.1 },
    { month: "Feb 2024", level: 1.3, change: 0.1 },
    { month: "Mar 2024", level: 1.5, change: 0.2 },
    { month: "Apr 2024", level: 1.4, change: -0.1 },
    { month: "May 2024", level: 1.7, change: 0.3 },
    { month: "Jun 2024", level: 1.9, change: 0.2 },
    { month: "Jul 2024", level: 2.1, change: 0.2 },
    { month: "Aug 2024", level: 2.3, change: 0.2 },
    { month: "Sep 2024", level: 2.0, change: -0.3 },
    { month: "Oct 2024", level: 1.8, change: -0.2 },
    { month: "Nov 2024", level: 1.6, change: -0.2 },
    { month: "Dec 2024", level: 1.4, change: -0.2 }
  ],
  cycloneFrequency: [
    {
      year: 2020,
      count: 8,
      severity: { low: 3, moderate: 3, severe: 1, verySevere: 1 }
    },
    {
      year: 2021,
      count: 12,
      severity: { low: 5, moderate: 4, severe: 2, verySevere: 1 }
    },
    {
      year: 2022,
      count: 6,
      severity: { low: 2, moderate: 2, severe: 1, verySevere: 1 }
    },
    {
      year: 2023,
      count: 10,
      severity: { low: 4, moderate: 3, severe: 2, verySevere: 1 }
    },
    {
      year: 2024,
      count: 14,
      severity: { low: 6, moderate: 4, severe: 3, verySevere: 1 }
    }
  ]
}
