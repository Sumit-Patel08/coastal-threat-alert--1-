"use client"

import { motion } from "framer-motion"
import { Users, Building2, Shield, AlertTriangle, Heart, Network } from "lucide-react"

const dashboardUsers = [
  {
    type: "Government Agencies",
    icon: Building2,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
    role: "Policy makers and regulatory oversight",
    responsibilities: ["Emergency response coordination", "Resource allocation", "Public safety regulations", "Infrastructure planning"],
    connections: ["NGOs", "Disaster Management", "Civic Organizations"]
  },
  {
    type: "NGOs & Environmental Groups",
    icon: Heart,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-700",
    role: "Community advocacy and environmental protection",
    responsibilities: ["Community outreach", "Environmental monitoring", "Awareness campaigns", "Conservation projects"],
    connections: ["Government", "Civic Organizations", "Disaster Management"]
  },
  {
    type: "Civic Organizations",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-700",
    role: "Community representation and local action",
    responsibilities: ["Local community mobilization", "Volunteer coordination", "Public awareness", "Grassroots initiatives"],
    connections: ["NGOs", "Government", "Disaster Management"]
  },
  {
    type: "Disaster Management",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700",
    role: "Emergency response and crisis management",
    responsibilities: ["Emergency response", "Risk assessment", "Evacuation planning", "Recovery coordination"],
    connections: ["Government", "NGOs", "Civic Organizations"]
  },
  {
    type: "Coastal Communities",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-700",
    role: "Direct beneficiaries and local knowledge providers",
    responsibilities: ["Local threat reporting", "Community preparedness", "Traditional knowledge sharing", "Early warning dissemination"],
    connections: ["All stakeholder groups"]
  }
]

const interconnectionBenefits = [
  {
    title: "Real-time Information Sharing",
    description: "Instant communication between all stakeholders ensures rapid response to coastal threats"
  },
  {
    title: "Coordinated Emergency Response",
    description: "Unified command structure enables efficient resource deployment and evacuation procedures"
  },
  {
    title: "Community-Driven Monitoring",
    description: "Local communities provide ground-truth data that enhances prediction accuracy"
  },
  {
    title: "Policy-Informed Action",
    description: "Government agencies can make data-driven decisions based on real-time coastal conditions"
  },
  {
    title: "Sustainable Conservation",
    description: "NGOs and environmental groups coordinate long-term protection strategies"
  },
  {
    title: "Resilient Infrastructure",
    description: "Collaborative planning ensures coastal infrastructure can withstand future threats"
  }
]

export function CoastalAwarenessInterconnectivity() {
  return (
    <section id="interconnectivity" className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Coastal Alert Awareness & Stakeholder Interconnectivity
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            Our platform creates a unified ecosystem where government agencies, NGOs, civic organizations, disaster management teams, 
            and coastal communities work together to protect lives and preserve coastal environments through coordinated action and shared intelligence.
          </p>
        </motion.div>

        {/* Stakeholder Network */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Five-Dashboard Stakeholder Network
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Each stakeholder group has specialized dashboards tailored to their unique needs while maintaining seamless interconnectivity
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {dashboardUsers.map((user, index) => {
              const IconComponent = user.icon
              return (
                <motion.div
                  key={user.type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${user.bgColor} ${user.borderColor} border rounded-xl p-6 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${user.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h4 className="ml-3 font-semibold text-gray-900 dark:text-white">
                      {user.type}
                    </h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {user.role}
                  </p>

                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      Key Responsibilities:
                    </h5>
                    <ul className="space-y-1">
                      {user.responsibilities.map((responsibility, i) => (
                        <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                      Connected To:
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {user.connections.map((connection, i) => (
                        <span key={i} className="text-xs bg-white dark:bg-gray-700 px-2 py-1 rounded border">
                          {connection}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Network Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-center mb-6">
              <Network className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                Interconnected Dashboard Network
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Real-time data flows seamlessly between all stakeholder dashboards, ensuring coordinated response and shared situational awareness
              </p>
            </div>
          </motion.div>
        </div>

        {/* Benefits of Interconnectivity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Benefits of Stakeholder Interconnectivity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interconnectionBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {benefit.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
