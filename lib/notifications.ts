import { createClient } from "@/lib/supabase/server"

export async function createNotification(
  clinicId: string,
  type: "control_reminder" | "control_completed" | "schedule_created" | "schedule_updated",
  message: string,
  patientId?: string,
  controlId?: string,
) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("notifications").insert({
      clinic_id: clinicId,
      patient_id: patientId || null,
      control_id: controlId || null,
      notification_type: type,
      message,
      is_read: false,
    })

    if (error) throw error
  } catch (error) {
    console.error("Error creating notification:", error)
  }
}
