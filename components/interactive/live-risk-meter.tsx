"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, TrendingUp, TrendingDown, Activity } from "lucide-react"

interface RiskData {
  level: number
  status: 'low' | 'moderate' | 'high' | 'severe'
  trend: 'up' | 'down' | 'stable'
  factors: string[]
}

export function LiveRiskMeter() {
  const [riskData, setRiskData] = useState<RiskData>({
    level: 65,
    status: 'high',
    trend: 'up',
    factors: ['Storm surge warning', 'High tide approaching', 'Strong winds']
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRiskData(prev => {
        const newLevel = Math.max(0, Math.min(100, prev.level + (Math.random() - 0.5) * 10))
        let status: RiskData['status'] = 'low'
        if (newLevel > 75) status = 'severe'
        else if (newLevel > 50) status = 'high'
        else if (newLevel > 25) status = 'moderate'
        
        return {
          ...prev,
          level: Math.round(newLevel),
          status,
          trend: Math.random() > 0.5 ? 'up' : 'down'
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskColor = (level: number) => {
    if (level > 75) return 'stroke-red-500'
    if (level > 50) return 'stroke-orange-500'
    if (level > 25) return 'stroke-yellow-500'
    return 'stroke-green-500'
  }

  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (riskData.level / 100) * circumference

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Risk Meter</h3>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
          <span className="text-sm text-gray-500 dark:text-gray-400">Live</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              className={getRiskColor(riskData.level)}
              style={{
                strokeDasharray,
                strokeDashoffset
              }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {riskData.level}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Risk Level</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(riskData.status)}`}>
            <AlertTriangle className="w-4 h-4 mr-1" />
            {riskData.status.toUpperCase()}
          </span>
          <div className="flex items-center space-x-1">
            {riskData.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {riskData.trend === 'up' ? 'Rising' : 'Falling'}
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Risk Factors</h4>
          <ul className="space-y-1">
            {riskData.factors.map((factor, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
