import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

// Matcher configuration for the middleware

export async function middleware(request: NextRequest) {
  try {
    // Create a response that will be used for the middleware
    const response = NextResponse.next()

    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Skip if running in Edge Runtime
            if (typeof window !== 'undefined') return
            response.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
            // Skip if running in Edge Runtime
            if (typeof window !== 'undefined') return
            response.cookies.set({
              name,
              value: "",
              expires: new Date(0),
              ...options,
            })
          },
        },
      }
    )

    // Get the session
    const { data: { session } } = await supabase.auth.getSession()

    // If user is not signed in and the current path is not /login, redirect to /login
    if (!session && !request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // If user is signed in and the current path is /login, redirect to /dashboard
    if (session && request.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth/callback (auth callback)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback).*)',
  ],
};
