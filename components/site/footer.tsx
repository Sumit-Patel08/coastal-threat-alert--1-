export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Coastal Threat Alert. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Contact Us:</span>
            <a href="mailto:contact.coastalalert@gmail.com" className="hover:text-foreground">
              contact.coastalalert@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
