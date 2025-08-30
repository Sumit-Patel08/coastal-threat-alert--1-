import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Benefits() {
  const items = [
    {
      title: "Unified situational awareness",
      text: "See surge, flood, and erosion indicators together to understand risk hotspots quickly.",
    },
    {
      title: "Actionable alerts",
      text: "Share timely notifications with residents and response teams to reduce impact.",
    },
    {
      title: "Built for pilots",
      text: "Start with mock data now. Plug in live feeds, sensors, or agency sources later.",
    },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <Card key={i.title} className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">{i.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{i.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
