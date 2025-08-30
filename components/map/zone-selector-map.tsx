"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Globe, Target, Layers } from "lucide-react"
import { coastalZones, languageNames } from "@/lib/message-templates"
import { Language } from "@/lib/civil-defence-types"

interface ZoneSelectorMapProps {
  selectedZones: string[]
  onZoneToggle: (zoneId: string) => void
  className?: string
}

export function ZoneSelectorMap({ selectedZones, onZoneToggle, className }: ZoneSelectorMapProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }) // India center
  const [zoom, setZoom] = useState(5)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Calculate zone position on the simulated map
  const getZonePosition = (zoneId: string) => {
    const zone = coastalZones.find(z => z.id === zoneId)
    if (!zone || zone.coordinates.length === 0) return { x: 50, y: 50 }

    // Use first coordinate as representative point
    const coord = zone.coordinates[0]
    
    // Convert lat/lng to map percentage (simplified projection)
    const x = ((coord.lng - 68) / (97 - 68)) * 100 // India longitude range
    const y = (1 - (coord.lat - 8) / (37 - 8)) * 100 // India latitude range (inverted for screen coords)
    
    return { 
      x: Math.max(5, Math.min(95, x)), 
      y: Math.max(5, Math.min(95, y)) 
    }
  }

  // Get zone color based on selection and population
  const getZoneColor = (zoneId: string) => {
    const zone = coastalZones.find(z => z.id === zoneId)
    const isSelected = selectedZones.includes(zoneId)
    const isHovered = hoveredZone === zoneId
    
    if (isSelected) {
      return 'bg-red-500 border-red-600 shadow-lg'
    } else if (isHovered) {
      return 'bg-blue-400 border-blue-500 shadow-md'
    } else {
      // Color by population density
      const population = zone?.population || 0
      if (population > 2000000) return 'bg-orange-400 border-orange-500'
      if (population > 1000000) return 'bg-yellow-400 border-yellow-500'
      return 'bg-green-400 border-green-500'
    }
  }

  // Get zone size based on population
  const getZoneSize = (zoneId: string) => {
    const zone = coastalZones.find(z => z.id === zoneId)
    const population = zone?.population || 0
    
    if (population > 2000000) return 'w-6 h-6'
    if (population > 1000000) return 'w-5 h-5'
    return 'w-4 h-4'
  }

  // Calculate total selected population
  const getTotalSelectedPopulation = () => {
    return selectedZones.reduce((total, zoneId) => {
      const zone = coastalZones.find(z => z.id === zoneId)
      return total + (zone?.population || 0)
    }, 0)
  }

  // Get unique languages from selected zones
  const getSelectedLanguages = (): Language[] => {
    const languages = new Set<Language>()
    selectedZones.forEach(zoneId => {
      const zone = coastalZones.find(z => z.id === zoneId)
      zone?.primaryLanguages.forEach(lang => languages.add(lang))
    })
    return Array.from(languages)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Coastal Zone Targeting
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {selectedZones.length} zone{selectedZones.length !== 1 ? 's' : ''} selected
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Container */}
          <div className="relative bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border h-96 overflow-hidden">
            <div ref={mapRef} className="w-full h-full relative">
              {/* Simulated India coastline */}
              <div className="absolute inset-0">
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-20">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full border-t border-blue-300" style={{ top: `${i * 5}%` }} />
                  ))}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full border-l border-blue-300" style={{ left: `${i * 5}%` }} />
                  ))}
                </div>
                
                {/* Simulated coastline */}
                <div className="absolute inset-0">
                  {/* West coast */}
                  <div className="absolute left-[15%] top-[20%] w-1 h-[60%] bg-yellow-300 opacity-60 rounded"></div>
                  {/* East coast */}
                  <div className="absolute right-[25%] top-[15%] w-1 h-[70%] bg-yellow-300 opacity-60 rounded"></div>
                  {/* Southern tip */}
                  <div className="absolute left-[20%] bottom-[15%] w-[25%] h-1 bg-yellow-300 opacity-60 rounded"></div>
                </div>

                {/* Coastal zones */}
                {coastalZones.map((zone) => {
                  const position = getZonePosition(zone.id)
                  const isSelected = selectedZones.includes(zone.id)
                  const isHovered = hoveredZone === zone.id
                  
                  return (
                    <div key={zone.id} className="absolute">
                      {/* Zone marker */}
                      <div
                        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-200 hover:scale-110 ${getZoneSize(zone.id)} ${getZoneColor(zone.id)}`}
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}%`
                        }}
                        onClick={() => onZoneToggle(zone.id)}
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Target className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Zone radius indicator for selected zones */}
                      {isSelected && (
                        <div
                          className="absolute border-2 border-red-400 rounded-full opacity-30 pointer-events-none"
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            width: `${zone.radius / 2}px`,
                            height: `${zone.radius / 2}px`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      )}

                      {/* Zone tooltip */}
                      {(isHovered || isSelected) && (
                        <div
                          className="absolute z-10 bg-white border rounded-lg shadow-lg p-3 min-w-64 pointer-events-none"
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: position.y > 70 ? 'translate(-50%, -120%)' : 'translate(-50%, 20px)'
                          }}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">{zone.name}</h4>
                              <Badge variant={isSelected ? "default" : "outline"} className="text-xs">
                                {isSelected ? "Selected" : "Available"}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{zone.state}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{zone.population.toLocaleString()} people</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                <span>{zone.primaryLanguages.length} language{zone.primaryLanguages.length !== 1 ? 's' : ''}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {zone.primaryLanguages.slice(0, 3).map(lang => (
                                <Badge key={lang} variant="outline" className="text-xs">
                                  {languageNames[lang]}
                                </Badge>
                              ))}
                              {zone.primaryLanguages.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{zone.primaryLanguages.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h4 className="text-sm font-medium mb-2">Population Legend</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400 border border-orange-500" />
                  <span>&gt;2M people</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500" />
                  <span>1M-2M people</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500" />
                  <span>&lt;1M people</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-red-600" />
                  <span>Selected</span>
                </div>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.min(10, zoom + 1))}
                className="rounded-b-none"
              >
                +
              </Button>
              <div className="border-t border-gray-200" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoom(Math.max(3, zoom - 1))}
                className="rounded-t-none"
              >
                -
              </Button>
            </div>
          </div>

          {/* Selection Summary */}
          {selectedZones.length > 0 && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Zones</p>
                      <p className="text-2xl font-bold">{selectedZones.length}</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Population</p>
                      <p className="text-2xl font-bold">{getTotalSelectedPopulation().toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Languages</p>
                      <p className="text-2xl font-bold">{getSelectedLanguages().length}</p>
                    </div>
                    <Globe className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Selected Languages */}
          {selectedZones.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recommended Languages for Selected Zones:</h4>
              <div className="flex flex-wrap gap-2">
                {getSelectedLanguages().map(lang => (
                  <Badge key={lang} variant="secondary">
                    {languageNames[lang]}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => coastalZones.forEach(zone => onZoneToggle(zone.id))}
            >
              <Layers className="h-4 w-4 mr-2" />
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => selectedZones.forEach(zoneId => onZoneToggle(zoneId))}
              disabled={selectedZones.length === 0}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
