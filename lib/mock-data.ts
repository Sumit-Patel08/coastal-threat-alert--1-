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
