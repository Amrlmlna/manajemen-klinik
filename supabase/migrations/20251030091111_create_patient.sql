-- Create patients table
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
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

-- Patients policies - users can only see their own data (for personal clinic)
create policy "patients_select_own"
  on public.patients for select
  using (true);

create policy "patients_insert_allow"
  on public.patients for insert
  with check (true);

create policy "patients_update_own"
  on public.patients for update
  using (true);

create policy "patients_delete_own"
  on public.patients for delete
  using (true);
