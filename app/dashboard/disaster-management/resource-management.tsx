"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Truck, Home, Droplets, Utensils, Edit, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Resource {
  id: string
  name: string
  type: string
  quantity: number
  available: number
  status: string
}

interface ResourceManagementCardProps {
  resources: Resource[]
  updateResource: (id: string, field: string, value: number) => void
  getResourceIcon: (type: string) => React.ReactElement
  isEditMode: boolean
  setIsEditMode: (mode: boolean) => void
  passwordInput: string
  setPasswordInput: (password: string) => void
  showPasswordDialog: boolean
  setShowPasswordDialog: (show: boolean) => void
  handlePasswordSubmit: () => void
}

export function ResourceManagementCard({ 
  resources, 
  updateResource, 
  getResourceIcon, 
  isEditMode, 
  setIsEditMode, 
  passwordInput, 
  setPasswordInput, 
  showPasswordDialog, 
  setShowPasswordDialog, 
  handlePasswordSubmit 
}: ResourceManagementCardProps) {
  const { toast } = useToast()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Resource Management
            </CardTitle>
            <CardDescription>Emergency resource allocation and availability</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isEditMode && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditMode(false)}
              >
                Exit Edit Mode
              </Button>
            )}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Resources
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Department Head Access Required</DialogTitle>
                  <DialogDescription>
                    FOR DEPARTMENT HEAD ONLY - Enter password to modify resources
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={passwordInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                      placeholder="Enter department head password"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handlePasswordSubmit}>
                    Authenticate
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getResourceIcon(resource.type)}
                <div>
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Available: {resource.available} / {resource.quantity}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={resource.status === 'good' ? 'secondary' : 'destructive'}>
                  {resource.status}
                </Badge>
                {isEditMode && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateResource(resource.id, 'available', Math.max(0, resource.available - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium px-2">{resource.available}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateResource(resource.id, 'available', Math.min(resource.quantity, resource.available + 1))}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
