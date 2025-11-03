import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

interface InviteRequestBody {
  email: string
  role: "admin" | "super_admin"
}

export async function POST(request: Request) {
  try {
    const body: InviteRequestBody = await request.json()
    const { email, role } = body

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    if (!["admin", "super_admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Get current user to verify they have permission to invite
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // Verify the current user is a super_admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !profile || profile.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can invite users" },
        { status: 403 }
      )
    }

    // Check if user already exists in the system
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Use Supabase's magic link feature to invite the user
    // This will send an email to the user with a secure login link
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // Include the role in the URL params for the client to handle after sign in
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/invite-complete?role=${role}`,
        shouldCreateUser: true, // This will create a new user if one doesn't exist
      }
    })

    if (authError) {
      console.error("Error sending magic link:", authError)
      return NextResponse.json(
        { error: "Failed to send invitation email" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: `Invitation sent to ${email}. They will receive an email to set up their account.` 
    })
  } catch (error) {
    console.error("Error inviting user:", error)
    return NextResponse.json(
      { error: "Failed to invite user" },
      { status: 500 }
    )
  }
}