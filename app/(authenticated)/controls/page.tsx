import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ControlsList } from "@/components/controls/controls-list"

export default async function ControlsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
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
  const filter = params.filter || "all"

  let query = supabase
    .from("controls")
    .select(
      `
      *,
      patients:patient_id (
        first_name,
        last_name,
        email
      )
    `,
    )

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (filter === "today") {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    query = query.gte("scheduled_date", today.toISOString()).lt("scheduled_date", tomorrow.toISOString())
  } else if (filter === "upcoming") {
    query = query.gte("scheduled_date", today.toISOString())
  }

  const { data: controls } = await query.order("scheduled_date", { ascending: true })

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Medical Controls</h1>
          <div className="flex gap-2">
            <Link href="/controls/new">
              <Button>Schedule Control</Button>
            </Link>
            <Link href="/schedules">
              <Button variant="outline">Manage Schedules</Button>
            </Link>
          </div>
        </div>
        <ControlsList controls={controls || []} />
      </div>
    </div>
  )
}
