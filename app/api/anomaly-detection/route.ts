import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Fetch recent sensor data for anomaly detection
    const { data: sensorData } = await supabase
      .from('sensor_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100)

    if (!sensorData || sensorData.length === 0) {
      return NextResponse.json({ message: 'No sensor data available' }, { status: 200 })
    }

    const anomalies = []

    // Simple anomaly detection logic
    for (const sensor of sensorData) {
      let isAnomaly = false
      let alertTriggered = false
      let confidenceScore = 0

      // Define thresholds for different sensor types
      switch (sensor.sensor_type) {
        case 'tide_gauge':
          if (sensor.value > 2.5) {
            isAnomaly = true
            confidenceScore = Math.min((sensor.value - 2.5) / 1.0, 1.0)
            alertTriggered = sensor.value > 3.0
          }
          break
        case 'weather_station':
          if (sensor.value > 50) {
            isAnomaly = true
            confidenceScore = Math.min((sensor.value - 50) / 30, 1.0)
            alertTriggered = sensor.value > 70
          }
          break
        case 'pollution_sensor':
          if (sensor.value > 10) {
            isAnomaly = true
            confidenceScore = Math.min((sensor.value - 10) / 5, 1.0)
            alertTriggered = sensor.value > 15
          }
          break
      }

      if (isAnomaly) {
        // Record anomaly
        const { data: anomaly } = await supabase
          .from('anomaly_detections')
          .insert({
            source_table: 'sensor_data',
            source_id: sensor.id,
            anomaly_type: `${sensor.sensor_type}_threshold_exceeded`,
            confidence_score: confidenceScore,
            threshold_exceeded: true,
            alert_triggered: alertTriggered,
            details: {
              sensor_type: sensor.sensor_type,
              location: sensor.location,
              value: sensor.value,
              unit: sensor.unit,
              threshold_type: 'upper_limit'
            }
          })
          .select()
          .single()

        anomalies.push(anomaly)

        // Auto-generate alert if threshold severely exceeded
        if (alertTriggered) {
          const alertType = sensor.sensor_type === 'tide_gauge' ? 'Storm Surge' :
                           sensor.sensor_type === 'weather_station' ? 'High Winds' :
                           'Pollution'
          
          const severity = sensor.value > (sensor.sensor_type === 'tide_gauge' ? 3.5 :
                                         sensor.sensor_type === 'weather_station' ? 80 : 20) ? 'Critical' : 'High'

          await supabase
            .from('alert_logs')
            .insert({
              type: alertType,
              severity: severity,
              location: sensor.location,
              description: `Automated alert: ${sensor.sensor_type} reading of ${sensor.value}${sensor.unit} exceeds critical threshold`,
              source: 'Sensor'
            })
        }
      }
    }

    return NextResponse.json({ 
      message: 'Anomaly detection completed',
      anomalies_detected: anomalies.length,
      alerts_triggered: anomalies.filter(a => a.alert_triggered).length
    })

  } catch (error) {
    console.error('Anomaly detection error:', error)
    return NextResponse.json({ error: 'Anomaly detection failed' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: anomalies } = await supabase
      .from('anomaly_detections')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    return NextResponse.json({ anomalies })
  } catch (error) {
    console.error('Error fetching anomalies:', error)
    return NextResponse.json({ error: 'Failed to fetch anomalies' }, { status: 500 })
  }
}
