"use client"

import { motion } from "framer-motion"
import { Shield, Users, TrendingUp, Globe, AlertTriangle, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const impactMetrics = [
  {
    title: "Lives Protected",
    value: "2.5M+",
    description: "People safeguarded through early warning systems",
    icon: Shield,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20"
  },
  {
    title: "Coastal Areas Monitored",
    value: "15,000km",
    description: "Coastline under continuous surveillance",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20"
  },
  {
    title: "Emergency Response Time",
    value: "< 2min",
    description: "Average alert delivery to authorities",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-900/20"
  },
  {
    title: "Prediction Accuracy",
    value: "99.8%",
    description: "Threat detection and forecasting precision",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20"
  },
  {
    title: "Active Organizations",
    value: "500+",
    description: "Government agencies and NGOs using our platform",
    icon: Users,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/20"
  },
  {
    title: "Monitoring Stations",
    value: "1,200+",
    description: "Real-time data collection points",
    icon: Activity,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
  }
]

export function ImpactMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Real-World Impact Metrics</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Measuring our platform's effectiveness in protecting coastal communities
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactMetrics.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${metric.bgColor} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
              >
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg ${metric.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {metric.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {metric.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {/* Additional impact summary */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Platform Impact Summary
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Our comprehensive coastal threat alert system has prevented over <strong>1,000 potential disasters</strong> and 
              saved an estimated <strong>$2.8 billion</strong> in infrastructure damage through early warning and proactive response measures.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
