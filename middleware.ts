import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  try {
    // Create a response that will be used for the middleware
    const response = NextResponse.next();

    // Create a Supabase client configured to use cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: "",
              expires: new Date(0),
              ...options,
            });
          },
        },
      }
    );

    // Update session and get the response
    const result = await updateSession(request, supabase, response);
    
    // If we got a redirect response, return it
    if (result.status === 307 || result.status === 308) {
      return result;
    }
    
    // Otherwise return the original response with updated cookies
    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/protected/:path*",
    "/api/alerts/:path*",
    "/api/ml/:path*",
    "/auth/:path*"
  ],
};
