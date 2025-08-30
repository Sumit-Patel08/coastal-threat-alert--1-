"use client"

import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestConnectionPage() {
  const [testResult, setTestResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult("Testing connection...")

    try {
      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        setTestResult("❌ Environment variables not found. Check your .env.local file.")
        return
      }

      setTestResult(`✅ Environment variables found:
URL: ${supabaseUrl}
Key: ${supabaseKey.substring(0, 20)}...`)

      // Test Supabase client creation
      const supabase = createClient()
      setTestResult(prev => prev + "\n✅ Supabase client created successfully")

      // Test basic query
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      
      if (error) {
        setTestResult(prev => prev + `\n❌ Database query failed: ${error.message}`)
      } else {
        setTestResult(prev => prev + "\n✅ Database connection successful")
      }

    } catch (error) {
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>
            Test your Supabase configuration and connection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Connection"}
          </Button>
          
          {testResult && (
            <div className="p-4 bg-muted rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <h3 className="font-semibold mb-2">Common Issues:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Missing or incorrect .env.local file</li>
              <li>Invalid Supabase URL or API key</li>
              <li>Supabase project is paused or inactive</li>
              <li>Network connectivity issues</li>
              <li>Database schema not set up</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
