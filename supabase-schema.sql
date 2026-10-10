create table if not exists public.site_content (
  id text primary key check (id = 'homepage'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
revoke all on table public.site_content from anon, authenticated;
grant select, insert, update on table public.site_content to service_role;