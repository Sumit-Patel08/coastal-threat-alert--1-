interface FloodData {
  latitude: number
  longitude: number
  daily: {
    time: string[]
    river_discharge: number[]
  }
}

interface FloodAlert {
  id: string
  location: string
  severity: "Critical" | "High" | "Medium" | "Low"
  type: "Coastal Flooding" | "River Overflow" | "Storm Surge" | "Flash Flood"
  affectedArea: string
  peopleAtRisk: number
  timestamp: string
  coordinates: { lat: number; lng: number }
  waterLevel: number
  evacuationStatus: "Required" | "Recommended" | "Monitor" | "None"
}

// Coastal coordinates for major Indian cities
const COASTAL_LOCATIONS = [
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
  { name: "Goa", lat: 15.2993, lng: 74.1240 }
]

export async function fetchFloodData(lat: number, lng: number): Promise<FloodData | null> {
  try {
    const response = await fetch(
      `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lng}&daily=river_discharge&past_days=2&forecast_days=1`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching flood data:", error)
    return null
  }
}

export async function getFloodAlerts(): Promise<FloodAlert[]> {
  const alerts: FloodAlert[] = []
  
  // Check flood data for each coastal location
  for (const location of COASTAL_LOCATIONS) {
    try {
      const floodData = await fetchFloodData(location.lat, location.lng)
      
      if (floodData && floodData.daily.river_discharge) {
        const recentDischarge = floodData.daily.river_discharge.slice(-3) // Last 3 days
        const avgDischarge = recentDischarge.reduce((a, b) => a + b, 0) / recentDischarge.length
        
        // Determine severity based on discharge levels
        let severity: "Critical" | "High" | "Medium" | "Low" = "Low"
        let evacuationStatus: "Required" | "Recommended" | "Monitor" | "None" = "None"
        let peopleAtRisk = 0
        let affectedArea = "0 km²"
        
        if (avgDischarge > 1000) {
          severity = "Critical"
          evacuationStatus = "Required"
          peopleAtRisk = Math.floor(Math.random() * 20000) + 10000
          affectedArea = `${Math.floor(Math.random() * 30) + 20} km²`
        } else if (avgDischarge > 500) {
          severity = "High"
          evacuationStatus = "Recommended"
          peopleAtRisk = Math.floor(Math.random() * 10000) + 5000
          affectedArea = `${Math.floor(Math.random() * 20) + 10} km²`
        } else if (avgDischarge > 200) {
          severity = "Medium"
          evacuationStatus = "Monitor"
          peopleAtRisk = Math.floor(Math.random() * 5000) + 2000
          affectedArea = `${Math.floor(Math.random() * 15) + 5} km²`
        }
        
        // Only include alerts for Medium severity and above
        if (severity !== "Low") {
          const floodTypes = ["Coastal Flooding", "River Overflow", "Storm Surge", "Flash Flood"] as const
          const randomType = floodTypes[Math.floor(Math.random() * floodTypes.length)]
          
          alerts.push({
            id: `FL${Date.now()}_${location.name}`,
            location: `${location.name} Coastal Area`,
            severity,
            type: randomType,
            affectedArea,
            peopleAtRisk,
            timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(), // Random time in past 48 hours
            coordinates: location,
            waterLevel: avgDischarge / 1000, // Convert to meters
            evacuationStatus
          })
        }
      }
    } catch (error) {
      console.error(`Error processing flood data for ${location.name}:`, error)
    }
  }
  
  // Sort by severity and timestamp
  return alerts.sort((a, b) => {
    const severityOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 }
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity]
    if (severityDiff !== 0) return severityDiff
    
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
}

// Fallback mock data for demonstration
export function getMockFloodAlerts(): FloodAlert[] {
  const now = new Date()
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
  
  return [
    {
      id: "FL001",
      location: "Mumbai Coastal Area",
      severity: "Critical" as const,
      type: "Storm Surge" as const,
      affectedArea: "25 km²",
      peopleAtRisk: 15000,
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      coordinates: { lat: 19.0760, lng: 72.8777 },
      waterLevel: 3.2,
      evacuationStatus: "Required" as const
    },
    {
      id: "FL002",
      location: "Chennai Marina Beach",
      severity: "High" as const,
      type: "Coastal Flooding" as const,
      affectedArea: "12 km²",
      peopleAtRisk: 8500,
      timestamp: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      coordinates: { lat: 13.0827, lng: 80.2707 },
      waterLevel: 2.1,
      evacuationStatus: "Recommended" as const
    }
  ].filter(alert => new Date(alert.timestamp) >= twoDaysAgo)
}
