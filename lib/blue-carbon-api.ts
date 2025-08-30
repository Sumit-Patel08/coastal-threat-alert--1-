interface BlueCarbonData {
  ecosystem: string
  carbonStock: string
  area: string
  status: "Protected" | "At Risk" | "Declining" | "Stable"
  currentMonth: {
    carbonSequestration: number
    biomass: number
    soilCarbon: number
    areaChange: number
  }
  previousMonth: {
    carbonSequestration: number
    biomass: number
    soilCarbon: number
    areaChange: number
  }
  previousYear: {
    carbonSequestration: number
    biomass: number
    soilCarbon: number
    areaChange: number
  }
  trends: {
    carbonTrend: "increasing" | "decreasing" | "stable"
    areaTrend: "expanding" | "shrinking" | "stable"
    threatLevel: "low" | "medium" | "high"
  }
  locations: {
    name: string
    coordinates: { lat: number; lng: number }
    coverage: number
    health: "excellent" | "good" | "fair" | "poor"
  }[]
}

// Simulate Google Earth Engine API data for coastal ecosystems
export async function getBlueCarbonDetails(ecosystem: string): Promise<BlueCarbonData> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const ecosystemData: Record<string, BlueCarbonData> = {
    "Mangroves": {
      ecosystem: "Mangroves",
      carbonStock: "1,200 tons/ha",
      area: "3,200 km²",
      status: "Protected",
      currentMonth: {
        carbonSequestration: 4.2,
        biomass: 285,
        soilCarbon: 915,
        areaChange: 0.8
      },
      previousMonth: {
        carbonSequestration: 4.1,
        biomass: 282,
        soilCarbon: 910,
        areaChange: 0.6
      },
      previousYear: {
        carbonSequestration: 3.9,
        biomass: 275,
        soilCarbon: 895,
        areaChange: -2.1
      },
      trends: {
        carbonTrend: "increasing",
        areaTrend: "expanding",
        threatLevel: "low"
      },
      locations: [
        { name: "Sundarbans West Bengal", coordinates: { lat: 21.9497, lng: 89.1833 }, coverage: 85, health: "excellent" },
        { name: "Pichavaram Tamil Nadu", coordinates: { lat: 11.4271, lng: 79.7925 }, coverage: 78, health: "good" },
        { name: "Bhitarkanika Odisha", coordinates: { lat: 20.7050, lng: 86.9000 }, coverage: 82, health: "good" },
        { name: "Coringa Andhra Pradesh", coordinates: { lat: 16.7500, lng: 82.2333 }, coverage: 71, health: "fair" }
      ]
    },
    "Salt Marshes": {
      ecosystem: "Salt Marshes",
      carbonStock: "800 tons/ha",
      area: "1,800 km²",
      status: "At Risk",
      currentMonth: {
        carbonSequestration: 2.8,
        biomass: 145,
        soilCarbon: 655,
        areaChange: -0.3
      },
      previousMonth: {
        carbonSequestration: 2.9,
        biomass: 148,
        soilCarbon: 660,
        areaChange: -0.2
      },
      previousYear: {
        carbonSequestration: 3.2,
        biomass: 165,
        soilCarbon: 685,
        areaChange: -5.8
      },
      trends: {
        carbonTrend: "decreasing",
        areaTrend: "shrinking",
        threatLevel: "high"
      },
      locations: [
        { name: "Rann of Kutch Gujarat", coordinates: { lat: 23.7337, lng: 69.8597 }, coverage: 65, health: "fair" },
        { name: "Chilika Lake Odisha", coordinates: { lat: 19.7179, lng: 85.3206 }, coverage: 58, health: "poor" },
        { name: "Pulicat Lake Tamil Nadu", coordinates: { lat: 13.6667, lng: 80.3167 }, coverage: 72, health: "good" },
        { name: "Kolleru Lake Andhra Pradesh", coordinates: { lat: 16.7167, lng: 81.3333 }, coverage: 45, health: "poor" }
      ]
    },
    "Seagrass Beds": {
      ecosystem: "Seagrass Beds",
      carbonStock: "600 tons/ha",
      area: "2,100 km²",
      status: "Declining",
      currentMonth: {
        carbonSequestration: 1.9,
        biomass: 95,
        soilCarbon: 505,
        areaChange: -1.2
      },
      previousMonth: {
        carbonSequestration: 2.1,
        biomass: 98,
        soilCarbon: 510,
        areaChange: -1.0
      },
      previousYear: {
        carbonSequestration: 2.6,
        biomass: 125,
        soilCarbon: 545,
        areaChange: -8.5
      },
      trends: {
        carbonTrend: "decreasing",
        areaTrend: "shrinking",
        threatLevel: "high"
      },
      locations: [
        { name: "Gulf of Mannar Tamil Nadu", coordinates: { lat: 9.1000, lng: 79.1167 }, coverage: 42, health: "poor" },
        { name: "Lakshadweep Islands", coordinates: { lat: 10.5667, lng: 72.6417 }, coverage: 68, health: "fair" },
        { name: "Andaman Islands", coordinates: { lat: 11.7401, lng: 92.6586 }, coverage: 75, health: "good" },
        { name: "Palk Bay Tamil Nadu", coordinates: { lat: 9.2833, lng: 79.1500 }, coverage: 38, health: "poor" }
      ]
    },
    "Tidal Flats": {
      ecosystem: "Tidal Flats",
      carbonStock: "400 tons/ha",
      area: "1,500 km²",
      status: "Stable",
      currentMonth: {
        carbonSequestration: 1.2,
        biomass: 65,
        soilCarbon: 335,
        areaChange: 0.1
      },
      previousMonth: {
        carbonSequestration: 1.2,
        biomass: 64,
        soilCarbon: 334,
        areaChange: 0.0
      },
      previousYear: {
        carbonSequestration: 1.1,
        biomass: 62,
        soilCarbon: 325,
        areaChange: 1.2
      },
      trends: {
        carbonTrend: "stable",
        areaTrend: "stable",
        threatLevel: "medium"
      },
      locations: [
        { name: "Mumbai Harbor", coordinates: { lat: 18.9220, lng: 72.8347 }, coverage: 55, health: "fair" },
        { name: "Hooghly Estuary", coordinates: { lat: 22.3833, lng: 88.2667 }, coverage: 62, health: "good" },
        { name: "Godavari Delta", coordinates: { lat: 16.2333, lng: 81.8000 }, coverage: 58, health: "fair" },
        { name: "Mahanadi Delta", coordinates: { lat: 20.2500, lng: 86.7167 }, coverage: 65, health: "good" }
      ]
    }
  }

  return ecosystemData[ecosystem] || ecosystemData["Mangroves"]
}

// Simulate Google Earth Engine API for historical data
export async function getHistoricalCarbonData(ecosystem: string, timeframe: "month" | "year"): Promise<any[]> {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const currentDate = new Date()
  const dataPoints = timeframe === "month" ? 30 : 12
  
  return Array.from({ length: dataPoints }, (_, i) => {
    const date = new Date(currentDate)
    if (timeframe === "month") {
      date.setDate(date.getDate() - (dataPoints - 1 - i))
    } else {
      date.setMonth(date.getMonth() - (dataPoints - 1 - i))
    }
    
    const baseValue = ecosystem === "Mangroves" ? 4.0 : 
                     ecosystem === "Salt Marshes" ? 2.8 : 
                     ecosystem === "Seagrass Beds" ? 2.0 : 1.2
    
    const variation = (Math.random() - 0.5) * 0.4
    const trend = ecosystem === "Mangroves" ? 0.01 : 
                  ecosystem === "Salt Marshes" ? -0.02 : 
                  ecosystem === "Seagrass Beds" ? -0.03 : 0.005
    
    return {
      date: date.toISOString().split('T')[0],
      carbonSequestration: Math.max(0, baseValue + (i * trend) + variation),
      biomass: Math.max(0, (baseValue * 50) + (i * trend * 50) + (variation * 20)),
      areaChange: (Math.random() - 0.5) * 2
    }
  })
}

// Simulate Google Maps API for ecosystem locations
export function getEcosystemMapUrl(location: { lat: number; lng: number }, zoom: number = 12): string {
  return `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=${zoom}&size=400x300&maptype=satellite&format=jpg`
}

// Calculate carbon trends and projections
export function calculateCarbonTrends(data: BlueCarbonData) {
  const currentVsPrevMonth = ((data.currentMonth.carbonSequestration - data.previousMonth.carbonSequestration) / data.previousMonth.carbonSequestration) * 100
  const currentVsPrevYear = ((data.currentMonth.carbonSequestration - data.previousYear.carbonSequestration) / data.previousYear.carbonSequestration) * 100
  
  return {
    monthlyChange: currentVsPrevMonth,
    yearlyChange: currentVsPrevYear,
    projection: data.currentMonth.carbonSequestration * 12, // Annual projection
    efficiency: (data.currentMonth.carbonSequestration / parseFloat(data.area.replace(/[^\d.]/g, ''))) * 1000 // tons per km²
  }
}
