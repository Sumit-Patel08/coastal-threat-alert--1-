"use client"

import { motion } from "framer-motion"
import { BeforeAfterSlider } from "@/components/visual/before-after-slider"
import { ThreeDWaveAnimation } from "@/components/visual/3d-wave-animation"

export function VisualStorytelling() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Visual Impact Stories
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            See the dramatic changes in coastal areas and understand the importance of early warning systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <BeforeAfterSlider
              beforeImage="/coastal-map-preview-tile-ocean-shoreline.png"
              afterImage="/mangrove-and-salt-marsh-coastline.png"
              beforeLabel="Before Storm"
              afterLabel="After Recovery"
              title="Coastal Restoration Impact"
              description="Compare the dramatic changes in coastal areas before and after major weather events, and see how restoration efforts help communities recover."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Real-Time Wave Simulation
              </h3>
              <ThreeDWaveAnimation />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Impact Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">85%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Erosion Reduction</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">92%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Early Warning Success</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">60%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Response Time Improvement</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50M+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Lives Protected</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
