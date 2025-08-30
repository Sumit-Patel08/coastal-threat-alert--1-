import dynamic from "next/dynamic"

const Navbar = dynamic(
  () =>
    import("@/components/site/navbar")
      .then((m) => m.Navbar)
      .catch(() =>
        Promise.resolve(() => (
          <header className="px-4 py-3 border-b">
            <h1 className="text-lg font-semibold">Coastal Threat Alert System</h1>
          </header>
        )),
      ),
  { ssr: true },
)
const Hero = dynamic(
  () =>
    import("@/components/site/hero")
      .then((m) => m.Hero)
      .catch(() =>
        Promise.resolve(() => (
          <section className="mx-auto max-w-6xl px-4 py-12">
            <h2 className="text-2xl font-semibold">Real-time coastal risk awareness</h2>
            <p className="mt-2 text-muted-foreground">Demo homepage placeholder.</p>
          </section>
        )),
      ),
  { ssr: true },
)
const Benefits = dynamic(
  () =>
    import("@/components/site/benefits")
      .then((m) => m.Benefits)
      .catch(() =>
        Promise.resolve(() => (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border p-4">
              <h3 className="font-medium">Fast alerts</h3>
              <p className="text-sm text-muted-foreground">Stay informed about surge and flooding.</p>
            </div>
            <div className="rounded-md border p-4">
              <h3 className="font-medium">Community ready</h3>
              <p className="text-sm text-muted-foreground">Share guidance with residents.</p>
            </div>
          </div>
        )),
      ),
  { ssr: true },
)
const BlueCarbon = dynamic(
  () =>
    import("@/components/site/blue-carbon")
      .then((m) => m.BlueCarbon)
      .catch(() =>
        Promise.resolve(() => (
          <section className="rounded-md border p-4">
            <h3 className="font-medium">Blue Carbon</h3>
            <p className="text-sm text-muted-foreground">Learn how mangroves and marshes protect coasts.</p>
          </section>
        )),
      ),
  { ssr: true },
)
const MapPreview = dynamic(
  () =>
    import("@/components/site/map-preview")
      .then((m) => m.MapPreview)
      .catch(() => Promise.resolve(() => <div className="aspect-[16/9] w-full rounded-md border bg-muted" />)),
  { ssr: true },
)
const MetricsChart = dynamic(
  () =>
    import("@/components/site/charts/metrics-chart")
      .then((m) => m.MetricsChart)
      .catch(() =>
        Promise.resolve(() => (
          <div className="rounded-md border p-6 text-sm text-muted-foreground">Chart placeholder</div>
        )),
      ),
  { ssr: true },
)
const Footer = dynamic(
  () =>
    import("@/components/site/footer")
      .then((m) => m.Footer)
      .catch(() =>
        Promise.resolve(() => (
          <footer className="mt-12 border-t py-8 text-center text-sm text-muted-foreground">
            © Coastal Threat Alert System
          </footer>
        )),
      ),
  { ssr: true },
)

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <section id="features" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Benefits />
      </section>
      <section id="map" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-pretty text-2xl font-semibold md:text-3xl">Live coastal risk map</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Explore surge, erosion, and flood-prone zones. This demo uses mock data to showcase the UI.
        </p>
        <div className="mt-6">
          <MapPreview />
        </div>
      </section>
      <section id="insights" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-pretty text-2xl font-semibold md:text-3xl">Insights and trends</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Monitor sea-level change and alert frequency to prioritize coastal action.
        </p>
        <div className="mt-6">
          <MetricsChart />
        </div>
      </section>
      <section id="learn" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <BlueCarbon />
      </section>
      <Footer />
    </main>
  )
}
