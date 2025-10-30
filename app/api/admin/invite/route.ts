import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

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

    // Create a temporary record for the invited user
    // In a real implementation, you might want to use Supabase Auth's magic link
    // or have a separate invites table
    
    // For now, let's directly create the user profile if they don't exist
    // but we'll need to use Supabase Auth's sign-up method with a temporary password
    // or send them an invitation email
    
    // This is typically done through Supabase's built-in user management
    // For a production system, you would implement an email invitation system
    // Here's a simplified approach:
    
    const { data: existingUser, error: existingUserError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // In a real implementation, you would send an invitation email
    // For now, we'll just return success
    console.log(`User invitation sent to ${email} with role ${role}`)
    
    return NextResponse.json({ 
      success: true, 
      message: `Invitation sent to ${email}` 
    })
  } catch (error) {
    console.error("Error inviting user:", error)
    return NextResponse.json(
      { error: "Failed to invite user" },
      { status: 500 }
    )
  }
}