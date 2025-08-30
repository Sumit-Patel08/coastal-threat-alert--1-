"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 py-24 text-white">
      <div className="absolute inset-0 bg-[url('/public/coastal-wave-pattern.svg')] opacity-10" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              About Coastal Threat Alert System
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              A comprehensive platform designed to protect coastal communities through advanced monitoring, early warning systems, and collaborative response coordination.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4">What We Do</h3>
              <p className="text-blue-100 leading-relaxed">
                Our platform integrates real-time coastal monitoring, AI-powered threat prediction, and multi-stakeholder coordination to provide comprehensive coastal protection. We connect government agencies, NGOs, disaster management teams, and local communities in a unified response network.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <p className="text-blue-100 leading-relaxed">
                Through advanced sensors, satellite data, and machine learning algorithms, we continuously monitor coastal conditions. When threats are detected, our system instantly alerts all relevant stakeholders through specialized dashboards, enabling rapid, coordinated response to protect lives and property.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center"
          >
            <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
            <p className="text-blue-100 text-lg leading-relaxed mb-6">
              To create a safer, more resilient coastal future by providing communities with the tools, information, and coordination capabilities needed to anticipate, prepare for, and respond to coastal threats while preserving vital marine ecosystems.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div>
                <div className="text-3xl font-bold mb-2">Regular</div>
                <div className="text-blue-200">Monitoring</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">5+</div>
                <div className="text-blue-200">Stakeholder Dashboards</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
