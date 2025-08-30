"use client"

import { motion } from "framer-motion"
import { Shield, AlertTriangle, Map, Bell, BarChart3, Users, CloudRain } from "lucide-react"

const features = [
  {
    name: 'Real-time Alerts',
    description: 'Instant notifications for coastal threats and emergencies with detailed severity levels and recommended actions.',
    icon: Bell,
  },
  {
    name: 'Risk Assessment',
    description: 'AI-powered analysis of coastal conditions to predict and assess potential threats before they escalate.',
    icon: AlertTriangle,
  },
  {
    name: 'Interactive Map',
    description: 'Visual representation of risk zones, weather patterns, and emergency resources in your area.',
    icon: Map,
  },
  {
    name: 'Community Dashboard',
    description: 'Connect with local authorities and community members to coordinate responses and share information.',
    icon: Users,
  },
  {
    name: 'Weather Integration',
    description: 'Real-time weather data integration for accurate forecasting and early warning systems.',
    icon: CloudRain,
  },
  {
    name: 'Analytics & Reports',
    description: 'Comprehensive analytics and reporting tools for tracking trends and improving response strategies.',
    icon: BarChart3,
  },
]

export function Features() {
  return (
    <section id="features" className="relative bg-white py-24 dark:bg-gray-900 sm:py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-1/2 top-0 h-1/2 w-1/2 bg-gradient-to-tr from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50" />
        <div className="absolute -left-1/2 bottom-0 h-1/2 w-1/2 bg-gradient-to-tl from-emerald-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/50" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          >
            <Shield className="mr-2 h-4 w-4" />
            Protect What Matters
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            Comprehensive Coastal Protection
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
          >
            Our platform integrates cutting-edge technology with community-focused features to provide 
            complete protection against coastal threats.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (index % 3) }}
                className="group relative rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md dark:bg-gray-800/50 dark:ring-white/10"
              >
                <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-900/20 dark:to-cyan-900/20" />
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
