import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, message, patientId, controlId } = body

    const supabase = await createClient()

    const { error } = await supabase.from("notifications").insert({
      patient_id: patientId || null,
      control_id: controlId || null,
      notification_type: type,
      message,
      is_read: false,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
