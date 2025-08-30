"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Waves, Wind, BarChart3, LineChart } from "lucide-react"
import { historicalTrendsData, getTrendColor, getCycloneSeverityColor } from "@/lib/mock-data"

export function HistoricalTrendsCharts() {
  const { seaLevelTrends, cycloneFrequency } = historicalTrendsData

  // Calculate max values for scaling
  const maxSeaLevel = Math.max(...seaLevelTrends.map(d => d.level))
  const maxCyclones = Math.max(...cycloneFrequency.map(d => d.count))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Sea Level Trends Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-blue-500" />
            Sea Level Trends
          </CardTitle>
          <p className="text-sm text-muted-foreground">Monthly sea level changes (meters above normal)</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Enhanced Chart Area with Line Graph */}
            <div className="relative h-80 bg-gradient-to-br from-blue-50 via-blue-25 to-transparent rounded-xl p-6 border-2 border-blue-100 shadow-inner">
              <div className="absolute inset-6">
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {[0, 25, 50, 75, 100].map((percent) => (
                    <div 
                      key={percent}
                      className="absolute w-full border-t border-blue-200/50"
                      style={{ top: `${100 - percent}%` }}
                    />
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm font-medium text-blue-700">
                  <span className="bg-white px-2 py-1 rounded shadow-sm">{maxSeaLevel.toFixed(1)}m</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">{(maxSeaLevel * 0.75).toFixed(1)}m</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">{(maxSeaLevel * 0.5).toFixed(1)}m</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">{(maxSeaLevel * 0.25).toFixed(1)}m</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">0m</span>
                </div>
                
                {/* Line Chart with Points */}
                <div className="ml-16 h-full relative">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Line path */}
                    <path
                      d={seaLevelTrends.map((data, index) => {
                        const x = (index / (seaLevelTrends.length - 1)) * 100
                        const y = 100 - (data.level / maxSeaLevel) * 100
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                      }).join(' ')}
                      stroke="url(#blueGradient)"
                      strokeWidth="3"
                      fill="none"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Area under curve */}
                    <path
                      d={[
                        seaLevelTrends.map((data, index) => {
                          const x = (index / (seaLevelTrends.length - 1)) * 100
                          const y = 100 - (data.level / maxSeaLevel) * 100
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' '),
                        'L 100 100 L 0 100 Z'
                      ].join(' ')}
                      fill="url(#blueAreaGradient)"
                      opacity="0.3"
                    />
                    
                    {/* Data points */}
                    {seaLevelTrends.map((data, index) => {
                      const x = (index / (seaLevelTrends.length - 1)) * 100
                      const y = 100 - (data.level / maxSeaLevel) * 100
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="2"
                          fill="#3b82f6"
                          stroke="white"
                          strokeWidth="2"
                          className="hover:r-3 transition-all duration-200 cursor-pointer drop-shadow-md"
                        />
                      )
                    })}
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#1d4ed8" />
                        <stop offset="100%" stopColor="#1e40af" />
                      </linearGradient>
                      <linearGradient id="blueAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Interactive data points with tooltips */}
                  <div className="absolute inset-0">
                    {seaLevelTrends.map((data, index) => {
                      const x = (index / (seaLevelTrends.length - 1)) * 100
                      const y = 100 - (data.level / maxSeaLevel) * 100
                      return (
                        <div
                          key={index}
                          className="absolute group cursor-pointer"
                          style={{ 
                            left: `${x}%`, 
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform duration-200" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl z-10">
                            <div className="font-semibold">{data.month}</div>
                            <div>Level: {data.level}m</div>
                            <div className={`${getTrendColor(data.change)}`}>
                              Change: {data.change > 0 ? '+' : ''}{data.change}m
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-16 right-0 flex justify-between text-xs text-muted-foreground">
                  {seaLevelTrends.filter((_, index) => index % 2 === 0).map((data, index) => (
                    <span key={index} className="bg-white px-2 py-1 rounded shadow-sm font-medium">
                      {data.month.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trend Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {seaLevelTrends[seaLevelTrends.length - 1].level}m
                </div>
                <div className="text-xs text-muted-foreground">Current Level</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold flex items-center justify-center gap-1 ${getTrendColor(seaLevelTrends[seaLevelTrends.length - 1].change)}`}>
                  {seaLevelTrends[seaLevelTrends.length - 1].change > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {Math.abs(seaLevelTrends[seaLevelTrends.length - 1].change)}m
                </div>
                <div className="text-xs text-muted-foreground">Monthly Change</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {((seaLevelTrends[seaLevelTrends.length - 1].level - seaLevelTrends[0].level) / seaLevelTrends[0].level * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">Annual Change</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cyclone Frequency Chart */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-orange-500" />
            Cyclone Frequency
          </CardTitle>
          <p className="text-sm text-muted-foreground">Annual cyclone count by severity (2020-2024)</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Enhanced Line Chart with Multiple Lines for Severity */}
            <div className="relative h-80 bg-gradient-to-br from-orange-50 via-orange-25 to-transparent rounded-xl p-6 border-2 border-orange-100 shadow-inner">
              <div className="absolute inset-6">
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {[0, 25, 50, 75, 100].map((percent) => (
                    <div 
                      key={percent}
                      className="absolute w-full border-t border-orange-200/50"
                      style={{ top: `${100 - percent}%` }}
                    />
                  ))}
                </div>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm font-medium text-orange-700">
                  <span className="bg-white px-2 py-1 rounded shadow-sm">{maxCyclones}</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">{Math.floor(maxCyclones * 0.75)}</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">{Math.floor(maxCyclones * 0.5)}</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">{Math.floor(maxCyclones * 0.25)}</span>
                  <span className="bg-white px-2 py-1 rounded shadow-sm">0</span>
                </div>
                
                {/* Multi-Line Chart */}
                <div className="ml-16 h-full relative">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Total cyclones line */}
                    <path
                      d={cycloneFrequency.map((data, index) => {
                        const x = (index / (cycloneFrequency.length - 1)) * 100
                        const y = 100 - (data.count / maxCyclones) * 100
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                      }).join(' ')}
                      stroke="url(#orangeGradient)"
                      strokeWidth="4"
                      fill="none"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Severe+ cyclones line */}
                    <path
                      d={cycloneFrequency.map((data, index) => {
                        const severeCount = data.severity.severe + data.severity.verySevere
                        const x = (index / (cycloneFrequency.length - 1)) * 100
                        const y = 100 - (severeCount / maxCyclones) * 100
                        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                      }).join(' ')}
                      stroke="url(#redGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Area under total cyclones curve */}
                    <path
                      d={[
                        cycloneFrequency.map((data, index) => {
                          const x = (index / (cycloneFrequency.length - 1)) * 100
                          const y = 100 - (data.count / maxCyclones) * 100
                          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' '),
                        'L 100 100 L 0 100 Z'
                      ].join(' ')}
                      fill="url(#orangeAreaGradient)"
                      opacity="0.2"
                    />
                    
                    {/* Data points for total cyclones */}
                    {cycloneFrequency.map((data, index) => {
                      const x = (index / (cycloneFrequency.length - 1)) * 100
                      const y = 100 - (data.count / maxCyclones) * 100
                      return (
                        <circle
                          key={`total-${index}`}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#ea580c"
                          stroke="white"
                          strokeWidth="2"
                          className="hover:r-4 transition-all duration-200 cursor-pointer drop-shadow-md"
                        />
                      )
                    })}
                    
                    {/* Data points for severe cyclones */}
                    {cycloneFrequency.map((data, index) => {
                      const severeCount = data.severity.severe + data.severity.verySevere
                      const x = (index / (cycloneFrequency.length - 1)) * 100
                      const y = 100 - (severeCount / maxCyclones) * 100
                      return (
                        <circle
                          key={`severe-${index}`}
                          cx={x}
                          cy={y}
                          r="2.5"
                          fill="#dc2626"
                          stroke="white"
                          strokeWidth="2"
                          className="hover:r-3.5 transition-all duration-200 cursor-pointer drop-shadow-md"
                        />
                      )
                    })}
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ea580c" />
                        <stop offset="50%" stopColor="#dc2626" />
                        <stop offset="100%" stopColor="#b91c1c" />
                      </linearGradient>
                      <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="50%" stopColor="#b91c1c" />
                        <stop offset="100%" stopColor="#991b1b" />
                      </linearGradient>
                      <linearGradient id="orangeAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ea580c" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Interactive data points with enhanced tooltips */}
                  <div className="absolute inset-0">
                    {cycloneFrequency.map((data, index) => {
                      const x = (index / (cycloneFrequency.length - 1)) * 100
                      const y = 100 - (data.count / maxCyclones) * 100
                      const severeCount = data.severity.severe + data.severity.verySevere
                      const prevYear = index > 0 ? cycloneFrequency[index - 1] : null
                      const change = prevYear ? data.count - prevYear.count : 0
                      
                      return (
                        <div
                          key={index}
                          className="absolute group cursor-pointer"
                          style={{ 
                            left: `${x}%`, 
                            top: `${y}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <div className="w-5 h-5 bg-orange-500 rounded-full border-2 border-white shadow-lg hover:scale-125 transition-transform duration-200" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-sm rounded-lg px-4 py-3 whitespace-nowrap shadow-xl z-10">
                            <div className="font-bold text-orange-300 mb-2">{data.year} Cyclones</div>
                            <div className="space-y-1">
                              <div className="flex justify-between gap-4">
                                <span>Total:</span>
                                <span className="font-semibold">{data.count}</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>Severe+:</span>
                                <span className="font-semibold text-red-300">{severeCount}</span>
                              </div>
                              <div className="border-t border-gray-600 pt-1 mt-2">
                                <div className="flex justify-between gap-4 text-xs">
                                  <span>Very Severe:</span>
                                  <span className="text-red-400">{data.severity.verySevere}</span>
                                </div>
                                <div className="flex justify-between gap-4 text-xs">
                                  <span>Severe:</span>
                                  <span className="text-orange-400">{data.severity.severe}</span>
                                </div>
                                <div className="flex justify-between gap-4 text-xs">
                                  <span>Moderate:</span>
                                  <span className="text-yellow-400">{data.severity.moderate}</span>
                                </div>
                                <div className="flex justify-between gap-4 text-xs">
                                  <span>Low:</span>
                                  <span className="text-green-400">{data.severity.low}</span>
                                </div>
                              </div>
                              {change !== 0 && (
                                <div className={`flex items-center gap-1 text-xs ${change > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                  {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                  <span>{change > 0 ? '+' : ''}{change} from {data.year - 1}</span>
                                </div>
                              )}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-16 right-0 flex justify-between text-xs text-muted-foreground">
                  {cycloneFrequency.map((data, index) => (
                    <span key={index} className="bg-white px-2 py-1 rounded shadow-sm font-medium">
                      {data.year}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 pt-4 border-t">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-xs">Very Severe</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-xs">Severe</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs">Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Low</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {cycloneFrequency[cycloneFrequency.length - 1].count}
                </div>
                <div className="text-xs text-muted-foreground">2024 Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">
                  {cycloneFrequency[cycloneFrequency.length - 1].severity.verySevere + 
                   cycloneFrequency[cycloneFrequency.length - 1].severity.severe}
                </div>
                <div className="text-xs text-muted-foreground">Severe+</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {(cycloneFrequency.reduce((sum, year) => sum + year.count, 0) / cycloneFrequency.length).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">5-Year Avg</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
