-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients(id) on delete cascade,
  control_id uuid references public.controls(id) on delete cascade,
  notification_type text not null check (notification_type in ('control_reminder', 'control_completed', 'schedule_created', 'schedule_updated')),
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.notifications enable row level security;

-- Notifications policies - users can manage all data (for personal clinic)
create policy "notifications_select_allow"
  on public.notifications for select
  using (true);

create policy "notifications_insert_allow"
  on public.notifications for insert
  with check (true);

create policy "notifications_update_allow"
  on public.notifications for update
  using (true);
