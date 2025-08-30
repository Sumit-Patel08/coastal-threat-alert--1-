create table if not exists public.dispatch_logs (
  id uuid primary key default gen_random_uuid(),
  alert_id uuid references public.alerts(id) on delete set null,
  channel text not null check (channel in ('push','sms')),
  audience text not null check (audience in ('all','admin','agency','community','resident','researcher')),
  result text not null default 'queued',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.dispatch_logs enable row level security;

-- Creators can see their own, admin can see all
create policy if not exists dispatch_select_own_or_admin
  on public.dispatch_logs for select
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

-- Insert allowed for creator or admin (must set created_by)
create policy if not exists dispatch_insert_own_or_admin
  on public.dispatch_logs for insert
  with check (
    created_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

-- Optional: allow delete/update for creator or admin
create policy if not exists dispatch_update_own_or_admin
  on public.dispatch_logs for update
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

create policy if not exists dispatch_delete_own_or_admin
  on public.dispatch_logs for delete
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );
