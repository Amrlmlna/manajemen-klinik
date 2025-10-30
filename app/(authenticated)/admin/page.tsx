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

  // Get clinic statistics (for personal clinic)
  const { data: clinicUsers } = await supabase.from("profiles").select("*")

  const { data: allPatients } = await supabase.from("patients").select("*")

  const { data: allControls } = await supabase.from("controls").select("*")

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
          <h1 className="text-2xl font-bold">Clinic Administration</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        <AdminDashboard
          stats={{
            totalClinics: 1, // Personal clinic only
            totalPatients: allPatients?.length || 0,
            totalControls: allControls?.length || 0,
            totalRevenue: totalRevenue,
          }}
          clinics={clinicUsers || []}
        />
      </div>
    </div>
  )
}
