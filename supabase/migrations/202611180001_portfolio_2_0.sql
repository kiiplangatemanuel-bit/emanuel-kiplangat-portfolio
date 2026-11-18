-- Portfolio 2.0 content model. Existing profile, projects, skills and education are preserved.
alter table public.portfolio_skills add column if not exists proficiency text;

alter table public.portfolio_profile
  add column if not exists availability_status text not null default 'Open to internships and collaboration',
  add column if not exists website_url text,
  add column if not exists analytics_enabled boolean not null default false;

alter table public.portfolio_projects
  add column if not exists problem text,
  add column if not exists role_and_contributions text,
  add column if not exists challenges_and_solutions text,
  add column if not exists outcomes text,
  add column if not exists gallery_urls text[] not null default '{}';

create table if not exists public.portfolio_experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  organization text not null,
  start_date text,
  end_date text,
  description text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text not null,
  issue_date text,
  credential_url text,
  description text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table if not exists public.portfolio_testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  person_name text not null,
  person_role text,
  organization text,
  sort_order integer not null default 0,
  published boolean not null default false
);

create table if not exists public.portfolio_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  enquiry_type text not null default 'General',
  status text not null default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz not null default now()
);

alter table public.portfolio_experience enable row level security;
alter table public.portfolio_certifications enable row level security;
alter table public.portfolio_posts enable row level security;
alter table public.portfolio_services enable row level security;
alter table public.portfolio_testimonials enable row level security;
alter table public.portfolio_enquiries enable row level security;

do $$
declare t text;
begin
  foreach t in array array['portfolio_experience','portfolio_certifications','portfolio_posts','portfolio_services','portfolio_testimonials'] loop
    execute format('drop policy if exists "Public can read published %1$s" on public.%1$s', t);
    execute format('create policy "Public can read published %1$s" on public.%1$s for select using (published = true)', t);
    execute format('drop policy if exists "Portfolio admins manage %1$s" on public.%1$s', t);
    execute format('create policy "Portfolio admins manage %1$s" on public.%1$s for all using ((select auth.jwt())->''app_metadata''->>''role'' = ''portfolio_admin'') with check ((select auth.jwt())->''app_metadata''->>''role'' = ''portfolio_admin'')', t);
  end loop;
end $$;

drop policy if exists "Anyone can submit portfolio enquiries" on public.portfolio_enquiries;
create policy "Anyone can submit portfolio enquiries" on public.portfolio_enquiries for insert with check (
  length(trim(name)) between 2 and 120 and
  length(trim(email)) between 5 and 254 and
  length(trim(subject)) between 2 and 160 and
  length(trim(message)) between 10 and 5000
);
drop policy if exists "Portfolio admins manage enquiries" on public.portfolio_enquiries;
create policy "Portfolio admins manage enquiries" on public.portfolio_enquiries for all
  using ((select auth.jwt())->'app_metadata'->>'role' = 'portfolio_admin')
  with check ((select auth.jwt())->'app_metadata'->>'role' = 'portfolio_admin');

create index if not exists portfolio_posts_published_idx on public.portfolio_posts (published, published_at desc);
create index if not exists portfolio_enquiries_status_idx on public.portfolio_enquiries (status, created_at desc);
