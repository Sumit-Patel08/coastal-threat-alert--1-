"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function ThreeDWaveAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const drawWave = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio
      
      ctx.clearRect(0, 0, width, height)

      // Create gradient for water effect
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)')
      gradient.addColorStop(0.5, 'rgba(147, 197, 253, 0.6)')
      gradient.addColorStop(1, 'rgba(219, 234, 254, 0.4)')

      ctx.fillStyle = gradient

      // Draw multiple wave layers for 3D effect
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath()
        ctx.moveTo(0, height)

        const amplitude = 30 - layer * 8
        const frequency = 0.02 + layer * 0.005
        const phase = time * 0.01 + layer * 0.5

        for (let x = 0; x <= width; x += 2) {
          const y = height * 0.6 + 
                   Math.sin(x * frequency + phase) * amplitude +
                   Math.sin(x * frequency * 2 + phase * 1.5) * amplitude * 0.5 +
                   Math.sin(x * frequency * 0.5 + phase * 0.8) * amplitude * 0.3
          
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()

        // Apply different opacity for depth
        ctx.globalAlpha = 0.3 + layer * 0.2
        ctx.fill()
      }

      // Add foam effect
      ctx.globalAlpha = 0.8
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      const foamY = height * 0.6
      for (let x = 0; x <= width; x += 3) {
        const y = foamY + Math.sin(x * 0.03 + time * 0.02) * 15
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()

      time += 1
      animationId = requestAnimationFrame(drawWave)
    }

    resizeCanvas()
    drawWave()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="relative w-full h-64 bg-gradient-to-b from-sky-200 to-blue-300 dark:from-sky-800 dark:to-blue-900 rounded-xl overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Floating elements for added depth */}
      <motion.div
        className="absolute top-8 left-8 w-4 h-4 bg-white/60 rounded-full"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-12 right-16 w-3 h-3 bg-white/40 rounded-full"
        animate={{
          y: [0, -8, 0],
          x: [0, -3, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      <motion.div
        className="absolute bottom-16 left-1/3 w-2 h-2 bg-white/50 rounded-full"
        animate={{
          y: [0, -6, 0],
          x: [0, 4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  )
}
