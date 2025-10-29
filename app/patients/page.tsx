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
    .eq("clinic_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex min-h-svh w-full flex-col">
      <header className="border-b">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold">Patients</h1>
          <Link href="/patients/new">
            <Button>Add Patient</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        <PatientsList patients={patients || []} />
      </main>
    </div>
  )
}
