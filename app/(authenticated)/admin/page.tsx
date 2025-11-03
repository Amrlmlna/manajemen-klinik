import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SuperAdminDashboard } from "@/components/admin/superadmin-dashboard"

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

  // Get system-wide statistics for super admin
  // Get all clinics data
  const { data: allClinics } = await supabase
    .from("profiles")
    .select("id, clinic_name, email, created_at, role")
    .order("created_at", { ascending: false })

  // Get all users data
  const { data: allUsers } = await supabase
    .from("profiles")
    .select("id, email, clinic_name, role, created_at")
    .order("created_at", { ascending: false })

  // Get all patients data
  const { data: allPatients } = await supabase.from("patients").select("*")

  // Get all controls data
  const { data: allControls } = await supabase.from("controls").select("*")

  // Get all costs data for revenue calculation
  const { data: allCosts } = await supabase.from("costs").select("*")

  const totalRevenue =
    allCosts?.reduce((sum, cost) => {
      if (cost.cost_type === "control") return sum + cost.amount
      return sum
    }, 0) || 0

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">System Administration</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        <SuperAdminDashboard
          stats={{
            totalClinics: allClinics?.length || 0,
            totalUsers: allUsers?.length || 0,
            totalPatients: allPatients?.length || 0,
            totalControls: allControls?.length || 0,
            totalRevenue: totalRevenue,
          }}
          clinics={allClinics || []}
          users={allUsers || []}
        />
      </div>
    </div>
  )
}
