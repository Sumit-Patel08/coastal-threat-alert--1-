import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Row = {
  id: string
  channel: "push" | "sms"
  audience: "all" | "admin" | "agency" | "community" | "resident" | "researcher"
  result: string
  created_at: string
}

export async function DispatchLogList({ title = "Recent Dispatches" }: { title?: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
  const isAdmin = profile?.role === "admin"

  const query = supabase
    .from("dispatch_logs")
    .select("id, channel, audience, result, created_at")
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: rows, error } = isAdmin ? await query : await query.eq("created_by", user.id)

  const isNotInitialized = (error as any)?.code === "42P01"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isNotInitialized ? (
          <p className="text-sm text-amber-700">
            Database not initialized. Please run scripts/001_profiles.sql through scripts/006_detections.sql.
          </p>
        ) : error ? (
          <p className="text-sm text-red-600">Failed to load dispatch logs.</p>
        ) : !rows?.length ? (
          <p className="text-sm text-muted-foreground">No recent dispatches.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r: Row) => (
              <li key={r.id} className="rounded border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    <span className="font-medium uppercase">{r.channel}</span>
                    <span className="text-muted-foreground"> • {r.audience}</span>
                    <span className="text-muted-foreground"> • {r.result}</span>
                  </span>
                  <time className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</time>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
