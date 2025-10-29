import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ControlDetail } from "@/components/controls/control-detail"

export default async function ControlDetailPage({
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
  const { data: control } = await supabase
    .from("controls")
    .select(
      `
      *,
      patients:patient_id (
        id,
        first_name,
        last_name,
        email
      )
    `,
    )
    .eq("id", id)
    .eq("clinic_id", user.id)
    .single()

  if (!control) {
    redirect("/controls")
  }

  return (
    <div className="flex min-h-svh w-full flex-col">
      <header className="border-b">
        <div className="flex items-center gap-4 p-6">
          <Link href="/controls">
            <Button variant="outline">Back</Button>
          </Link>
          <h1 className="text-2xl font-bold">{control.control_type}</h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <ControlDetail control={control} />
      </main>
    </div>
  )
}
