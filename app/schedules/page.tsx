import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SchedulesList } from "@/components/schedules/schedules-list"

export default async function SchedulesPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: schedules } = await supabase
    .from("control_schedules")
    .select(
      `
      *,
      patients:patient_id (
        first_name,
        last_name
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-svh w-full flex-col">
      <header className="border-b">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold">Recurring Schedules</h1>
          <Link href="/schedules/new">
            <Button>Create Schedule</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        <SchedulesList schedules={schedules || []} />
      </main>
    </div>
  )
}
