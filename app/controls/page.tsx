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
    <div className="flex min-h-svh w-full flex-col">
      <header className="border-b">
        <div className="flex items-center justify-between p-6">
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
      </header>
      <main className="flex-1 p-6">
        <ControlsList controls={controls || []} />
      </main>
    </div>
  )
}
