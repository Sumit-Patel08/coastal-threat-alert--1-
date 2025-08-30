"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Shield, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Info } from "lucide-react"
import { mockSafetyTips, type SafetyTip } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface EnhancedSafetyTipsProps {
  title?: string
  maxItems?: number
  showMoreButton?: boolean
}

export function EnhancedSafetyTips({ 
  title = "Safety Tips", 
  maxItems = 3, 
  showMoreButton = true 
}: EnhancedSafetyTipsProps) {
  const [expandedTip, setExpandedTip] = useState<string | null>(null)

  const displayTips = maxItems ? mockSafetyTips.slice(0, maxItems) : mockSafetyTips

  const toggleExpand = (tipId: string) => {
    setExpandedTip(expandedTip === tipId ? null : tipId)
  }

  const getCategoryIcon = (category: SafetyTip["category"]) => {
    switch (category) {
      case "Weather":
        return "🌤️"
      case "Navigation":
        return "🧭"
      case "Emergency":
        return "🚨"
      case "Health":
        return "🏥"
      default:
        return "💡"
    }
  }

  const getPriorityColor = (priority: SafetyTip["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getPriorityIcon = (priority: SafetyTip["priority"]) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-3 w-3" />
      case "medium":
        return <Info className="h-3 w-3" />
      case "low":
        return <CheckCircle className="h-3 w-3" />
      default:
        return <Info className="h-3 w-3" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayTips.map((tip) => (
            <div key={tip.id}>
              <Collapsible
                open={expandedTip === tip.id}
                onOpenChange={() => toggleExpand(tip.id)}
              >
                <CollapsibleTrigger asChild>
                  <div className={cn(
                    "w-full p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300",
                    expandedTip === tip.id && "ring-2 ring-blue-200 border-blue-300"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getCategoryIcon(tip.category)}</span>
                          <Badge variant="outline" className="text-xs">
                            {tip.category}
                          </Badge>
                          <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                            getPriorityColor(tip.priority)
                          )}>
                            {getPriorityIcon(tip.priority)}
                            {tip.priority}
                          </div>
                        </div>
                        <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">{tip.shortDescription}</p>
                      </div>
                      <div className="flex items-center">
                        {expandedTip === tip.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2">
                  <div className="pl-3 pr-3 pb-3 space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                      <h5 className="font-medium text-blue-800 mb-2">Detailed Explanation</h5>
                      <p className="text-sm text-blue-700">{tip.detailedExplanation}</p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-3 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Step-by-Step Instructions
                      </h5>
                      <div className="space-y-2">
                        {tip.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-3 p-2 bg-green-50 rounded border-l-4 border-green-400">
                            <span className="bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                              {index + 1}
                            </span>
                            <span className="text-sm text-green-800">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {tip.images && tip.images.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Visual Guide</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {tip.images.map((image, index) => (
                            <div key={index} className="h-20 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">Image {index + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Priority: {tip.priority}</span>
                        <span>•</span>
                        <span>Category: {tip.category}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs">
                        Share Tip
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
          
          {showMoreButton && (
            <Button variant="outline" size="sm" className="w-full mt-3" asChild>
              <a href="/dashboard/safety-tips/all">
                More Safety Tips ({mockSafetyTips.length} total)
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
