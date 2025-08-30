export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Coastal Threat Alert. All rights reserved.
          </p>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
            <a href="#map" className="hover:text-foreground">
              Map
            </a>
            <a href="#insights" className="hover:text-foreground">
              Insights
            </a>
            <a href="#learn" className="hover:text-foreground">
              Learn
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
