import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { NotificationsContent } from "@/components/notifications/notifications-content"

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select(
      `
      *,
      patients:patient_id (
        first_name,
        last_name
      ),
      controls:control_id (
        control_type,
        scheduled_date
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your clinic activities</p>
        </div>

        <NotificationsContent notifications={notifications || []} />
      </div>
    </div>
  )
}
