import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PatientsList } from "@/components/patients/patients-list"

export default async function PatientsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Patients</h1>
          <Link href="/patients/new">
            <Button>Add Patient</Button>
          </Link>
        </div>
        <PatientsList patients={patients || []} />
      </div>
    </div>
  )
}
