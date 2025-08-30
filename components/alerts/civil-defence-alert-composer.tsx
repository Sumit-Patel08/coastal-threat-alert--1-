"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, MapPin, Globe, Radio, Smartphone, Satellite, Volume2, Clock, Send } from "lucide-react"
import { AlertType, AlertSeverity, Language, BroadcastChannel } from "@/lib/civil-defence-types"
import { messageTemplates, processMessageTemplate, validateMessageLength, coastalZones, languageNames } from "@/lib/message-templates"
import { AlertManagementService } from "@/lib/alert-management"

interface AlertComposerProps {
  onAlertCreated?: (alertId: string) => void
}

export function CivilDefenceAlertComposer({ onAlertCreated }: AlertComposerProps) {
  const [alertType, setAlertType] = useState<AlertType>('cyclone')
  const [severity, setSeverity] = useState<AlertSeverity>('warning')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedZones, setSelectedZones] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['english', 'hindi'])
  const [selectedChannels, setSelectedChannels] = useState<BroadcastChannel[]>(['sms', 'cell_broadcast'])
  const [messageVariables, setMessageVariables] = useState({
    location: '',
    shelter: '',
    time: '',
    contact: '1554'
  })
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [previewLanguage, setPreviewLanguage] = useState<Language>('english')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const alertService = AlertManagementService.getInstance()

  // Generate preview message
  const getPreviewMessage = (): string => {
    const templateKey = `${alertType}_${severity}`
    const template = messageTemplates[templateKey]?.[previewLanguage]
    if (!template) return 'Template not available'
    
    return processMessageTemplate(template, messageVariables)
  }

  // Validate message length
  const isMessageValid = (): boolean => {
    const message = getPreviewMessage()
    return validateMessageLength(message)
  }

  // Calculate estimated reach
  const getEstimatedReach = (): number => {
    return selectedZones.reduce((total, zoneId) => {
      const zone = coastalZones.find(z => z.id === zoneId)
      return total + (zone ? Math.floor(zone.population * 0.8) : 0)
    }, 0)
  }

  // Handle zone selection
  const toggleZone = (zoneId: string) => {
    setSelectedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    )
  }

  // Handle language selection
  const toggleLanguage = (language: Language) => {
    setSelectedLanguages(prev => 
      prev.includes(language)
        ? prev.filter(lang => lang !== language)
        : [...prev, language]
    )
  }

  // Handle channel selection
  const toggleChannel = (channel: BroadcastChannel) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(ch => ch !== channel)
        : [...prev, channel]
    )
  }

  // Create and broadcast alert
  const handleCreateAlert = async () => {
    setIsCreating(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate required fields
      if (!title || !description || selectedZones.length === 0 || selectedLanguages.length === 0) {
        throw new Error('Please fill in all required fields and select at least one zone and language')
      }

      // Validate message length for all languages
      for (const lang of selectedLanguages) {
        const templateKey = `${alertType}_${severity}`
        const template = messageTemplates[templateKey]?.[lang]
        if (template) {
          const message = processMessageTemplate(template, messageVariables)
          if (!validateMessageLength(message)) {
            throw new Error(`Message too long for ${languageNames[lang]} (${message.length} chars)`)
          }
        }
      }

      // Get selected zones data
      const zones = coastalZones.filter(zone => selectedZones.includes(zone.id))

      // Create alert
      const alert = alertService.createAlert({
        title,
        type: alertType,
        severity,
        description,
        affectedZones: zones,
        languages: selectedLanguages,
        broadcastChannels: selectedChannels,
        scheduledTime: isScheduled ? new Date(scheduledTime) : undefined,
        createdBy: 'civil-defence-admin'
      })

      // Broadcast immediately if not scheduled
      if (!isScheduled) {
        await alertService.broadcastAlert(alert.id, messageVariables)
        setSuccess(`Alert broadcast successfully to ${getEstimatedReach().toLocaleString()} recipients`)
      } else {
        setSuccess(`Alert scheduled for ${new Date(scheduledTime).toLocaleString()}`)
      }

      // Reset form
      setTitle('')
      setDescription('')
      setSelectedZones([])
      setMessageVariables({ location: '', shelter: '', time: '', contact: '1554' })
      
      onAlertCreated?.(alert.id)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="w-full border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">
              Civil Defence Alert Composer
            </h2>
            <p className="text-sm text-muted-foreground font-normal">
              Create and broadcast emergency alerts to coastal communities
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="compose" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="compose" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              📝 Compose
            </TabsTrigger>
            <TabsTrigger value="zones" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              🗺️ Target Zones
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              👁️ Preview & Send
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="alert-type" className="text-sm font-semibold text-gray-700">Alert Type *</Label>
                <Select value={alertType} onValueChange={(value: AlertType) => setAlertType(value)}>
                  <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cyclone" className="py-3">🌀 Cyclone Warning</SelectItem>
                    <SelectItem value="tsunami" className="py-3">🌊 Tsunami Alert</SelectItem>
                    <SelectItem value="storm_surge" className="py-3">🌊 Storm Surge</SelectItem>
                    <SelectItem value="high_tide" className="py-3">🌊 High Tide Warning</SelectItem>
                    <SelectItem value="coastal_erosion" className="py-3">🏖️ Coastal Erosion</SelectItem>
                    <SelectItem value="pollution" className="py-3">🏭 Pollution Alert</SelectItem>
                    <SelectItem value="oil_spill" className="py-3">🛢️ Oil Spill Emergency</SelectItem>
                    <SelectItem value="illegal_fishing" className="py-3">🎣 Illegal Fishing</SelectItem>
                    <SelectItem value="smuggling" className="py-3">🚢 Smuggling Alert</SelectItem>
                    <SelectItem value="security_threat" className="py-3">⚠️ Security Threat</SelectItem>
                    <SelectItem value="all_clear" className="py-3">✅ All Clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="severity" className="text-sm font-semibold text-gray-700">Severity Level *</Label>
                <Select value={severity} onValueChange={(value: AlertSeverity) => setSeverity(value)}>
                  <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info" className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                          <div className="font-medium">Info</div>
                          <div className="text-xs text-muted-foreground">General information</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="warning" className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                        <div>
                          <div className="font-medium">Warning</div>
                          <div className="text-xs text-muted-foreground">Potential danger</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="emergency" className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <div>
                          <div className="font-medium">Emergency</div>
                          <div className="text-xs text-muted-foreground">Immediate action required</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Alert Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Severe Cyclone Warning for Chennai Coast"
                className="h-12 border-2 hover:border-blue-300 focus:border-blue-500 transition-colors"
                required
              />
              {!title && (
                <p className="text-xs text-red-500">Alert title is required</p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of the threat and situation"
                rows={4}
                className="border-2 hover:border-blue-300 focus:border-blue-500 transition-colors resize-none"
                required
              />
              <div className="flex justify-between text-xs">
                <span className={!description ? "text-red-500" : "text-muted-foreground"}>
                  {!description ? "Description is required" : "Provide clear, actionable information"}
                </span>
                <span className="text-muted-foreground">{description.length}/500</span>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Message Variables</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={messageVariables.location}
                    onChange={(e) => setMessageVariables(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Chennai Coast"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shelter">Nearest Shelter</Label>
                  <Input
                    id="shelter"
                    value={messageVariables.shelter}
                    onChange={(e) => setMessageVariables(prev => ({ ...prev, shelter: e.target.value }))}
                    placeholder="Community Center"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time/Duration</Label>
                  <Input
                    id="time"
                    value={messageVariables.time}
                    onChange={(e) => setMessageVariables(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="6 hours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Emergency Contact</Label>
                  <Input
                    id="contact"
                    value={messageVariables.contact}
                    onChange={(e) => setMessageVariables(prev => ({ ...prev, contact: e.target.value }))}
                    placeholder="1554"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Languages</Label>
              <div className="grid gap-2 md:grid-cols-3">
                {Object.entries(languageNames).map(([lang, name]) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <Checkbox
                      id={lang}
                      checked={selectedLanguages.includes(lang as Language)}
                      onCheckedChange={() => toggleLanguage(lang as Language)}
                    />
                    <Label htmlFor={lang} className="text-sm">{name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Broadcast Channels</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { id: 'sms', label: 'SMS', icon: Smartphone },
                  { id: 'cell_broadcast', label: 'Cell Broadcast', icon: Radio },
                  { id: 'satellite', label: 'Satellite', icon: Satellite },
                  { id: 'radio', label: 'Emergency Radio', icon: Radio },
                  { id: 'siren', label: 'Siren System', icon: Volume2 }
                ].map(({ id, label, icon: Icon }) => (
                  <div key={id} className="flex items-center space-x-2">
                    <Checkbox
                      id={id}
                      checked={selectedChannels.includes(id as BroadcastChannel)}
                      onCheckedChange={() => toggleChannel(id as BroadcastChannel)}
                    />
                    <Icon className="h-4 w-4" />
                    <Label htmlFor={id} className="text-sm">{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheduled"
                  checked={isScheduled}
                  onCheckedChange={(checked) => setIsScheduled(checked === true)}
                />
                <Label htmlFor="scheduled" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Schedule for later
                </Label>
              </div>
              {isScheduled && (
                <div className="space-y-2">
                  <Label htmlFor="scheduled-time">Scheduled Time</Label>
                  <Input
                    id="scheduled-time"
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="zones" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <Label>Select Affected Coastal Zones</Label>
              </div>
              <div className="grid gap-3">
                {coastalZones.map((zone) => (
                  <Card key={zone.id} className={`cursor-pointer transition-colors ${selectedZones.includes(zone.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedZones.includes(zone.id)}
                            onCheckedChange={() => toggleZone(zone.id)}
                          />
                          <div>
                            <h4 className="font-medium">{zone.name}</h4>
                            <p className="text-sm text-muted-foreground">{zone.state}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{zone.population.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Population</div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {zone.primaryLanguages.map(lang => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {languageNames[lang]}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Message Preview</Label>
                <Select value={previewLanguage} onValueChange={(value: Language) => setPreviewLanguage(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedLanguages.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        <Globe className="h-4 w-4 mr-2 inline" />
                        {languageNames[lang]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">SMS Preview ({previewLanguage})</div>
                    <div className="p-3 bg-gray-100 rounded border text-sm font-mono">
                      {getPreviewMessage()}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Characters: {getPreviewMessage().length}/160</span>
                      <span className={isMessageValid() ? 'text-green-600' : 'text-red-600'}>
                        {isMessageValid() ? '✓ Valid' : '✗ Too long'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Estimated Reach</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {getEstimatedReach().toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Recipients across {selectedZones.length} zone{selectedZones.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Broadcast Channels</div>
                      <div className="flex flex-wrap gap-1">
                        {selectedChannels.map(channel => (
                          <Badge key={channel} variant="secondary" className="text-xs">
                            {channel.replace('_', ' ').toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
                  {success}
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleCreateAlert}
                  disabled={isCreating || selectedZones.length === 0 || selectedLanguages.length === 0 || !isMessageValid() || !title || !description}
                  className="flex-1 h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  variant={severity === 'emergency' ? 'destructive' : 'default'}
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Broadcasting...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Radio className="h-5 w-5" />
                      {isScheduled ? 'Schedule Alert' : 'Broadcast Now'}
                    </div>
                  )}
                </Button>
                <Button variant="outline" disabled={isCreating} className="h-12 px-6">
                  <Send className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
