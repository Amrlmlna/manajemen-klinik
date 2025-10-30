-- Create controls table for patient control records
create table if not exists public.controls (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  control_type text not null,
  scheduled_date timestamp with time zone not null,
  status text not null default 'scheduled',
  cost decimal(10, 2),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.controls enable row level security;

-- Controls policies - users can manage all data (for personal clinic)
create policy "controls_select_allow"
  on public.controls for select
  using (true);

create policy "controls_insert_allow"
  on public.controls for insert
  with check (true);

create policy "controls_update_allow"
  on public.controls for update
  using (true);

create policy "controls_delete_allow"
  on public.controls for delete
  using (true);