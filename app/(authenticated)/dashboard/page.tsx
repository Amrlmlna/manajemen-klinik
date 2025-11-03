import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Super admins can access both regular dashboard and admin panel
  // No automatic redirection - let superadmins choose where to go
  
  // Get clinic statistics for all users (including superadmins)
  const { data: patients } = await supabase.from("patients").select("*")

  const { data: controls } = await supabase
    .from("controls")
    .select(
      `
      *,
      patients:patient_id (
        first_name,
        last_name
      )
    `,
    )
    .gte("scheduled_date", new Date().toISOString())
    .order("scheduled_date", { ascending: true })

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data: todayControls } = await supabase
    .from("controls")
    .select(
      `
      *,
      patients:patient_id (
        first_name,
        last_name
      )
    `,
    )
    .gte("scheduled_date", today.toISOString())
    .lt("scheduled_date", tomorrow.toISOString())
    .order("scheduled_date", { ascending: true })

  const { data: costs } = await supabase.from("costs").select("*")

  const thisMonthRevenue =
    costs
      ?.filter((cost) => {
        const costDate = new Date(cost.cost_date)
        const now = new Date()
        return costDate.getMonth() === now.getMonth() && costDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, cost) => (cost.cost_type === "control" ? sum + cost.amount : sum), 0) || 0

  return (
    <DashboardContent
      profile={profile}
      stats={{
        totalPatients: patients?.length || 0,
        totalControls: controls?.length || 0,
        todayControls: todayControls?.length || 0,
        thisMonthRevenue: thisMonthRevenue,
      }}
      todayControls={todayControls || []}
    />
  )
}