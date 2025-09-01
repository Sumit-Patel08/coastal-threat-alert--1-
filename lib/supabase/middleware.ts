// lib/supabase/middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  // Create Edge-compatible Supabase client
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Get current session
  const { data: { session } } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/protected") ||
    pathname.startsWith("/api/alerts") ||
    pathname.startsWith("/api/ml");

  const isAuth = pathname.startsWith("/auth");

  // Redirect logged-in users away from auth pages
  if (isAuth && session?.user && !pathname.includes("/auth/sign-up-success")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Protect private routes
  if (isProtected && !session?.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
