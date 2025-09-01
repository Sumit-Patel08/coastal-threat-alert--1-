// lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './database.types'

type SupabaseClient = ReturnType<typeof createServerClient<Database>>

export async function updateSession(
  request: NextRequest,
  supabase: SupabaseClient,
  response: NextResponse
) {
  try {
    // Skip if running in Edge Runtime
    if (typeof window !== 'undefined') return response

    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return response
    }

    const pathname = request.nextUrl.pathname

    // Define protected routes
    const isProtected = [
      "/dashboard",
      "/protected",
      "/api/alerts",
      "/api/ml"
    ].some(prefix => pathname.startsWith(prefix))

    const isAuth = pathname.startsWith("/auth")

    // Redirect logged-in users away from auth pages
    if (isAuth && session?.user && !pathname.includes("/auth/sign-up-success")) {
      const url = new URL("/dashboard", request.url)
      return NextResponse.redirect(url)
    }

    // Protect private routes
    if (isProtected && !session?.user) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("next", pathname)
      return NextResponse.redirect(url)
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return response
  }
}
