"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Detection = {
  avg: number
  slope: number
  score: number
  level: "low" | "moderate" | "elevated"
}

export function RuleDetectionPanel() {
  const [det, setDet] = useState<Detection | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const run = async () => {
    setLoading(true)
    setErr(null)
    try {
      const res = await fetch("/api/ml/rule-detect", { method: "POST" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Detection failed")
      setDet(json.detection as Detection)
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Rule-based Detection (Demo)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Runs a simple trend rule on mock sea-level data and stores the result securely.
        </p>
        <Button onClick={run} disabled={loading}>
          {loading ? "Running..." : "Run Detection"}
        </Button>
        {err && <p className="text-sm text-red-600">{err}</p>}
        {det && (
          <div className="rounded border p-3 text-sm">
            <div>
              Level:{" "}
              <span
                className={
                  det.level === "elevated"
                    ? "text-red-700"
                    : det.level === "moderate"
                      ? "text-amber-700"
                      : "text-teal-700"
                }
              >
                {det.level}
              </span>
            </div>
            <div>Avg: {det.avg.toFixed(2)} cm</div>
            <div>Slope: {det.slope.toFixed(2)} cm/step</div>
            <div>Score: {det.score.toFixed(2)}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
