"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

export function MapPreview() {
  const [layers, setLayers] = useState({
    surge: true,
    flood: true,
    erosion: false,
  })

  const toggle = (key: keyof typeof layers) => setLayers((s) => ({ ...s, [key]: !s[key] }))

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => toggle("surge")}
          className={`rounded border px-3 py-1 text-xs ${layers.surge ? "bg-teal-600 text-white" : "bg-background"}`}
          aria-pressed={layers.surge}
        >
          Surge
        </button>
        <button
          onClick={() => toggle("flood")}
          className={`rounded border px-3 py-1 text-xs ${layers.flood ? "bg-teal-600 text-white" : "bg-background"}`}
          aria-pressed={layers.flood}
        >
          Flood
        </button>
        <button
          onClick={() => toggle("erosion")}
          className={`rounded border px-3 py-1 text-xs ${layers.erosion ? "bg-teal-600 text-white" : "bg-background"}`}
          aria-pressed={layers.erosion}
        >
          Erosion
        </button>
      </div>
      <div className="mt-4 overflow-hidden rounded-md border">
        <img src="/coastal-tiles-ocean-satellite-map.png" alt="Coastal map tiles preview" className="h-full w-full object-cover" />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Toggle layers to simulate different hazard overlays. This is a static preview for the demo.
      </p>
    </Card>
  )
}
