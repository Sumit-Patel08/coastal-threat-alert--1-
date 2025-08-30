import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/components/auth/auth-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <a
              href="/"
              className="fixed left-3 top-3 z-50 inline-flex h-8 items-center justify-center rounded-md border bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent"
              aria-label="Go to main page"
            >
              Home
            </a>
            {children}
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
