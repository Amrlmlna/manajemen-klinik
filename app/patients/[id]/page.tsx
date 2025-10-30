import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PatientDetail } from "@/components/patients/patient-detail"

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { id } = await params
  const { data: patient } = await supabase.from("patients").select("*").eq("id", id).single()

  if (!patient) {
    redirect("/patients")
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <header className="border-b">
        <div className="flex items-center gap-4 p-6">
          <Link href="/patients">
            <Button variant="outline">Back</Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {patient.first_name} {patient.last_name}
          </h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <PatientDetail patient={patient} />
      </main>
    </div>
  )
}
