import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PatientForm } from "@/components/patients/patient-form"

export default async function NewPatientPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/patients">
            <Button variant="outline">Back</Button>
          </Link>
          <h1 className="text-2xl font-bold">Add New Patient</h1>
        </div>
        <div className="max-w-2xl">
          <PatientForm />
        </div>
      </div>
    </div>
  )
}
