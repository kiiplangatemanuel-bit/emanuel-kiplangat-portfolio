# Emanuel Kiplangat Kirui — Developer Portfolio

A public developer portfolio with a private content-management area at `/admin/login`.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Supabase Auth (email/password) and PostgreSQL with Row Level Security
- Vercel deployment

## Features

- Public profile, biography, skills, education, projects and contact links
- Admin sign-in and protected dashboard
- Edit name, headline, biography, phone, email, location, profile image URL and social links
- Create, edit, publish, unpublish and delete projects
- Server-side authorization plus database RLS policies

## Local setup

1. Install Node.js 20.9 or later.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env.local` and fill in your dedicated Supabase project's URL and publishable key.
4. Run `supabase/schema.sql` in that project's SQL Editor.
5. Create your admin user in Supabase Authentication.
6. In the Supabase SQL Editor, set the administrator role on that one Auth user (replace the email):
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"portfolio_admin"}'::jsonb
   where email = 'your-admin-email@example.com';
   ```
7. Set `ADMIN_EMAILS` to the same exact email address.
8. Run `npm run dev`.

## Deploy to Vercel

Import this repository into Vercel and add these environment variables to the Production environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_EMAILS`
- `NEXT_PUBLIC_SITE_URL` (optional)

Deploy after the Supabase schema and administrator role are configured.

## Security notes

- Use a separate Supabase project for the portfolio; never reuse OneCore production database credentials.
- Only a Supabase Auth user with `app_metadata.role = portfolio_admin` and an email in `ADMIN_EMAILS` can enter the dashboard.
- The public website can only read public profile content and published projects.
- No service-role key is used in browser code.
- Keep the administrator account protected with a strong unique password and MFA where available.

## Current scope

The first CMS iteration supports profile/contact editing and full project create, edit, publish/unpublish and delete workflows. Dedicated forms for managing skills, education, CV uploads and direct media uploads are the next increment.
