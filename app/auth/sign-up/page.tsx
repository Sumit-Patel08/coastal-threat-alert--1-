"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [organization, setOrganization] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!role) {
      setError("Please select a role")
      setIsLoading(false)
      return
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Authentication service is not configured. Please set up Supabase environment variables.")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })
      
      if (signUpError) throw signUpError

      if (user) {
        // Create profile with role using database function
        const profileData = {
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
          organization: organization,
          user_role: role
        }
        
        // Try using the database function first, fallback to direct insert
        let profileResult, profileError;
        
        try {
          // Try the function approach
          const { data: funcResult, error: funcError } = await supabase
            .rpc('insert_profile', profileData);
          
          if (funcError) {
            console.log("Function failed, trying direct insert:", funcError.message);
            // Fallback to direct insert
            const { data: directResult, error: directError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                first_name: firstName,
                last_name: lastName,
                organization: organization,
                role: role
              })
              .select();
            
            profileResult = directResult;
            profileError = directError;
          } else {
            profileResult = funcResult;
            profileError = null;
          }
        } catch (fallbackError) {
          console.log("Function not available, using direct insert");
          // Direct insert as final fallback
          const { data: directResult, error: directError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              organization: organization,
              role: role
            })
            .select();
          
          profileResult = directResult;
          profileError = directError;
        }

        // Check if profile creation was successful
        if (profileError) {
          console.error("Profile creation error:", profileError);
          throw new Error(`Failed to create profile: ${profileError.message}`);
        }

                console.log("Profile created successfully, redirecting...");
        router.push("/auth/sign-up-success");
      } else {
        throw new Error("User creation failed - no user returned");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          setError("Unable to connect to authentication service. Please check your internet connection and try again.")
        } else {
          setError(error.message)
        }
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription>Create a new account for coastal threat monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disaster_management">Disaster Management Department</SelectItem>
                        <SelectItem value="coastal_government">Coastal City Government</SelectItem>
                        <SelectItem value="environmental_ngo">Environmental NGO</SelectItem>
                        <SelectItem value="fisherfolk">Fisherfolk</SelectItem>
                        <SelectItem value="civil_defence">Civil Defence Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="organization">Organization (Optional)</Label>
                    <Input
                      id="organization"
                      type="text"
                      placeholder="Your organization name"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password">Repeat Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating an account..." : "Sign up"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Login
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
