"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Disaster Management Director",
    organization: "Mumbai Municipal Corporation",
    content: "The Coastal Threat Alert System has revolutionized our emergency response capabilities. We've reduced response time by 60% and saved countless lives.",
    rating: 5,
    avatar: "/api/placeholder/64/64"
  },
  {
    id: 2,
    name: "Captain Raj Patel",
    role: "Harbor Master",
    organization: "Chennai Port Authority",
    content: "Real-time alerts and accurate predictions have made our operations safer and more efficient. The interactive map is incredibly detailed.",
    rating: 5,
    avatar: "/api/placeholder/64/64"
  },
  {
    id: 3,
    name: "Maria Santos",
    role: "Environmental Scientist",
    organization: "Kerala Marine Research Institute",
    content: "The data visualization tools help us understand coastal erosion patterns better. Essential for our conservation efforts.",
    rating: 5,
    avatar: "/api/placeholder/64/64"
  },
  {
    id: 4,
    name: "Ahmed Hassan",
    role: "Fisherman Community Leader",
    organization: "Goa Fishermen Association",
    content: "Weather alerts come directly to our phones. We know when it's safe to go out to sea. This system protects our livelihoods.",
    rating: 5,
    avatar: "/api/placeholder/64/64"
  },
  {
    id: 5,
    name: "Lt. Col. Priya Sharma",
    role: "Emergency Response Coordinator",
    organization: "National Disaster Response Force",
    content: "Comprehensive risk assessment and early warning system. Helps us deploy resources where they're needed most.",
    rating: 5,
    avatar: "/api/placeholder/64/64"
  },
  {
    id: 6,
    name: "Dr. James Wilson",
    role: "Climate Research Director",
    organization: "Indian Institute of Technology",
    content: "The predictive models are remarkably accurate. This platform is setting new standards for coastal risk management.",
    rating: 5,
    avatar: "/api/placeholder/64/64"
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trusted by Coastal Communities
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            See what disaster management professionals, researchers, and community leaders say about our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-500/20" />
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    {testimonial.organization}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Organizations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">50M+</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">People Protected</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">99.8%</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Monitoring</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
