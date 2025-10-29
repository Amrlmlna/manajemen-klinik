import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScheduleForm } from "@/components/schedules/schedule-form"

export default async function NewSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ patient?: string }>
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
  const patientId = params.patient

  const { data: patients } = await supabase
    .from("patients")
    .select("id, first_name, last_name")
    .eq("clinic_id", user.id)
    .order("first_name")

  return (
    <div className="flex min-h-svh w-full flex-col">
      <header className="border-b">
        <div className="flex items-center gap-4 p-6">
          <Link href="/schedules">
            <Button variant="outline">Back</Button>
          </Link>
          <h1 className="text-2xl font-bold">Create Recurring Schedule</h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="max-w-2xl">
          <ScheduleForm patients={patients || []} defaultPatientId={patientId} />
        </div>
      </main>
    </div>
  )
}
