-- Update RLS policies to support role-based access
-- Allow super_admins to see all profiles, while others see only their own

drop policy if exists "profiles_select_own" on public.profiles;

create policy "profiles_select_own" 
  on public.profiles for select
  using (
    auth.uid() = id 
    or 
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );

create policy "profiles_select_super_admin" 
  on public.profiles for select
  using (
    (select role from profiles where id = auth.uid()) = 'super_admin'
  );

-- For patients, controls, and costs, allow super_admins to see all records
-- and regular users to see all records (for now, assuming single clinic model)
-- If multitenancy is needed, we'd need to add clinic_id to these tables

-- Update patients RLS if needed
drop policy if exists "patients_select_own" on public.patients;
create policy "patients_select_all" 
  on public.patients for select
  using (true);

-- Update controls RLS if needed
drop policy if exists "controls_select_allow" on public.controls;
create policy "controls_select_all" 
  on public.controls for select
  using (true);

-- Update costs RLS if needed
drop policy if exists "costs_select_allow" on public.costs;
create policy "costs_select_all" 
  on public.costs for select
  using (true);