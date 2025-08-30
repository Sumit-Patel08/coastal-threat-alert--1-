"use client"

export interface UserLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export interface LocationError {
  code: number
  message: string
}

export class GeolocationService {
  private static instance: GeolocationService
  private currentLocation: UserLocation | null = null
  private watchId: number | null = null
  private callbacks: Set<(location: UserLocation | null) => void> = new Set()

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService()
    }
    return GeolocationService.instance
  }

  getCurrentLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          }
          this.currentLocation = location
          this.notifyCallbacks(location)
          resolve(location)
        },
        (error) => {
          reject(this.handleGeolocationError(error))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  startWatching(): void {
    if (!navigator.geolocation || this.watchId !== null) {
      return
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        }
        this.currentLocation = location
        this.notifyCallbacks(location)
      },
      (error) => {
        const errorInfo = this.handleGeolocationError(error)
        console.error('Geolocation error:', errorInfo)
        this.notifyCallbacks(null)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000 // 1 minute
      }
    )
  }

  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId)
      this.watchId = null
    }
  }

  subscribe(callback: (location: UserLocation | null) => void): () => void {
    this.callbacks.add(callback)
    
    // Immediately call with current location if available
    if (this.currentLocation) {
      callback(this.currentLocation)
    }

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback)
    }
  }

  getLastKnownLocation(): UserLocation | null {
    return this.currentLocation
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  isNearCoast(location: UserLocation, coastalRadius: number = 50): boolean {
    // Chennai coast coordinates for reference
    const chennaiCoast = { lat: 13.0827, lng: 80.2707 }
    const distance = this.calculateDistance(
      location.latitude,
      location.longitude,
      chennaiCoast.lat,
      chennaiCoast.lng
    )
    return distance <= coastalRadius
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private handleGeolocationError(error: GeolocationPositionError): LocationError {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return {
          code: error.code,
          message: 'Location access denied by user'
        }
      case error.POSITION_UNAVAILABLE:
        return {
          code: error.code,
          message: 'Location information unavailable'
        }
      case error.TIMEOUT:
        return {
          code: error.code,
          message: 'Location request timed out'
        }
      default:
        return {
          code: error.code,
          message: 'Unknown location error'
        }
    }
  }

  private notifyCallbacks(location: UserLocation | null): void {
    this.callbacks.forEach(callback => callback(location))
  }
}

// Hook for React components
export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [error, setError] = useState<LocationError | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const geoService = GeolocationService.getInstance()
    
    const unsubscribe = geoService.subscribe((newLocation) => {
      setLocation(newLocation)
      setLoading(false)
    })

    // Start watching location
    setLoading(true)
    geoService.startWatching()

    return () => {
      unsubscribe()
      geoService.stopWatching()
    }
  }, [])

  const requestLocation = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const geoService = GeolocationService.getInstance()
      const newLocation = await geoService.getCurrentLocation()
      setLocation(newLocation)
    } catch (err) {
      setError(err as LocationError)
    } finally {
      setLoading(false)
    }
  }

  return {
    location,
    error,
    loading,
    requestLocation
  }
}

// Add missing import
import { useState, useEffect } from 'react'
