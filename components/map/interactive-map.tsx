"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Waves, AlertTriangle, RefreshCw, Crosshair } from "lucide-react"
import { useGeolocation, type UserLocation } from "@/lib/geolocation"
import { useRealTimeData, type RealTimeAlert, type RealTimeCondition } from "@/lib/realtime-data"
import { cn } from "@/lib/utils"

interface MapMarker {
  id: string
  type: 'user' | 'alert' | 'condition'
  position: { lat: number; lng: number }
  title: string
  severity?: string
  data?: any
}

interface InteractiveMapProps {
  className?: string
  height?: string
}

export function InteractiveMap({ className, height = "h-96" }: InteractiveMapProps) {
  const { location: userLocation, loading: locationLoading, requestLocation } = useGeolocation()
  const { data: realTimeData, lastUpdate } = useRealTimeData()
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 13.0827, lng: 80.2707 }) // Chennai coast
  const [zoom, setZoom] = useState(10)
  const mapRef = useRef<HTMLDivElement>(null)

  // Update map center when user location is available
  useEffect(() => {
    if (userLocation) {
      setMapCenter({
        lat: userLocation.latitude,
        lng: userLocation.longitude
      })
      setZoom(12)
    }
  }, [userLocation])

  const markers: MapMarker[] = []

  // Add user location marker
  if (userLocation) {
    markers.push({
      id: 'user-location',
      type: 'user',
      position: { lat: userLocation.latitude, lng: userLocation.longitude },
      title: 'Your Location',
      data: userLocation
    })
  }

  // Add alert markers
  if (realTimeData?.alerts) {
    realTimeData.alerts.forEach((alert: RealTimeAlert) => {
      if (alert.coordinates) {
        markers.push({
          id: alert.id,
          type: 'alert',
          position: { lat: alert.coordinates.lat, lng: alert.coordinates.lng },
          title: alert.title,
          severity: alert.severity,
          data: alert
        })
      }
    })
  }

  // Add condition markers
  if (realTimeData?.conditions) {
    realTimeData.conditions.forEach((condition: RealTimeCondition) => {
      if (!condition.isUserLocation) {
        markers.push({
          id: condition.id,
          type: 'condition',
          position: { lat: condition.coordinates.lat, lng: condition.coordinates.lng },
          title: condition.location,
          data: condition
        })
      }
    })
  }

  const getMarkerIcon = (marker: MapMarker) => {
    switch (marker.type) {
      case 'user':
        return <Crosshair className="h-4 w-4 text-blue-600" />
      case 'alert':
        return <AlertTriangle className={cn(
          "h-4 w-4",
          marker.severity === 'critical' ? 'text-red-600' :
          marker.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
        )} />
      case 'condition':
        return <Waves className="h-4 w-4 text-blue-500" />
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />
    }
  }

  const getMarkerColor = (marker: MapMarker) => {
    switch (marker.type) {
      case 'user':
        return 'bg-blue-500 border-blue-600'
      case 'alert':
        return marker.severity === 'critical' ? 'bg-red-500 border-red-600' :
               marker.severity === 'high' ? 'bg-orange-500 border-orange-600' : 'bg-yellow-500 border-yellow-600'
      case 'condition':
        return 'bg-blue-400 border-blue-500'
      default:
        return 'bg-gray-400 border-gray-500'
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`
    }
    return `${distance.toFixed(1)}km`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Coastal Conditions Map
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                Updated {new Date(lastUpdate).toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={requestLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                <Navigation className="h-3 w-3" />
              )}
              {locationLoading ? 'Locating...' : 'My Location'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("relative bg-blue-50 rounded-lg border overflow-hidden", height)}>
          {/* Map Container */}
          <div ref={mapRef} className="w-full h-full relative">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200">
              {/* Grid lines to simulate map */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full border-t border-blue-300" style={{ top: `${i * 5}%` }} />
                ))}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full border-l border-blue-300" style={{ left: `${i * 5}%` }} />
                ))}
              </div>
              
              {/* Coastline representation */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-yellow-200 to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-green-200 to-transparent opacity-40" />
            </div>

            {/* Markers */}
            {markers.map((marker) => {
              // Calculate position on the simulated map
              const x = ((marker.position.lng - (mapCenter.lng - 0.1)) / 0.2) * 100
              const y = (1 - (marker.position.lat - (mapCenter.lat - 0.1)) / 0.2) * 100
              
              // Only show markers within visible area
              if (x < 0 || x > 100 || y < 0 || y > 100) return null

              return (
                <div
                  key={marker.id}
                  className={cn(
                    "absolute w-8 h-8 rounded-full border-2 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg hover:scale-110 transition-transform",
                    getMarkerColor(marker),
                    selectedMarker?.id === marker.id && "ring-2 ring-white ring-offset-2"
                  )}
                  style={{
                    left: `${Math.max(0, Math.min(100, x))}%`,
                    top: `${Math.max(0, Math.min(100, y))}%`
                  }}
                  onClick={() => setSelectedMarker(marker)}
                >
                  {getMarkerIcon(marker)}
                </div>
              )
            })}

            {/* Map Legend */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h4 className="text-sm font-medium mb-2">Map Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600" />
                  <span>Your Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600" />
                  <span>Critical Alert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500 border border-orange-600" />
                  <span>High Alert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400 border border-blue-500" />
                  <span>Monitoring Station</span>
                </div>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.min(16, zoom + 1))}
                className="rounded-b-none"
              >
                +
              </Button>
              <div className="border-t border-gray-200" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.max(8, zoom - 1))}
                className="rounded-t-none"
              >
                -
              </Button>
            </div>
          </div>

          {/* Marker Details Panel */}
          {selectedMarker && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getMarkerIcon(selectedMarker)}
                  <h4 className="font-medium">{selectedMarker.title}</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMarker(null)}
                >
                  ×
                </Button>
              </div>

              {selectedMarker.type === 'alert' && selectedMarker.data && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={selectedMarker.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {selectedMarker.severity?.toUpperCase()}
                    </Badge>
                    {userLocation && (
                      <span className="text-sm text-muted-foreground">
                        {formatDistance(calculateDistance(
                          userLocation.latitude,
                          userLocation.longitude,
                          selectedMarker.position.lat,
                          selectedMarker.position.lng
                        ))} away
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedMarker.data.description}</p>
                  <div className="text-xs text-muted-foreground">
                    Issued: {new Date(selectedMarker.data.timeIssued).toLocaleString()}
                  </div>
                </div>
              )}

              {selectedMarker.type === 'condition' && selectedMarker.data && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Sea Level: {selectedMarker.data.seaLevel}</div>
                    <div>Wind: {selectedMarker.data.windSpeed}</div>
                    <div>Visibility: {selectedMarker.data.visibility}</div>
                    <div>Safety: {selectedMarker.data.fishingSafety}</div>
                  </div>
                  {userLocation && (
                    <div className="text-xs text-muted-foreground">
                      {formatDistance(calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        selectedMarker.position.lat,
                        selectedMarker.position.lng
                      ))} from your location
                    </div>
                  )}
                </div>
              )}

              {selectedMarker.type === 'user' && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Your current position for real-time coastal monitoring
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Lat: {selectedMarker.position.lat.toFixed(6)}, 
                    Lng: {selectedMarker.position.lng.toFixed(6)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Accuracy: ±{selectedMarker.data.accuracy}m
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location Status */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {userLocation ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-green-700">Location tracking active</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="text-gray-600">Location not available</span>
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            {markers.length} location{markers.length !== 1 ? 's' : ''} shown
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
