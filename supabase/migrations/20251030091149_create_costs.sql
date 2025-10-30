-- Create costs table for tracking revenue and expenses
create table if not exists public.costs (
  id uuid primary key default gen_random_uuid(),
  control_id uuid references public.controls(id) on delete set null,
  amount decimal(10, 2) not null,
  cost_type text not null check (cost_type in ('control', 'expense', 'refund')),
  description text,
  cost_date date not null,
  created_at timestamp with time zone default now()
);

alter table public.costs enable row level security;

-- Costs policies - users can manage all data (for personal clinic)
create policy "costs_select_allow"
  on public.costs for select
  using (true);

create policy "costs_insert_allow"
  on public.costs for insert
  with check (true);

create policy "costs_update_allow"
  on public.costs for update
  using (true);

create policy "costs_delete_allow"
  on public.costs for delete
  using (true);
