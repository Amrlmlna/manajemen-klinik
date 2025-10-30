-- Create control schedules table for recurring controls
create table if not exists public.control_schedules (
  id uuid primary key default gen_random_uuid(),
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

-- Control schedules policies - users can manage all data (for personal clinic)
create policy "control_schedules_select_allow"
  on public.control_schedules for select
  using (true);

create policy "control_schedules_insert_allow"
  on public.control_schedules for insert
  with check (true);

create policy "control_schedules_update_allow"
  on public.control_schedules for update
  using (true);

create policy "control_schedules_delete_allow"
  on public.control_schedules for delete
  using (true);
