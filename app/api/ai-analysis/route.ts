import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json()
    const supabase = await createClient()

    // Fetch latest sensor data for the city
    const { data: sensorData } = await supabase
      .from('sensor_data')
      .select('*')
      .ilike('location', `%${city}%`)
      .order('timestamp', { ascending: false })
      .limit(10)

    if (!sensorData || sensorData.length === 0) {
      return NextResponse.json({ error: 'No sensor data available for this city' }, { status: 404 })
    }

    // AI Analysis Logic
    const analysis = await performAIAnalysis(sensorData, city)
    
    // Auto-generate risk assessment
    const riskAssessment = await generateRiskAssessment(analysis, city, supabase)
    
    // Auto-generate alerts if needed
    const alerts = await generateAlerts(analysis, city, supabase)

    return NextResponse.json({
      city,
      analysis,
      riskAssessment,
      alerts,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Analysis error:', error)
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 })
  }
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
