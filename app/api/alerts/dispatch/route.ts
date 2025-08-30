import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const {
    alertId,
    channels,
    audience: overrideAudience,
  } = body as {
    alertId?: string
    channels?: string[]
    audience?: "all" | "admin" | "agency" | "community" | "resident" | "researcher"
  }

  if (!alertId || !Array.isArray(channels) || channels.length === 0) {
    return NextResponse.json({ error: "Missing alertId or channels" }, { status: 400 })
  }

  // Load the alert and verify permissions: creator or admin may dispatch
  const { data: alert, error: alertErr } = await supabase
    .from("alerts")
    .select("id, audience, created_by")
    .eq("id", alertId)
    .single()

  // @ts-expect-error supabase error may have code
  if (alertErr?.code === "42P01") {
    return NextResponse.json({ error: "Database not initialized. Run SQL scripts." }, { status: 503 })
  }
  if (alertErr || !alert) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 })
  }

  // Check if user is admin (to allow dispatching others' alerts)
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()

  const isAdmin = profile?.role === "admin"
  if (!isAdmin && alert.created_by !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const audience = overrideAudience || alert.audience

  // Filter allowed channels to our stub set
  const allowed = ["push", "sms"]
  const toSend = channels.filter((c: string) => allowed.includes(c))

  if (toSend.length === 0) {
    return NextResponse.json({ error: "No supported channels" }, { status: 400 })
  }

  // Record dispatch logs (stubbed "queued")
  const rows = toSend.map((c) => ({
    alert_id: alert.id,
    channel: c as "push" | "sms",
    audience,
    result: "queued",
    created_by: user.id,
  }))

  const { error: insertErr } = await supabase.from("dispatch_logs").insert(rows)
  // @ts-expect-error code may exist on error
  if (insertErr?.code === "42P01") {
    return NextResponse.json({ error: "Database not initialized. Run SQL scripts." }, { status: 503 })
  }
  if (insertErr) {
    return NextResponse.json({ error: "Failed to record dispatch" }, { status: 500 })
  }

  // Optionally update alert status to 'sent'
  await supabase.from("alerts").update({ status: "sent" }).eq("id", alert.id)

  return NextResponse.json({
    ok: true,
    dispatched: rows.length,
    audience,
    channels: toSend,
  })
}
