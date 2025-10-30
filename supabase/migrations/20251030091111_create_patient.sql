-- Create patients table
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  date_of_birth date,
  medical_history text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.patients enable row level security;

-- Patients policies - admins can only see their clinic's patients
create policy "patients_select_own_clinic"
  on public.patients for select
  using (clinic_id = auth.uid());

create policy "patients_insert_own_clinic"
  on public.patients for insert
  with check (clinic_id = auth.uid());

create policy "patients_update_own_clinic"
  on public.patients for update
  using (clinic_id = auth.uid());

create policy "patients_delete_own_clinic"
  on public.patients for delete
  using (clinic_id = auth.uid());
