export function BlueCarbon() {
  return (
    <div id="blue-carbon" className="grid gap-6 md:grid-cols-2">
      <div>
        <h2 className="text-pretty text-2xl font-semibold md:text-3xl">Blue Carbon 101</h2>
        <p className="mt-2 text-muted-foreground">
          Blue Carbon ecosystems—mangroves, seagrasses, and salt marshes—sequester and store significant amounts of
          carbon while buffering coasts from storms and erosion.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>Natural surge barriers that reduce wave energy and flooding.</li>
          <li>High carbon sequestration rates compared to terrestrial forests.</li>
          <li>Co-benefits: fisheries, biodiversity, and shoreline stabilization.</li>
        </ul>
        <a
          href="https://oceanservice.noaa.gov/ecosystems/coasts/bluecarbon.html"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
        >
          Learn more at NOAA →
        </a>
      </div>
      <div className="rounded-lg border p-4">
        <img
          src="/mangrove-and-salt-marsh-coastline.png"
          alt="Mangrove and salt marsh coastline"
          className="h-full w-full rounded-md object-cover"
        />
        <p className="mt-3 text-xs text-muted-foreground">
          Restoration and conservation of Blue Carbon ecosystems can reduce hazard exposure and drive long-term climate
          benefits.
        </p>
      </div>
    </div>
  )
}
