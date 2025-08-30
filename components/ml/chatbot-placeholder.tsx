"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

function respond(input: string) {
  const q = input.toLowerCase()
  if (q.includes("evacuate") || q.includes("evacuation")) {
    return "If authorities issue an evacuation, follow posted routes, avoid flooded roads, and bring your go-bag."
  }
  if (q.includes("sandbag") || q.includes("prepare")) {
    return "Place sandbags at door thresholds and garage entries. Move valuables above expected water levels."
  }
  if (q.includes("flood insurance")) {
    return "Contact your insurer about NFIP coverage and waiting periods. Document property condition before storms."
  }
  if (q.includes("storm surge")) {
    return "Storm surge can quickly flood low-lying areas. Monitor alerts and avoid coastal roads during peak tides."
  }
  return "For general preparedness: assemble a go-bag, secure documents, and follow local guidance. This is a demo assistant."
}

export function ChatbotPlaceholder() {
  const [msg, setMsg] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)

  const ask = () => {
    if (!msg.trim()) return
    setAnswer(respond(msg))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Coastal Assistant (Demo)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Ask about surge, evacuation, sandbags..."
        />
        <div className="flex items-center gap-2">
          <Button onClick={ask}>Ask</Button>
          <span className="text-xs text-muted-foreground">Demo only. No external AI calls.</span>
        </div>
        {answer && <p className="text-sm">{answer}</p>}
      </CardContent>
    </Card>
  )
}
