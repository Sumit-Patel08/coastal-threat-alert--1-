"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", seaLevel: 0 },
  { month: "Feb", seaLevel: 0.2 },
  { month: "Mar", seaLevel: 0.3 },
  { month: "Apr", seaLevel: 0.4 },
  { month: "May", seaLevel: 0.6 },
  { month: "Jun", seaLevel: 0.7 },
  { month: "Jul", seaLevel: 0.8 },
  { month: "Aug", seaLevel: 0.95 },
  { month: "Sep", seaLevel: 1.1 },
  { month: "Oct", seaLevel: 1.2 },
  { month: "Nov", seaLevel: 1.25 },
  { month: "Dec", seaLevel: 1.3 },
]

export function MetricsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sea-level trend (cm, mock)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="seaLevel"
                stroke="#0f766e" // teal-700
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
