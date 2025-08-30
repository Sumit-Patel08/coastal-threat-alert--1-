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

  // Try to read user role from profiles table
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  // Default to fisherfolk if profile not found or error occurs
  const role = (profile?.role || "fisherfolk") as
    | "disaster_management"
    | "coastal_government"
    | "environmental_ngo"
    | "fisherfolk"
    | "civil_defence"

  const path = {
    disaster_management: "/dashboard/disaster-management",
    coastal_government: "/dashboard/coastal-government",
    environmental_ngo: "/dashboard/environmental-ngo",
    fisherfolk: "/dashboard/fisherfolk",
    civil_defence: "/dashboard/civil-defence",
  }[role]

  redirect(path)
}
