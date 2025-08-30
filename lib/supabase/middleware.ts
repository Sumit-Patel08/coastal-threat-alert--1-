import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not configured. Middleware will skip authentication checks.')
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // protected prefixes
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/protected") ||
    pathname.startsWith("/api/alerts") ||
    pathname.startsWith("/api/ml")

  // auth area
  const isAuth = pathname.startsWith("/auth")

  // Debug breadcrumbs (remove after verifying)
  console.log("[v0] middleware:path", pathname, "user?", !!user, "protected?", isProtected, "auth?", isAuth)

  // Allow access to auth pages even when logged in - users must always provide credentials
  // Removed auto-redirect to dashboard from auth pages

  // gate protected routes only
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    // optional: return to original path after login
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
