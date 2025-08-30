"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, ShieldAlert, AlertTriangle, MapPin } from "lucide-react"

export function Hero() {
  const ref = useRef(null)

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
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,white)]" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="animate-in slide-in-from-left-4 fade-in duration-500">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Coastal Threat Alert System
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl">
              Monitor storm surge, flooding, and erosion risks. Share timely alerts with residents, planners, and
              responders to protect coastal communities.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/auth/login">Open Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="#map">View Live Map</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative mt-12 sm:mt-0 animate-in slide-in-from-right-4 fade-in duration-500 delay-200">
            <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-1 shadow-2xl ring-1 ring-white/10">
              <img
                src="/coastal-map-preview-tile-ocean-shoreline.png"
                alt="Coastal Map Preview"
                className="h-auto w-full rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="inline-flex items-center rounded-full bg-blue-500/80 px-3 py-1 text-sm font-medium text-white">
                  Live View
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden animate-in fade-in duration-1000">
        <div className="absolute -left-16 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full bg-blue-500/20 blur-3xl lg:block" />
        <div className="absolute -right-16 bottom-1/4 hidden h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl lg:block" />
      </div>
    </section>
  )
}
