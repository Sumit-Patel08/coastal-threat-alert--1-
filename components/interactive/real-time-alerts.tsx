"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, Clock, MapPin, Waves, Wind, Zap } from "lucide-react"

interface Alert {
  id: string
  type: 'flood' | 'storm' | 'erosion' | 'surge'
  severity: 'low' | 'moderate' | 'high' | 'severe'
  title: string
  message: string
  location: string
  timestamp: Date
  isNew: boolean
}

const alertIcons = {
  flood: Waves,
  storm: Wind,
  erosion: AlertTriangle,
  surge: Zap
}

const severityColors = {
  low: 'bg-blue-50 border-blue-200 text-blue-800',
  moderate: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  high: 'bg-orange-50 border-orange-200 text-orange-800',
  severe: 'bg-red-50 border-red-200 text-red-800'
}

export function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'surge',
      severity: 'high',
      title: 'Storm Surge Warning',
      message: 'High tide expected within 2 hours. Coastal flooding likely in low-lying areas.',
      location: 'Mumbai Coastline',
      timestamp: new Date(),
      isNew: true
    },
    {
      id: '2',
      type: 'flood',
      severity: 'moderate',
      title: 'Coastal Flood Advisory',
      message: 'Minor flooding possible during high tide. Monitor conditions closely.',
      location: 'Chennai Marina',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isNew: false
    }
  ])

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: ['flood', 'storm', 'erosion', 'surge'][Math.floor(Math.random() * 4)] as Alert['type'],
          severity: ['moderate', 'high', 'severe'][Math.floor(Math.random() * 3)] as Alert['severity'],
          title: 'New Coastal Alert',
          message: 'Monitoring conditions and will update as situation develops.',
          location: ['Goa Beach', 'Kerala Backwaters', 'Odisha Coast'][Math.floor(Math.random() * 3)],
          timestamp: new Date(),
          isNew: true
        }
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)])
        
        // Mark as not new after 5 seconds
        setTimeout(() => {
          setAlerts(prev => prev.map(alert => 
            alert.id === newAlert.id ? { ...alert, isNew: false } : alert
          ))
        }, 5000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-time Alerts</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {alerts.map((alert) => {
            const IconComponent = alertIcons[alert.type]
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.95 }}
                className={`relative p-4 rounded-lg border-l-4 ${severityColors[alert.severity]} ${
                  alert.isNew ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}
              >
                {alert.isNew && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
                  />
                )}
                
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>

                <div className="flex items-start space-x-3 pr-6">
                  <div className={`p-2 rounded-full ${
                    alert.severity === 'severe' ? 'bg-red-100' :
                    alert.severity === 'high' ? 'bg-orange-100' :
                    alert.severity === 'moderate' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      alert.severity === 'severe' ? 'text-red-600' :
                      alert.severity === 'high' ? 'text-orange-600' :
                      alert.severity === 'moderate' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {alert.title}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.severity === 'severe' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        alert.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {alert.message}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
          </div>
        )}
      </div>
    </div>
  )
}
