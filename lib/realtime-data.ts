"use client"

import { mockAlerts, mockCoastalConditions, type Alert, type CoastalCondition } from './mock-data'
import { GeolocationService, type UserLocation } from './geolocation'

export interface RealTimeAlert extends Alert {
  distance?: number
  isNearby: boolean
  urgencyLevel: 'immediate' | 'high' | 'medium' | 'low'
}

export interface RealTimeCondition extends CoastalCondition {
  distance?: number
  isUserLocation: boolean
}

export interface WeatherData {
  temperature: number
  windSpeed: number
  windDirection: string
  humidity: number
  pressure: number
  visibility: number
  waveHeight: number
  seaTemperature: number
  uvIndex: number
  lastUpdated: string
}

export class RealTimeDataService {
  private static instance: RealTimeDataService
  private subscribers: Set<(data: any) => void> = new Set()
  private updateInterval: NodeJS.Timeout | null = null
  private geoService: GeolocationService

  constructor() {
    this.geoService = GeolocationService.getInstance()
  }

  static getInstance(): RealTimeDataService {
    if (!RealTimeDataService.instance) {
      RealTimeDataService.instance = new RealTimeDataService()
    }
    return RealTimeDataService.instance
  }

  startRealTimeUpdates(): void {
    if (this.updateInterval) return

    // Update every 30 seconds for demo purposes
    this.updateInterval = setInterval(() => {
      this.broadcastUpdate()
    }, 30000)

    // Initial broadcast
    this.broadcastUpdate()
  }

  stopRealTimeUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  getLocationBasedAlerts(userLocation?: UserLocation): RealTimeAlert[] {
    const alerts = [...mockAlerts]
    
    // Add some dynamic alerts based on time and location
    const now = new Date()
    const dynamicAlerts = this.generateDynamicAlerts(now, userLocation)
    alerts.push(...dynamicAlerts)

    return alerts.map(alert => {
      const realTimeAlert: RealTimeAlert = {
        ...alert,
        isNearby: false,
        urgencyLevel: this.calculateUrgencyLevel(alert, userLocation)
      }

      if (userLocation && alert.coordinates) {
        const distance = this.geoService.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          alert.coordinates.lat,
          alert.coordinates.lng
        )
        realTimeAlert.distance = distance
        realTimeAlert.isNearby = distance <= 25 // Within 25km
      }

      return realTimeAlert
    }).sort((a, b) => {
      // Sort by urgency and proximity
      const urgencyOrder = { immediate: 0, high: 1, medium: 2, low: 3 }
      if (urgencyOrder[a.urgencyLevel] !== urgencyOrder[b.urgencyLevel]) {
        return urgencyOrder[a.urgencyLevel] - urgencyOrder[b.urgencyLevel]
      }
      return (a.distance || Infinity) - (b.distance || Infinity)
    })
  }

  getLocationBasedConditions(userLocation?: UserLocation): RealTimeCondition[] {
    const conditions = [...mockCoastalConditions]
    
    // Add user's current location condition if available
    if (userLocation) {
      const userCondition = this.generateUserLocationCondition(userLocation)
      conditions.unshift(userCondition)
    }

    return conditions.map(condition => {
      const realTimeCondition: RealTimeCondition = {
        ...condition,
        isUserLocation: false
      }

      if (userLocation) {
        const distance = this.geoService.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          condition.coordinates.lat,
          condition.coordinates.lng
        )
        realTimeCondition.distance = distance
        realTimeCondition.isUserLocation = distance < 1 // Within 1km
      }

      return realTimeCondition
    }).sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))
  }

  getCurrentWeatherData(userLocation?: UserLocation): WeatherData {
    // Simulate real-time weather data with some randomization
    const baseTemp = 28
    const tempVariation = (Math.random() - 0.5) * 4
    
    return {
      temperature: Math.round((baseTemp + tempVariation) * 10) / 10,
      windSpeed: Math.round((15 + Math.random() * 10) * 10) / 10,
      windDirection: this.getRandomWindDirection(),
      humidity: Math.round(65 + Math.random() * 20),
      pressure: Math.round(1013 + (Math.random() - 0.5) * 20),
      visibility: Math.round((8 + Math.random() * 7) * 10) / 10,
      waveHeight: Math.round((0.5 + Math.random() * 1.5) * 10) / 10,
      seaTemperature: Math.round((26 + Math.random() * 3) * 10) / 10,
      uvIndex: Math.round(6 + Math.random() * 4),
      lastUpdated: new Date().toISOString()
    }
  }

  private generateDynamicAlerts(currentTime: Date, userLocation?: UserLocation): Alert[] {
    const alerts: Alert[] = []
    const hour = currentTime.getHours()

    // Generate time-based alerts
    if (hour >= 18 || hour <= 6) {
      alerts.push({
        id: `dynamic-night-${Date.now()}`,
        title: "Night Fishing Advisory",
        severity: "low",
        location: "All Coastal Areas",
        coordinates: userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : undefined,
        timeIssued: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        lastUpdate: new Date().toISOString(),
        description: "Reduced visibility during night hours. Extra caution advised for fishing activities.",
        safetyActions: [
          "Use proper navigation lights",
          "Carry emergency flares",
          "Inform someone of your fishing plans",
          "Stay close to familiar waters"
        ],
        category: "weather",
        status: "active"
      })
    }

    // Simulate tidal alerts
    if (Math.random() > 0.7) {
      alerts.push({
        id: `dynamic-tide-${Date.now()}`,
        title: "High Tide Alert",
        severity: "high",
        location: "Coastal Areas",
        coordinates: { lat: 13.0827, lng: 80.2707 },
        timeIssued: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        lastUpdate: new Date().toISOString(),
        description: "Exceptionally high tide expected in the next 2 hours. Coastal flooding possible.",
        safetyActions: [
          "Move to higher ground",
          "Secure boats and equipment",
          "Avoid low-lying coastal areas",
          "Monitor tide schedules"
        ],
        category: "sea-level",
        status: "active"
      })
    }

    return alerts
  }

  private generateUserLocationCondition(userLocation: UserLocation): CoastalCondition {
    const weather = this.getCurrentWeatherData(userLocation)
    
    return {
      id: `user-location-${Date.now()}`,
      location: "Your Current Location",
      coordinates: { lat: userLocation.latitude, lng: userLocation.longitude },
      seaLevel: Math.random() > 0.7 ? "high" : "normal",
      windSpeed: `${weather.windSpeed} km/h`,
      visibility: weather.visibility > 8 ? "excellent" : weather.visibility > 5 ? "good" : weather.visibility > 3 ? "moderate" : "poor",
      fishingSafety: this.calculateFishingSafety(weather),
      temperature: `${weather.temperature}°C`,
      waveHeight: `${weather.waveHeight}m`,
      currentStrength: weather.windSpeed > 25 ? "strong" : weather.windSpeed > 15 ? "moderate" : "weak",
      lastUpdated: new Date().toISOString()
    }
  }

  private calculateFishingSafety(weather: WeatherData): "safe" | "caution" | "unsafe" {
    if (weather.windSpeed > 30 || weather.waveHeight > 2 || weather.visibility < 3) {
      return "unsafe"
    }
    if (weather.windSpeed > 20 || weather.waveHeight > 1.5 || weather.visibility < 5) {
      return "caution"
    }
    return "safe"
  }

  private calculateUrgencyLevel(alert: Alert, userLocation?: UserLocation): 'immediate' | 'high' | 'medium' | 'low' {
    let urgency: 'immediate' | 'high' | 'medium' | 'low' = 'low'

    // Base urgency on severity
    if (alert.severity === 'critical') urgency = 'immediate'
    else if (alert.severity === 'high') urgency = 'high'
    else urgency = 'medium'

    // Increase urgency if user is nearby
    if (userLocation && alert.coordinates) {
      const distance = this.geoService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        alert.coordinates.lat,
        alert.coordinates.lng
      )
      
      if (distance <= 5) {
        urgency = urgency === 'low' ? 'medium' : urgency === 'medium' ? 'high' : 'immediate'
      } else if (distance <= 15) {
        urgency = urgency === 'low' ? 'medium' : urgency
      }
    }

    return urgency
  }

  private getRandomWindDirection(): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    return directions[Math.floor(Math.random() * directions.length)]
  }

  private broadcastUpdate(): void {
    const userLocation = this.geoService.getLastKnownLocation()
    const data = {
      alerts: this.getLocationBasedAlerts(userLocation),
      conditions: this.getLocationBasedConditions(userLocation),
      weather: this.getCurrentWeatherData(userLocation),
      timestamp: new Date().toISOString()
    }

    this.subscribers.forEach(callback => callback(data))
  }
}

// React hook for real-time data
export function useRealTimeData() {
  const [data, setData] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const service = RealTimeDataService.getInstance()
    
    const unsubscribe = service.subscribe((newData) => {
      setData(newData)
      setLastUpdate(new Date())
    })

    service.startRealTimeUpdates()

    return () => {
      unsubscribe()
      service.stopRealTimeUpdates()
    }
  }, [])

  return {
    data,
    lastUpdate,
    isConnected: data !== null
  }
}

// Add missing import
import { useState, useEffect } from 'react'
