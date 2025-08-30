create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  severity text not null check (severity in ('info','watch','warning','severe')),
  audience text not null default 'all' check (audience in ('all','admin','agency','community','resident','researcher')),
  status text not null default 'draft' check (status in ('draft','sent')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.alerts enable row level security;

-- Drop existing policies if they exist
drop policy if exists alerts_select_targeted on public.alerts;
drop policy if exists alerts_insert_own on public.alerts;
drop policy if exists alerts_update_own_or_admin on public.alerts;
drop policy if exists alerts_delete_own_or_admin on public.alerts;

-- Allow authenticated users to read alerts targeted to 'all' or to their role; admins can read all; creators can read their own.
create policy alerts_select_targeted
  on public.alerts for select
  using (
    audience = 'all'
    or created_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and (p.role = audience or p.role = 'admin')
    )
  );

-- Allow inserts by authenticated users; creator must be the row owner or admin
create policy alerts_insert_own
  on public.alerts for insert
  with check (
    created_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

-- Allow updates by creator or admin
create policy alerts_update_own_or_admin
  on public.alerts for update
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );

-- Allow deletes by creator or admin
create policy alerts_delete_own_or_admin
  on public.alerts for delete
  using (
    created_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
      and p.role = 'admin'
    )
  );
