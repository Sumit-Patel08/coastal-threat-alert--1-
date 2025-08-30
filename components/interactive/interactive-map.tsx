"use client"

import { useState, useEffect } from "react"
import { MapPin, Layers, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Waves, Wind } from "lucide-react"

interface RiskZone {
  id: string
  type: 'flood' | 'erosion' | 'surge'
  severity: 'low' | 'moderate' | 'high' | 'severe'
  coordinates: { x: number; y: number }
  radius: number
  name: string
  description: string
}

const riskZones: RiskZone[] = [
  {
    id: '1',
    type: 'surge',
    severity: 'severe',
    coordinates: { x: 45, y: 30 },
    radius: 25,
    name: 'Mumbai Harbor',
    description: 'High storm surge risk during monsoon season'
  },
  {
    id: '2',
    type: 'flood',
    severity: 'high',
    coordinates: { x: 70, y: 60 },
    radius: 20,
    name: 'Chennai Marina',
    description: 'Coastal flooding during high tides'
  },
  {
    id: '3',
    type: 'erosion',
    severity: 'moderate',
    coordinates: { x: 25, y: 75 },
    radius: 15,
    name: 'Kerala Backwaters',
    description: 'Gradual shoreline erosion'
  }
]

export function InteractiveMap() {
  const [selectedZone, setSelectedZone] = useState<RiskZone | null>(null)
  const [mapLayer, setMapLayer] = useState<'satellite' | 'risk' | 'elevation'>('risk')
  const [zoom, setZoom] = useState(1)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (severity: string, type: string) => {
    const colors = {
      severe: type === 'surge' ? 'fill-red-500/70' : type === 'flood' ? 'fill-blue-500/70' : 'fill-orange-500/70',
      high: type === 'surge' ? 'fill-red-400/60' : type === 'flood' ? 'fill-blue-400/60' : 'fill-orange-400/60',
      moderate: type === 'surge' ? 'fill-red-300/50' : type === 'flood' ? 'fill-blue-300/50' : 'fill-orange-300/50',
      low: type === 'surge' ? 'fill-red-200/40' : type === 'flood' ? 'fill-blue-200/40' : 'fill-orange-200/40'
    }
    return colors[severity as keyof typeof colors]
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'surge': return Waves
      case 'flood': return Waves
      case 'erosion': return Wind
      default: return AlertTriangle
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Map Controls */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interactive Risk Map</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setMapLayer('satellite')}
                className={`px-3 py-1 text-xs rounded ${
                  mapLayer === 'satellite' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapLayer('risk')}
                className={`px-3 py-1 text-xs rounded ${
                  mapLayer === 'risk' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Risk
              </button>
              <button
                onClick={() => setMapLayer('elevation')}
                className={`px-3 py-1 text-xs rounded ${
                  mapLayer === 'elevation' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Elevation
              </button>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoom(Math.min(2, zoom + 0.2))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/20 dark:to-green-900/20 overflow-hidden">
        {/* Background Map */}
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Coastline */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <path
              d="M10,20 Q30,15 50,25 T90,30 L90,100 L10,100 Z"
              fill="rgba(59, 130, 246, 0.1)"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="0.5"
            />
            <path
              d="M10,20 Q30,15 50,25 T90,30"
              fill="none"
              stroke="rgba(34, 197, 94, 0.6)"
              strokeWidth="1"
            />
          </svg>

          {/* Risk Zones */}
          {riskZones.map((zone) => {
            const IconComponent = getIconForType(zone.type)
            return (
              <div
                key={zone.id}
                className="absolute cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200"
                style={{
                  left: `${zone.coordinates.x}%`,
                  top: `${zone.coordinates.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedZone(zone)}
              >
                {/* Risk Zone Circle */}
                <div
                  className={`absolute inset-0 rounded-full border-2 ${
                    zone.severity === 'severe' ? 'border-red-500' :
                    zone.severity === 'high' ? 'border-orange-500' :
                    zone.severity === 'moderate' ? 'border-yellow-500' : 'border-blue-500'
                  } ${isAnimating ? 'animate-pulse' : ''}`}
                  style={{
                    width: `${zone.radius * 2}px`,
                    height: `${zone.radius * 2}px`,
                    marginLeft: `-${zone.radius}px`,
                    marginTop: `-${zone.radius}px`,
                    opacity: isAnimating ? '0.5' : '0.3'
                  }}
                />
                
                {/* Zone Icon */}
                <div className={`relative z-10 p-2 rounded-full shadow-lg ${
                  zone.severity === 'severe' ? 'bg-red-500' :
                  zone.severity === 'high' ? 'bg-orange-500' :
                  zone.severity === 'moderate' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}>
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
              </div>
            )
          })}

          {/* Live Data Points */}
          <div
            className="absolute animate-pulse"
            style={{ left: '60%', top: '40%' }}
          >
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
          </div>
          <div
            className="absolute animate-pulse"
            style={{ left: '35%', top: '55%', animationDelay: '0.5s' }}
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Risk Levels</h4>
          <div className="space-y-1">
            {[
              { level: 'Severe', color: 'bg-red-500' },
              { level: 'High', color: 'bg-orange-500' },
              { level: 'Moderate', color: 'bg-yellow-500' },
              { level: 'Low', color: 'bg-blue-500' }
            ].map((item) => (
              <div key={item.level} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="text-xs text-gray-600 dark:text-gray-300">{item.level}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Zone Info */}
        {selectedZone && (
          <div
            className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs animate-in slide-in-from-top-2 fade-in duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">{selectedZone.name}</h4>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {selectedZone.description}
            </p>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                selectedZone.severity === 'severe' ? 'bg-red-100 text-red-800' :
                selectedZone.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                selectedZone.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {selectedZone.severity.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {selectedZone.type} risk
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
