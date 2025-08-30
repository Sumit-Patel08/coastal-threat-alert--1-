"use client"

import { motion } from "framer-motion"
import { LiveRiskMeter } from "@/components/interactive/live-risk-meter"
import { RealTimeAlerts } from "@/components/interactive/real-time-alerts"
import { InteractiveMap } from "@/components/interactive/interactive-map"

export function InteractiveFeatures() {
  return (
    <section id="interactive" className="py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Interactive Monitoring Dashboard
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Real-time coastal risk monitoring with live data visualization, interactive maps, and instant alerts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <LiveRiskMeter />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <RealTimeAlerts />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <InteractiveMap />
        </motion.div>
      </div>
    </section>
  )
}
