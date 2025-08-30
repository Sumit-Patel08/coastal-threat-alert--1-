import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardIndex() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Try to read user role from profiles table; default to resident if missing.
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  // @ts-expect-error supabase error may include code
  const role = (profile?.role || (profileErr?.code === "42P01" ? "resident" : "resident")) as
    | "admin"
    | "agency"
    | "community"
    | "resident"
    | "researcher"

  const path = {
    admin: "/dashboard/admin",
    agency: "/dashboard/agency",
    community: "/dashboard/community",
    resident: "/dashboard/resident",
    researcher: "/dashboard/researcher",
  }[role]

  redirect(path)
}
