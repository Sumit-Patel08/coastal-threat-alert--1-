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
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-12 md:pt-16 md:pb-20">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-pretty text-3xl font-semibold leading-tight md:text-5xl">Coastal Threat Alert System</h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
            Monitor storm surge, flooding, and erosion risks. Share timely alerts with residents, planners, and
            responders to protect coastal communities.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Button asChild>
              <Link href="/auth/login">Open dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#map">View map</Link>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Demo mode: data is mocked for preview. Connect your data sources later.
          </p>
        </div>
        <Card className="p-4">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-md border">
            <img
              src="/coastal-map-preview-tile-ocean-shoreline.png"
              alt="Coastal risk map preview with shoreline and tiles"
              className="h-full w-full object-cover"
            />
          </div>
        </Card>
      </div>
    </section>
  )
}
