"use client"

import { motion } from "framer-motion"

const partners = [
  {
    name: "National Oceanic and Atmospheric Administration",
    logo: "NOAA",
    category: "Government Agency"
  },
  {
    name: "Indian Space Research Organisation",
    logo: "ISRO",
    category: "Space Agency"
  },
  {
    name: "World Meteorological Organization",
    logo: "WMO",
    category: "International"
  },
  {
    name: "Indian Institute of Technology",
    logo: "IIT",
    category: "Research Institute"
  },
  {
    name: "National Disaster Management Authority",
    logo: "NDMA",
    category: "Government"
  },
  {
    name: "Indian National Centre for Ocean Information Services",
    logo: "INCOIS",
    category: "Ocean Research"
  },
  {
    name: "UNESCO Intergovernmental Oceanographic Commission",
    logo: "UNESCO",
    category: "International"
  },
  {
    name: "Indian Coast Guard",
    logo: "ICG",
    category: "Maritime Security"
  }
]

export function Partners() {
  return (
    <section className="py-16 bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted Partners & Collaborators
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Working with leading organizations worldwide to enhance coastal safety and environmental protection.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 h-32 flex flex-col items-center justify-center border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow">
                  <span className="text-white font-bold text-sm">{partner.logo}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {partner.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            And many more organizations committed to coastal safety and environmental protection
          </p>
        </motion.div>
      </div>
    </section>
  )
}
