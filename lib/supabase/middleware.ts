// lib/supabase/middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  try {
    // Create Edge-compatible Supabase client with proper typing
    const supabase = createMiddlewareClient<Database>({ 
      req: request, 
      res: response 
    });

    // Get current session with error handling
    const { 
      data: { session }, 
      error: sessionError 
    } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      // Continue with the response even if there's a session error
      return response;
    }

    const pathname = request.nextUrl.pathname;

    // Define protected routes
    const isProtected = [
      "/dashboard",
      "/protected",
      "/api/alerts",
      "/api/ml"
    ].some(prefix => pathname.startsWith(prefix));

    const isAuth = pathname.startsWith("/auth");

    // Redirect logged-in users away from auth pages
    if (isAuth && session?.user && !pathname.includes("/auth/sign-up-success")) {
      const url = new URL("/dashboard", request.url);
      return NextResponse.redirect(url);
    }

    // Protect private routes
    if (isProtected && !session?.user) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Return a response even in case of errors
    return response;
  }
}
