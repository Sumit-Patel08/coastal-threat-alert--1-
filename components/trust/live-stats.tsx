"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, Shield, Activity, Globe, AlertTriangle } from "lucide-react"

interface StatItem {
  id: string
  label: string
  value: number
  suffix: string
  icon: React.ComponentType<any>
  trend: number
  color: string
}

export function LiveStats() {
  const [stats, setStats] = useState<StatItem[]>([
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: 23,
      suffix: '',
      icon: AlertTriangle,
      trend: 12,
      color: 'text-red-500'
    },
    {
      id: 'protected',
      label: 'People Protected',
      value: 50234567,
      suffix: '',
      icon: Shield,
      trend: 8.5,
      color: 'text-green-500'
    },
    {
      id: 'monitoring',
      label: 'Monitoring Stations',
      value: 1247,
      suffix: '',
      icon: Activity,
      trend: 3.2,
      color: 'text-blue-500'
    },
    {
      id: 'coverage',
      label: 'Coastal Coverage',
      value: 98.7,
      suffix: '%',
      icon: Globe,
      trend: 1.8,
      color: 'text-purple-500'
    },
    {
      id: 'organizations',
      label: 'Partner Organizations',
      value: 542,
      suffix: '',
      icon: Users,
      trend: 15.3,
      color: 'text-orange-500'
    },
    {
      id: 'accuracy',
      label: 'Prediction Accuracy',
      value: 99.8,
      suffix: '%',
      icon: TrendingUp,
      trend: 0.5,
      color: 'text-cyan-500'
    }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          const change = (Math.random() - 0.5) * 0.1
          let newValue = stat.value + change
          
          // Keep values within realistic bounds
          if (stat.id === 'accuracy' || stat.id === 'coverage') {
            newValue = Math.max(95, Math.min(100, newValue))
          } else if (stat.id === 'alerts') {
            newValue = Math.max(0, Math.min(50, newValue))
          } else {
            newValue = Math.max(0, newValue)
          }
          
          return {
            ...stat,
            value: parseFloat(newValue.toFixed(stat.suffix === '%' ? 1 : 0)),
            trend: parseFloat((Math.random() * 20 - 5).toFixed(1))
          }
        })
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Live System Statistics
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time metrics showing our platform's impact on coastal safety and environmental protection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Live</span>
                  </div>
                </div>

                <div className="mb-2">
                  <motion.div
                    key={stat.value}
                    initial={{ scale: 1.1, color: '#3B82F6' }}
                    animate={{ scale: 1, color: 'inherit' }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                  >
                    {formatNumber(stat.value)}{stat.suffix}
                  </motion.div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${stat.trend < 0 ? 'rotate-180' : ''}`} />
                    <span>{Math.abs(stat.trend)}%</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    vs last hour
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Additional metrics bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Monitoring</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">&lt; 2min</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Alert Response</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15+</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">5+ Years</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Uptime Record</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
