"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CitySelectorProps {
  selectedCity: string
  setSelectedCity: (city: string) => void
  coastalCities: string[]
  aiAnalysisRunning: boolean
  runAIAnalysis: () => void
}

export function CitySelector({ selectedCity, setSelectedCity, coastalCities, aiAnalysisRunning, runAIAnalysis }: CitySelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          AI Monitoring Control
        </CardTitle>
        <CardDescription>Select a coastal city for AI-powered threat analysis and monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Select coastal city" />
              </SelectTrigger>
              <SelectContent>
                {coastalCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={runAIAnalysis} 
            disabled={aiAnalysisRunning}
            className="flex items-center gap-2"
          >
            <Bot className="h-4 w-4" />
            {aiAnalysisRunning ? 'Analyzing...' : 'Run AI Analysis'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
