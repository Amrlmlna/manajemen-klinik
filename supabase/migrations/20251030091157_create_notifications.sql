-- Create notifications table
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.profiles(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete cascade,
  control_id uuid references public.controls(id) on delete cascade,
  notification_type text not null check (notification_type in ('control_reminder', 'control_completed', 'schedule_created', 'schedule_updated')),
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.notifications enable row level security;

-- Notifications policies
create policy "notifications_select_own_clinic"
  on public.notifications for select
  using (clinic_id = auth.uid());

create policy "notifications_insert_own_clinic"
  on public.notifications for insert
  with check (clinic_id = auth.uid());

create policy "notifications_update_own_clinic"
  on public.notifications for update
  using (clinic_id = auth.uid());
