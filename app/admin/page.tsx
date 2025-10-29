import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Only super admins can access this page
  if (profile?.role !== "super_admin") {
    redirect("/dashboard")
  }

  // Get system-wide statistics
  const { data: allProfiles } = await supabase.from("profiles").select("*")

  const { data: allPatients } = await supabase.from("patients").select("*")

  const { data: allControls } = await supabase.from("controls").select("*")

  const { data: allCosts } = await supabase.from("costs").select("*")

  const totalRevenue =
    allCosts?.reduce((sum, cost) => {
      if (cost.cost_type === "control") return sum + cost.amount
      return sum
    }, 0) || 0

  return (
    <div className="flex min-h-svh w-full flex-col">
      <header className="border-b">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold">System Administration</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        <AdminDashboard
          stats={{
            totalClinics: allProfiles?.length || 0,
            totalPatients: allPatients?.length || 0,
            totalControls: allControls?.length || 0,
            totalRevenue: totalRevenue,
          }}
          clinics={allProfiles || []}
        />
      </main>
    </div>
  )
}
