import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Get user profile to pass clinic name to sidebar
  const { data: profile } = await supabase
    .from("profiles")
    .select("clinic_name")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex h-screen bg-background">
      <Sidebar userId={user.id} clinicName={profile?.clinic_name} />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  )
}