"use client"

import { motion } from "framer-motion"
import { Leaf, Waves, TreePine, Fish, Shield, TrendingUp } from "lucide-react"

const blueCarbon = {
  ecosystems: [
    {
      name: "Mangroves",
      icon: TreePine,
      carbonStorage: "1,023 tons CO₂/hectare",
      protection: "Reduces wave energy by 70%",
      benefits: ["Storm surge protection", "Nursery habitats", "Coastal stabilization"]
    },
    {
      name: "Seagrass Meadows",
      icon: Leaf,
      carbonStorage: "830 tons CO₂/hectare",
      protection: "Reduces wave height by 36%",
      benefits: ["Water filtration", "Oxygen production", "Marine biodiversity"]
    },
    {
      name: "Salt Marshes",
      icon: Waves,
      carbonStorage: "687 tons CO₂/hectare",
      protection: "Absorbs 70% of wave energy",
      benefits: ["Flood control", "Wildlife habitat", "Water purification"]
    }
  ],
  globalStats: [
    { label: "Global Coverage", value: "49 million hectares", description: "Total blue carbon ecosystem area worldwide" },
    { label: "Carbon Storage", value: "25.5 billion tons", description: "Total carbon stored in blue carbon ecosystems" },
    { label: "Annual Sequestration", value: "216 million tons CO₂", description: "Carbon captured annually by these ecosystems" },
    { label: "Economic Value", value: "$48,000/hectare per year", description: "Average ecosystem services value" }
  ]
}

export function BlueCarbonExpanded() {
  return (
    <section id="blue-carbon" className="py-16 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Blue Carbon Ecosystems: Nature's Coastal Defense
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Blue Carbon ecosystems—mangroves, seagrasses, and salt marshes—are among the most carbon-rich ecosystems on Earth, 
            sequestering carbon at rates up to 10 times higher than terrestrial forests while providing critical coastal protection.
          </p>
        </motion.div>

        {/* Ecosystem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {blueCarbon.ecosystems.map((ecosystem, index) => {
            const IconComponent = ecosystem.icon
            return (
              <motion.div
                key={ecosystem.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                    {ecosystem.name}
                  </h3>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Carbon Storage:</strong> {ecosystem.carbonStorage}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      <strong>Protection:</strong> {ecosystem.protection}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Benefits:</h4>
                  <ul className="space-y-1">
                    {ecosystem.benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Global Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Global Blue Carbon Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blueCarbon.globalStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {stat.value}
                </div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why Blue Carbon Matters
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Blue carbon ecosystems store vast amounts of carbon in their soils and biomass, often for centuries or millennia. 
                When these ecosystems are destroyed, they release stored carbon back into the atmosphere, contributing to climate change.
              </p>
              <p>
                Beyond carbon storage, these ecosystems provide critical coastal protection services. They act as natural barriers, 
                reducing wave energy, preventing erosion, and protecting coastal communities from storm surges and flooding.
              </p>
              <p>
                The economic value of blue carbon ecosystems extends far beyond carbon sequestration, including fisheries support, 
                tourism, water filtration, and biodiversity conservation—making their protection essential for sustainable coastal development.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <img
                src="/mangrove-and-salt-marsh-coastline.png"
                alt="Mangrove and salt marsh coastline showing blue carbon ecosystem"
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-white dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Restoration & Conservation Impact
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Restoration and conservation of Blue Carbon ecosystems can reduce coastal hazard exposure by up to 70% 
                  while providing long-term climate benefits through enhanced carbon sequestration and storage.
                </p>
                <a
                  href="https://oceanservice.noaa.gov/ecosystems/coasts/bluecarbon.html"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Learn more at NOAA →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
