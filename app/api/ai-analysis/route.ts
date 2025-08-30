import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json()
    const supabase = await createClient()

    // Generate fake sensor data for demo
    const fakeSensorData = generateFakeSensorData(city)
    
    // AI Analysis Logic
    const analysis = await performAIAnalysis(fakeSensorData, city)
    
    // Auto-generate risk assessment
    const riskAssessment = await generateRiskAssessment(analysis, city, supabase)
    
    // Auto-generate alerts if needed
    const alerts = await generateAlerts(analysis, city, supabase)

    return NextResponse.json({
      city,
      analysis,
      riskAssessment,
      alerts,
      sensorData: fakeSensorData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Analysis error:', error)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
}

function generateFakeSensorData(city: string) {
  const cityVariations = {
    'Mumbai': { seaLevelBase: 2.1, windBase: 25, pollutionBase: 85 },
    'Chennai': { seaLevelBase: 1.8, windBase: 30, pollutionBase: 75 },
    'Kolkata': { seaLevelBase: 2.3, windBase: 20, pollutionBase: 95 },
    'Kochi': { seaLevelBase: 1.5, windBase: 15, pollutionBase: 45 },
    'Visakhapatnam': { seaLevelBase: 1.9, windBase: 35, pollutionBase: 65 },
    'Goa': { seaLevelBase: 1.2, windBase: 18, pollutionBase: 35 },
    'Mangalore': { seaLevelBase: 1.6, windBase: 22, pollutionBase: 55 }
  }

  const base = cityVariations[city as keyof typeof cityVariations] || cityVariations['Mumbai']
  
  return [
    {
      id: `sensor-${Date.now()}-1`,
      sensor_type: 'tide_gauge',
      location: `${city} Port`,
      value: base.seaLevelBase + (Math.random() * 0.8 - 0.4),
      unit: 'meters',
      timestamp: new Date().toISOString()
    },
    {
      id: `sensor-${Date.now()}-2`,
      sensor_type: 'weather_station',
      location: `${city} Coastal Station`,
      value: base.windBase + (Math.random() * 20 - 10),
      unit: 'km/h',
      timestamp: new Date().toISOString()
    },
    {
      id: `sensor-${Date.now()}-3`,
      sensor_type: 'pollution_sensor',
      location: `${city} Bay Area`,
      value: base.pollutionBase + (Math.random() * 30 - 15),
      unit: 'AQI',
      timestamp: new Date().toISOString()
    }
  ]
}

async function performAIAnalysis(sensorData: any[], city: string) {
  const latestData = sensorData.reduce((acc, sensor) => {
    acc[sensor.sensor_type] = sensor.value
    return acc
  }, {} as Record<string, number>)

  const seaLevel = latestData.tide_gauge || 0
  const windSpeed = latestData.weather_station || 0
  const pollution = latestData.pollution_sensor || 0

  // AI Risk Calculation Algorithm
  let riskScore = 0
  let riskLevel = 'Low'
  let threats = []

  // Sea level analysis
  if (seaLevel > 3.0) {
    riskScore += 40
    threats.push('Severe flooding risk')
  } else if (seaLevel > 2.5) {
    riskScore += 25
    threats.push('Moderate flooding risk')
  }

  // Wind analysis
  if (windSpeed > 70) {
    riskScore += 35
    threats.push('Cyclone/storm conditions')
  } else if (windSpeed > 50) {
    riskScore += 20
    threats.push('High wind conditions')
  }

  // Pollution analysis
  if (pollution > 15) {
    riskScore += 25
    threats.push('Critical pollution levels')
  } else if (pollution > 10) {
    threats.push('Elevated pollution')
  }

  // AI predictions
  const predictions = {
    cycloneProbability: Math.min(windSpeed / 100, 1),
    floodRisk: Math.min(seaLevel / 4, 1),
    pollutionTrend: pollution > 10 ? 'Increasing' : 'Stable',
    algalBloomRisk: pollution > 12 ? 'High' : pollution > 8 ? 'Medium' : 'Low'
  }

  const finalThreatLevel = riskScore > 70 ? 'High' : riskScore > 40 ? 'Medium' : 'Low'
  
  return {
    riskScore,
    riskLevel: finalThreatLevel,
    threats,
    predictions,
    sensorReadings: latestData,
    analysisTime: new Date().toISOString()
  }
}

async function generateRiskAssessment(analysis: any, city: string, supabase: any) {
  const cityProfile = {
    cycloneProb: 0.2,
    baseRisk: 0.5
  }
  const avgSeaLevel = 2.0
  const avgPollution = 50
  const threatLevel = analysis.riskLevel
  const riskScore = analysis.riskScore

  const riskAssessment = {
    region: city,
    risk_level: threatLevel,
    sea_level: avgSeaLevel + (Math.random() * 0.4 - 0.2),
    cyclones: Math.floor(cityProfile.cycloneProb * 5 + Math.random() * 3),
    pollution: avgPollution > 100 ? 'High' : avgPollution > 50 ? 'Medium' : 'Low',
    algal_blooms: riskScore > 0.6 ? 'Present' : Math.random() > 0.7 ? 'Detected' : 'None',
    illegal_activities: riskScore > 0.8 ? 'Detected' : Math.random() > 0.85 ? 'Suspected' : 'None',
    population_density: Math.floor(2000 + cityProfile.baseRisk * 8000 + Math.random() * 3000)
  }

  const { data } = await supabase
    .from('risk_assessments')
    .insert(riskAssessment)
    .select()
    .single()

  return data
}

async function generateAlerts(analysis: any, city: string, supabase: any) {
  const alerts = []

  for (const threat of analysis.threats) {
    let alertType = 'General Warning'
    let severity = 'Medium'

    if (threat.includes('flooding')) {
      alertType = 'Storm Surge'
      severity = threat.includes('Severe') ? 'Critical' : 'High'
    } else if (threat.includes('Cyclone')) {
      alertType = 'Cyclone'
      severity = 'Critical'
    } else if (threat.includes('pollution')) {
      alertType = 'Pollution'
      severity = threat.includes('Critical') ? 'Critical' : 'High'
    } else if (threat.includes('wind')) {
      alertType = 'High Winds'
      severity = 'High'
    }

    const alertData = {
      type: alertType,
      severity,
      location: `${city} Coastal Area`,
      description: `AI-detected threat: ${threat}. Automated analysis indicates ${analysis.riskLevel.toLowerCase()} risk conditions.`,
      source: 'AI Analysis'
    }

    const { data } = await supabase
      .from('alert_logs')
      .insert(alertData)
      .select()
      .single()

    alerts.push(data)
  }

  return alerts
}

function getCityPopulationDensity(city: string): number {
  const densities: Record<string, number> = {
    'Mumbai': 20482,
    'Chennai': 26903,
    'Kolkata': 24252,
    'Goa': 394,
    'Kochi': 7139,
    'Visakhapatnam': 18480,
    'Mangalore': 6000
  }
  return densities[city] || 10000
}
