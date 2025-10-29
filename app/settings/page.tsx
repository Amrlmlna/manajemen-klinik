import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClinicSettings } from "@/components/settings/clinic-settings"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your clinic settings and preferences</p>
        </div>

        <ClinicSettings profile={profile} />
      </div>
    </div>
  )
}
