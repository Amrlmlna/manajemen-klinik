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
    .order("first_name")

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/schedules">
            <Button variant="outline">Back</Button>
          </Link>
          <h1 className="text-2xl font-bold">Create Recurring Schedule</h1>
        </div>
        <div className="max-w-2xl">
          <ScheduleForm patients={patients || []} defaultPatientId={patientId} />
        </div>
      </div>
    </div>
  )
}
