-- Create control schedules table for recurring controls
create table if not exists public.control_schedules (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.profiles(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  control_type text not null,
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  start_date date not null,
  end_date date,
  is_active boolean default true,
  cost decimal(10, 2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.control_schedules enable row level security;

-- Control schedules policies
create policy "control_schedules_select_own_clinic"
  on public.control_schedules for select
  using (clinic_id = auth.uid());

create policy "control_schedules_insert_own_clinic"
  on public.control_schedules for insert
  with check (clinic_id = auth.uid());

create policy "control_schedules_update_own_clinic"
  on public.control_schedules for update
  using (clinic_id = auth.uid());

create policy "control_schedules_delete_own_clinic"
  on public.control_schedules for delete
  using (clinic_id = auth.uid());
