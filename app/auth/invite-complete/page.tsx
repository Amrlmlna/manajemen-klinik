import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function InviteCompletePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const role = searchParams.role as string | undefined

  // Validate role
  if (!role || !["admin", "super_admin"].includes(role)) {
    redirect("/auth/login?error=invalid_invitation")
  }

  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    // If not authenticated, redirect to login
    redirect("/auth/login?error=not_authenticated")
  }

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single()

  if (existingProfile) {
    // Profile already exists, redirect to dashboard
    redirect("/dashboard")
  }

  // Create profile with the role from the invitation
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        email: user.email,
        role: role as "admin" | "super_admin",
        clinic_name: user.email?.split('@')[0] + "'s Clinic", // Default clinic name
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ])

  if (profileError) {
    console.error("Error creating profile:", profileError)
    redirect("/auth/login?error=profile_creation_failed")
  }

  // Successfully created profile, redirect to dashboard
  redirect("/dashboard")
}