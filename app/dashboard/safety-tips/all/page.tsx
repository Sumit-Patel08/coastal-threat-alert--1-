"use client"

import { useState } from "react"
import { HydrationBoundary } from "@/components/ui/hydration-boundary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Shield, Search, Filter, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Info, ArrowLeft } from "lucide-react"
import { mockSafetyTips, type SafetyTip } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function AllSafetyTipsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [expandedTip, setExpandedTip] = useState<string | null>(null)

  const filteredTips = mockSafetyTips.filter(tip => {
    const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tip.detailedExplanation.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || tip.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || tip.priority === priorityFilter

    return matchesSearch && matchesCategory && matchesPriority
  })

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

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    setPriorityFilter("all")
  }

  const groupedTips = filteredTips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = []
    }
    acc[tip.category].push(tip)
    return acc
  }, {} as Record<string, SafetyTip[]>)

  return (
    <HydrationBoundary>
      <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/fisherfolk">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Safety Tips Library</h1>
          <p className="text-muted-foreground">
            Comprehensive safety guidelines for coastal activities
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search safety tips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  suppressHydrationWarning
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Weather">Weather</SelectItem>
                <SelectItem value="Navigation">Navigation</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredTips.length} of {mockSafetyTips.length} safety tips
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters} suppressHydrationWarning>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Safety Tips by Category */}
      <div className="space-y-6">
        {Object.keys(groupedTips).length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No safety tips found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedTips).map(([category, tips]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{getCategoryIcon(category as SafetyTip["category"])}</span>
                  {category} Safety Tips
                  <Badge variant="outline" className="ml-2">
                    {tips.length} tip{tips.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tips.map((tip) => (
                    <div key={tip.id}>
                      <Collapsible
                        open={expandedTip === tip.id}
                        onOpenChange={() => toggleExpand(tip.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className={cn(
                            "w-full p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-300",
                            expandedTip === tip.id && "ring-2 ring-blue-200 border-blue-300"
                          )}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {tip.category}
                                  </Badge>
                                  <div className={cn(
                                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                                    getPriorityColor(tip.priority)
                                  )}>
                                    {getPriorityIcon(tip.priority)}
                                    {tip.priority} priority
                                  </div>
                                </div>
                                <h4 className="font-semibold text-base mb-1">{tip.title}</h4>
                                <p className="text-sm text-muted-foreground">{tip.shortDescription}</p>
                              </div>
                              <div className="flex items-center">
                                {expandedTip === tip.id ? (
                                  <ChevronUp className="h-5 w-5" />
                                ) : (
                                  <ChevronDown className="h-5 w-5" />
                                )}
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="mt-3">
                          <div className="pl-4 pr-4 pb-4 space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                              <h5 className="font-medium text-blue-800 mb-2">Detailed Explanation</h5>
                              <p className="text-sm text-blue-700">{tip.detailedExplanation}</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-3 flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Step-by-Step Instructions
                              </h5>
                              <div className="space-y-3">
                                {tip.steps.map((step, index) => (
                                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                                    <span className="bg-green-500 text-white text-sm rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                                      {index + 1}
                                    </span>
                                    <span className="text-sm text-green-800 leading-relaxed">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {tip.images && tip.images.length > 0 && (
                              <div>
                                <h5 className="font-medium mb-3">Visual Guide</h5>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {tip.images.map((image, index) => (
                                    <div key={index} className="h-24 bg-muted rounded-lg flex items-center justify-center">
                                      <span className="text-sm text-muted-foreground">Image {index + 1}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>Priority: {tip.priority}</span>
                                <span>•</span>
                                <span>Category: {tip.category}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-sm">
                                  Share Tip
                                </Button>
                                <Button variant="ghost" size="sm" className="text-sm">
                                  Print
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </HydrationBoundary>
  )
}
