"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useAnimation, useInView } from "framer-motion"
import { Play, ShieldAlert, AlertTriangle, MapPin } from "lucide-react"

export function Hero() {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  // Animated gradient background
  useEffect(() => {
    const animateGradient = () => {
      const gradients = [
        'from-blue-500/10 via-cyan-500/10 to-emerald-500/10',
        'from-emerald-500/10 via-blue-500/10 to-cyan-500/10',
        'from-cyan-500/10 via-emerald-500/10 to-blue-500/10'
      ]
      let index = 0
      
      const interval = setInterval(() => {
        const element = document.getElementById('gradient-bg')
        if (element) {
          // Remove all gradient classes
          gradients.forEach(gradient => {
            gradient.split(' ').forEach(className => {
              element.classList.remove(className)
            })
          })
          // Add new gradient classes
          gradients[index].split(' ').forEach(className => {
            element.classList.add(className)
          })
          index = (index + 1) % gradients.length
        }
      }, 8000)
      
      return () => clearInterval(interval)
    }
    
    animateGradient()
  }, [])

  return (
    <section 
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-emerald-500/10 transition-all duration-1000"
      id="gradient-bg"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/4 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-32 lg:pb-40">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.6 }}
            className="lg:py-12"
          >
            <div className="relative">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
                <ShieldAlert className="mr-2 h-4 w-4" />
                Real-time coastal protection
              </div>
              
              <h1 className="text-pretty text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Coastal Threat</span>
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Alert System
                </span>
              </h1>
              
              <p className="mt-6 max-w-lg text-lg leading-8 text-gray-700">
                Advanced early warning system protecting coastal communities from storm surges, 
                flooding, and erosion with real-time monitoring and instant alerts.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group relative overflow-hidden">
                  <Link href="/auth/login" className="flex items-center">
                    <span className="relative z-10">Get Started</span>
                    <span className="absolute inset-0 -z-0 h-full w-0 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="group">
                  <Link href="#features" className="flex items-center">
                    <Play className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    See how it works
                  </Link>
                </Button>
              </div>
              
              <div className="mt-10 flex items-center gap-x-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white bg-gray-200"
                      style={{ zIndex: 3 - i }}
                    />
                  ))}
                </div>
                <div className="text-sm leading-6">
                  <p className="font-semibold text-gray-900">Trusted by 500+ organizations</p>
                  <p className="text-gray-600">Including disaster management teams and coastal cities</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mt-16 sm:mt-24 lg:mt-0"
          >
            <div className="relative mx-auto w-full max-w-sm rounded-2xl bg-white/80 backdrop-blur-sm p-1 ring-1 ring-gray-900/5 shadow-2xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-900">
                <img
                  src="/coastal-tiles-ocean-satellite-map.png"
                  alt="Coastal risk map with alert zones"
                  className="h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                
                {/* Live alert indicator */}
                <div className="absolute left-4 top-4 flex items-center rounded-full bg-red-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  <span className="relative mr-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                  </span>
                  LIVE: 3 Active Alerts
                </div>
                
                {/* Map marker with pulse effect */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-full bg-blue-500/20">
                      <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/30"></div>
                    </div>
                    <MapPin className="relative h-8 w-8 text-blue-600 drop-shadow-lg" strokeWidth={2} fill="white" />
                  </div>
                </div>
                
                {/* Alert card */}
                <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-lg bg-white/90 backdrop-blur-sm shadow-lg">
                  <div className="flex items-center border-b border-gray-100 bg-amber-50 px-4 py-2">
                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">High Risk Alert</span>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-semibold text-gray-900">Coastal Flood Warning</h4>
                    <p className="mt-1 text-xs text-gray-600">High tide expected within 2 hours. Risk of flooding in low-lying areas.</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                        Severe
                      </span>
                      <span className="text-xs text-gray-500">Updated 5 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -left-16 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl lg:block" />
            <div className="absolute -right-16 bottom-1/4 hidden h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl lg:block" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
