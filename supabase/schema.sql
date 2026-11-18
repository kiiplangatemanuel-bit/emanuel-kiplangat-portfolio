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
  resume_url text not null default '',
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

insert into public.portfolio_profile (id, full_name, headline, bio, location, github_url)
values (
  1,
  'Emanuel Kiplangat Kirui',
  'Software Developer · Full-Stack Development',
  'I build practical software solutions, web applications and integrated business systems. I am an Information Technology undergraduate at Karatina University, interested in software engineering, enterprise systems and modern web technologies.',
  'Kenya',
  'https://github.com/kiiplangatemanuel-bit'
) on conflict (id) do nothing;

insert into public.portfolio_education (institution, qualification, start_year, end_year, details, sort_order)
select 'Karatina University', 'Bachelor of Science in Information Technology', '', '2027', 'Undergraduate studies; expected graduation in 2027.', 1
where not exists (
  select 1 from public.portfolio_education
  where institution = 'Karatina University'
    and qualification = 'Bachelor of Science in Information Technology'
);

insert into public.portfolio_projects (title, slug, summary, description, technologies, live_url, repo_url, featured, published, sort_order)
values (
  'OneCore Digital Hub',
  'onecore-digital-hub',
  'An enterprise-oriented digital platform bringing business operations and industry workflows together.',
  'A practical software project focused on connected business operations, application workflows and integrated digital services.',
  '{}',
  'https://onecore-digital-hub.vercel.app/',
  'https://github.com/kiiplangatemanuel-bit/onecore-digital-hub',
  true,
  true,
  1
) on conflict (slug) do nothing;


-- Public portfolio files: public download, administrator-only upload/update/delete.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  5242880,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Portfolio admins can upload portfolio assets" on storage.objects;
create policy "Portfolio admins can upload portfolio assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-assets' and (select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');

drop policy if exists "Portfolio admins can update portfolio assets" on storage.objects;
create policy "Portfolio admins can update portfolio assets"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-assets' and (select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin')
with check (bucket_id = 'portfolio-assets' and (select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');

drop policy if exists "Portfolio admins can delete portfolio assets" on storage.objects;
create policy "Portfolio admins can delete portfolio assets"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-assets' and (select auth.jwt()->'app_metadata'->>'role') = 'portfolio_admin');

-- Create your admin user in Supabase Auth, then set app_metadata.role to
-- "portfolio_admin" using the SQL example in README.md.
-- Never put the service_role key in a NEXT_PUBLIC_ environment variable.