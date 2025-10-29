-- Create controls table (medical appointments/controls)
create table if not exists public.controls (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.profiles(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  control_type text not null,
  scheduled_date timestamp with time zone not null,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes text,
  cost decimal(10, 2),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.controls enable row level security;

-- Controls policies
create policy "controls_select_own_clinic"
  on public.controls for select
  using (clinic_id = auth.uid());

create policy "controls_insert_own_clinic"
  on public.controls for insert
  with check (clinic_id = auth.uid());

create policy "controls_update_own_clinic"
  on public.controls for update
  using (clinic_id = auth.uid());

create policy "controls_delete_own_clinic"
  on public.controls for delete
  using (clinic_id = auth.uid());
