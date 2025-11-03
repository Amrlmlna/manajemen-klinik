import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CalendarView } from "@/components/schedules/calendar-view";

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Get user profile to check permissions
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  // Get all controls with patient information for the calendar
  const { data: controls } = await supabase
    .from("controls")
    .select(
      `
      *,
      patients:patient_id (
        first_name,
        last_name
      )
    `
    )
    .order("scheduled_date", { ascending: true });

  // Transform controls data to calendar events format
  const calendarEvents = controls?.map(control => ({
    id: control.id,
    title: `${control.patients?.first_name} ${control.patients?.last_name} - ${control.control_type}`,
    start: new Date(control.scheduled_date),
    end: new Date(new Date(control.scheduled_date).getTime() + 60 * 60 * 1000), // 1 hour duration
    resourceId: control.patient_id,
    status: control.status,
    control_type: control.control_type,
    notes: control.notes || '',
  })) || [];

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Control Calendar</h1>
          <p className="text-muted-foreground">Visual calendar view of all controls</p>
        </div>
        <CalendarView events={calendarEvents} profile={profile} />
      </div>
    </div>
  );
}