import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SimpleDashboard } from "@/components/dashboard/simple-dashboard";

export default async function SimpleDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Get user profile to check permissions
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get all controls with patient data (not joining costs to ensure all controls show)
  const { data: controls } = await supabase
    .from("controls")
    .select(
      `
      *,
      patients:patient_id (
        first_name,
        last_name,
        phone
      )
    `
    )
    .order("scheduled_date", { ascending: true });

  // Get all control schedules with patient data
  const { data: schedules } = await supabase
    .from("control_schedules")
    .select(
      `
      *,
      patients:patient_id (
        first_name,
        last_name
      )
    `
    )
    .order("created_at", { ascending: false });

  // Calculate total income - using the 'cost' field from controls table
  const totalIncome =
    controls?.reduce((sum, control) => {
      return sum + (control.cost || 0);
    }, 0) || 0;

  // Get all patients for the quick add form
  const { data: patients } = await supabase
    .from("patients")
    .select("id, first_name, last_name");

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Simple Clinic Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Member control and income tracking
          </p>
        </div>

        <div className="mb-6">
          <div className="bg-primary text-primary-foreground rounded-lg p-4">
            <div className="text-sm">Total Income</div>
            <div className="text-2xl font-bold">
              $
              {totalIncome.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </div>

        <SimpleDashboard
          controls={controls || []}
          schedules={schedules || []}
          patients={patients || []}
          profile={profile}
        />
      </div>
    </div>
  );
}
