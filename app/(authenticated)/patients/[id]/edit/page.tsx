import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PatientForm } from "@/components/patients/patient-form"

export default async function EditPatientPage({
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
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Link href={`/patients/${patient.id}`}>
            <Button variant="outline">Back</Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Patient</h1>
        </div>
        <div className="max-w-2xl">
          <PatientForm patient={patient} />
        </div>
      </div>
    </div>
  )
}
