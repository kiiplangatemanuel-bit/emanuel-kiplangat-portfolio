-- Run this in the SQL editor of a dedicated Supabase project for this portfolio.
-- Do not use the OneCore production database for this personal website.

create table if not exists public.portfolio_profile (
  id integer primary key default 1 check (id = 1),
  full_name text not null default 'Emanuel Kiplangat Kirui',
  headline text not null default 'Software Developer · Full-Stack Development',
  bio text not null default '',
  location text not null default 'Kenya',
  email text not null default '',
  phone text not null default '',
  github_url text not null default 'https://github.com/kiiplangatemanuel-bit',
  linkedin_url text not null default '',
  avatar_url text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  technologies text[] not null default '{}',
  live_url text not null default '',
  repo_url text not null default '',
  image_url text not null default '',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'Technology',
  sort_order integer not null default 0
);

create table if not exists public.portfolio_education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  qualification text not null,
  start_year text not null default '',
  end_year text not null default '',
  details text not null default '',
  sort_order integer not null default 0
);

alter table public.portfolio_profile enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.portfolio_skills enable row level security;
alter table public.portfolio_education enable row level security;

revoke all on public.portfolio_profile, public.portfolio_projects, public.portfolio_skills, public.portfolio_education from anon, authenticated;
grant select on public.portfolio_profile, public.portfolio_projects, public.portfolio_skills, public.portfolio_education to anon, authenticated;
grant insert, update, delete on public.portfolio_profile, public.portfolio_projects, public.portfolio_skills, public.portfolio_education to authenticated;

create policy "Public can read profile" on public.portfolio_profile for select to anon, authenticated using (true);
create policy "Admins can manage profile" on public.portfolio_profile for all to authenticated
  using ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin')
  with check ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');

create policy "Public can read published projects" on public.portfolio_projects for select to anon, authenticated using (published = true);
create policy "Admins can read all projects" on public.portfolio_projects for select to authenticated
  using ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');
create policy "Admins can insert projects" on public.portfolio_projects for insert to authenticated
  with check ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');
create policy "Admins can update projects" on public.portfolio_projects for update to authenticated
  using ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin')
  with check ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');
create policy "Admins can delete projects" on public.portfolio_projects for delete to authenticated
  using ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');

create policy "Public can read skills" on public.portfolio_skills for select to anon, authenticated using (true);
create policy "Admins manage skills" on public.portfolio_skills for all to authenticated
  using ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin')
  with check ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');

create policy "Public can read education" on public.portfolio_education for select to anon, authenticated using (true);
create policy "Admins manage education" on public.portfolio_education for all to authenticated
  using ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin')
  with check ((select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');

insert into public.portfolio_profile (id) values (1) on conflict (id) do nothing;

-- Create your admin user in Supabase Auth, then set app_metadata.role to
-- "portfolio_admin" using the Supabase dashboard or a trusted server-side admin tool.
-- Never put the service_role key in a NEXT_PUBLIC_ environment variable.