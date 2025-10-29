import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReportsContent } from "@/components/reports/reports-content"

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const params = await searchParams
  const now = new Date()
  const month = params.month ? Number.parseInt(params.month) : now.getMonth() + 1
  const year = params.year ? Number.parseInt(params.year) : now.getFullYear()

  // Get all costs for the clinic
  const { data: allCosts } = await supabase.from("costs").select("*").eq("clinic_id", user.id)

  // Get all controls for the clinic
  const { data: allControls } = await supabase
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
    .eq("clinic_id", user.id)

  // Calculate monthly revenue
  const monthlyRevenue =
    allCosts
      ?.filter((cost) => {
        const costDate = new Date(cost.cost_date)
        return costDate.getMonth() + 1 === month && costDate.getFullYear() === year && cost.cost_type === "control"
      })
      .reduce((sum, cost) => sum + cost.amount, 0) || 0

  // Calculate yearly revenue
  const yearlyRevenue =
    allCosts
      ?.filter((cost) => {
        const costDate = new Date(cost.cost_date)
        return costDate.getFullYear() === year && cost.cost_type === "control"
      })
      .reduce((sum, cost) => sum + cost.amount, 0) || 0

  // Calculate total revenue
  const totalRevenue =
    allCosts?.filter((cost) => cost.cost_type === "control").reduce((sum, cost) => sum + cost.amount, 0) || 0

  // Get revenue by control type
  const revenueByType: Record<string, number> = {}
  allControls?.forEach((control) => {
    if (control.cost) {
      revenueByType[control.control_type] = (revenueByType[control.control_type] || 0) + control.cost
    }
  })

  // Get monthly breakdown
  const monthlyBreakdown: Record<string, number> = {}
  allCosts?.forEach((cost) => {
    if (cost.cost_type === "control") {
      const costDate = new Date(cost.cost_date)
      const key = `${costDate.getFullYear()}-${String(costDate.getMonth() + 1).padStart(2, "0")}`
      monthlyBreakdown[key] = (monthlyBreakdown[key] || 0) + cost.amount
    }
  })

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Track your clinic's revenue and performance</p>
        </div>

        <ReportsContent
          stats={{
            monthlyRevenue,
            yearlyRevenue,
            totalRevenue,
            totalControls: allControls?.length || 0,
          }}
          revenueByType={revenueByType}
          monthlyBreakdown={monthlyBreakdown}
          controls={allControls || []}
          month={month}
          year={year}
        />
      </div>
    </div>
  )
}
