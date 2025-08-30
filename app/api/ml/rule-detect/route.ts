import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Very simple mock sea-level series (cm) to demonstrate trend detection
const series = [0, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.95, 1.1, 1.2, 1.25, 1.3]

function computeTrend(values: number[]) {
  const n = values.length
  const avg = values.reduce((a, b) => a + b, 0) / n
  const slope = (values[n - 1] - values[0]) / Math.max(1, n - 1)
  // naive "score": weighted avg + slope
  const score = avg * 0.6 + slope * 0.4
  const level = score > 0.7 ? "elevated" : score > 0.4 ? "moderate" : "low"
  return { avg, slope, score, level }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const result = computeTrend(series)

  // Store detection row (RLS requires created_by)
  const { error } = await supabase.from("detections").insert([
    {
      kind: "sea_level_trend",
      score: result.score,
      details: { avg: result.avg, slope: result.slope, level: result.level, series },
      created_by: user.id,
    },
  ])

  // @ts-ignore supabase error may have code
  if (error?.code === "42P01") {
    return NextResponse.json({ error: "Database not initialized. Run SQL scripts." }, { status: 503 })
  }
  if (error) return NextResponse.json({ error: "Failed to save detection" }, { status: 500 })

  return NextResponse.json({ ok: true, detection: result })
}
