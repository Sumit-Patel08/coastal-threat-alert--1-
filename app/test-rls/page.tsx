"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestRLSPage() {
  const [testResult, setTestResult] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const testRLS = async () => {
    setIsLoading(true)
    setTestResult("Testing RLS policies...")

    try {
      const supabase = createClient()

      // Test 1: Read from profiles
      const { data: readData, error: readError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)

      setTestResult(prev => prev + (readError ? `\n❌ Read failed: ${readError.message}` : `\n✅ Read successful: ${readData?.length || 0} rows`))

      // Test 2: Check structure
      const { data: structureData, error: structureError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, organization, role, created_at')
        .limit(0)

      setTestResult(prev => prev + (structureError ? `\n❌ Structure check failed: ${structureError.message}` : "\n✅ Table structure is correct"))

      // Test 3: RPC for policies
      try {
        const { data: policiesData, error: policiesError } = await supabase.rpc('get_policies', { table_name: 'profiles' })

        if (policiesError) {
          setTestResult(prev => prev + `\n⚠️ Could not check policies directly: ${policiesError.message}`)
        } else {
          setTestResult(prev => prev + `\n✅ Policies check: ${policiesData?.length || 0} policies found`)
        }
      } catch (err) {
        setTestResult(prev => prev + `\n⚠️ RPC failed: ${(err as Error).message}`)
      }

      // Test 4: Insert test record
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: '00000000-0000-0000-0000-000000000000', first_name: 'Test', last_name: 'User', role: 'fisherfolk' })

      setTestResult(prev => prev + (insertError?.message.includes('row-level security policy') ? "\n✅ RLS working - insert blocked" : "\n⚠️ Insert succeeded - RLS might not be working"))

    } catch (error) {
      setTestResult(`❌ Error: ${(error as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const checkPoliciesManually = () => {
    setTestResult(prev => prev + "\n\n📋 Manual RLS Policy Check:\n1. Authentication → Policies\n2. profiles table\n3. 4 policies expected")
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>RLS Policy Test</CardTitle>
          <CardDescription>Test Row Level Security policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testRLS} disabled={isLoading}>{isLoading ? "Testing..." : "Test RLS Policies"}</Button>
            <Button onClick={checkPoliciesManually} variant="outline">Check Policies Manually</Button>
          </div>

          {testResult && <div className="p-4 bg-muted rounded-lg"><pre className="whitespace-pre-wrap text-sm">{testResult}</pre></div>}
        </CardContent>
      </Card>
    </div>
  )
}
