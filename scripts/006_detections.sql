create table if not exists public.detections (
  id uuid primary key default gen_random_uuid(),
  kind text not null, -- e.g., 'sea_level_trend'
  score numeric not null default 0, -- arbitrary threshold score
  details jsonb not null default '{}',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.detections enable row level security;

-- Select: creator or admin can see entries (keeps demo secure)
create policy if not exists detections_select_own_or_admin
  on public.detections for select
  using (
    created_by = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Insert: creator or admin
create policy if not exists detections_insert_own_or_admin
  on public.detections for insert
  with check (
    created_by = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Update/Delete: creator or admin
create policy if not exists detections_update_own_or_admin
  on public.detections for update
  using (
    created_by = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy if not exists detections_delete_own_or_admin
  on public.detections for delete
  using (
    created_by = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );
