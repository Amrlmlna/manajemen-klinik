-- Create costs table for tracking revenue and expenses
create table if not exists public.costs (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.profiles(id) on delete cascade,
  control_id uuid references public.controls(id) on delete set null,
  amount decimal(10, 2) not null,
  cost_type text not null check (cost_type in ('control', 'expense', 'refund')),
  description text,
  cost_date date not null,
  created_at timestamp with time zone default now()
);

alter table public.costs enable row level security;

-- Costs policies
create policy "costs_select_own_clinic"
  on public.costs for select
  using (clinic_id = auth.uid());

create policy "costs_insert_own_clinic"
  on public.costs for insert
  with check (clinic_id = auth.uid());

create policy "costs_update_own_clinic"
  on public.costs for update
  using (clinic_id = auth.uid());

create policy "costs_delete_own_clinic"
  on public.costs for delete
  using (clinic_id = auth.uid());
