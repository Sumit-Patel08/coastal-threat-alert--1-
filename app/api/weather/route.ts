import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Mock weather API data - replace with real API like OpenWeatherMap
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'demo_key'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city') || 'Mumbai'
    
    const supabase = await createClient()

    // Simulate real weather API call
    const weatherData = await fetchWeatherData(city)
    
    // Store sensor data in Supabase
    await supabase.from('sensor_data').insert([
      {
        sensor_type: 'weather_station',
        location: `${city} Weather Station`,
        value: weatherData.windSpeed,
        unit: 'km/h',
        timestamp: new Date().toISOString()
      },
      {
        sensor_type: 'tide_gauge',
        location: `${city} Coast`,
        value: weatherData.seaLevel,
        unit: 'm',
        timestamp: new Date().toISOString()
      },
      {
        sensor_type: 'pollution_sensor',
        location: `${city} Harbor`,
        value: weatherData.pollutionLevel,
        unit: 'ppm',
        timestamp: new Date().toISOString()
      }
    ])

    return NextResponse.json({
      city,
      data: weatherData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}

async function fetchWeatherData(city: string) {
  // Simulate realistic weather data based on city with city-specific variations
  const cityVariations = {
    'Mumbai': { tempBase: 28, seaLevelBase: 1.8, pollutionBase: 120, windBase: 25 },
    'Chennai': { tempBase: 30, seaLevelBase: 1.5, pollutionBase: 95, windBase: 20 },
    'Kolkata': { tempBase: 32, seaLevelBase: 2.1, pollutionBase: 110, windBase: 18 },
    'Kochi': { tempBase: 26, seaLevelBase: 1.3, pollutionBase: 70, windBase: 15 },
    'Visakhapatnam': { tempBase: 29, seaLevelBase: 1.6, pollutionBase: 85, windBase: 22 },
    'Goa': { tempBase: 27, seaLevelBase: 1.4, pollutionBase: 60, windBase: 16 },
    'Mangalore': { tempBase: 28, seaLevelBase: 1.5, pollutionBase: 75, windBase: 18 },
    'Puducherry': { tempBase: 29, seaLevelBase: 1.4, pollutionBase: 80, windBase: 19 },
    'Thiruvananthapuram': { tempBase: 27, seaLevelBase: 1.2, pollutionBase: 65, windBase: 14 },
    'Bhubaneswar': { tempBase: 31, seaLevelBase: 1.7, pollutionBase: 90, windBase: 20 },
    'Surat': { tempBase: 33, seaLevelBase: 1.6, pollutionBase: 105, windBase: 23 },
    'Vadodara': { tempBase: 34, seaLevelBase: 1.5, pollutionBase: 95, windBase: 21 }
  }
  
  const cityData = cityVariations[city as keyof typeof cityVariations] || cityVariations['Mumbai']
  
  const weatherData = {
    temperature: cityData.tempBase + Math.random() * 8 - 4,
    humidity: 65 + Math.random() * 25,
    windSpeed: cityData.windBase + Math.random() * 15,
    seaLevel: cityData.seaLevelBase + Math.random() * 0.6 - 0.3,
    tideHeight: 0.8 + Math.random() * 1.5,
    pollutionIndex: Math.floor(cityData.pollutionBase + Math.random() * 40 - 20),
    visibility: 6 + Math.random() * 8,
    pollutionLevel: cityData.pollutionBase / 10 + Math.random() * 2
  }
  
  return weatherData
}
