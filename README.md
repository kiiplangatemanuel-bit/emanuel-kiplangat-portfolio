# Emanuel Kiplangat Kirui — Developer Portfolio

A public developer portfolio with a private content-management area at `/admin/login`.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Auth (email/password) and PostgreSQL with Row Level Security
- Vercel deployment

## Features

- Public profile, biography, skills, education, projects and contact links
- Admin sign-in and protected dashboard
- Edit name, headline, biography, phone, email, location and social links
- Add and delete projects, control whether a project is published
- Server-side authorization plus database RLS policies

## Local setup

1. Install Node.js 20.9 or later.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env.local` and fill in your dedicated Supabase project's URL and publishable key.
4. Run `supabase/schema.sql` in that project's SQL Editor.
5. Create your admin user in Supabase Authentication.
6. Set that user's **app_metadata** role to `portfolio_admin` using a trusted admin-side mechanism. Do not set authorization roles in user-editable metadata.
7. Set `ADMIN_EMAILS` to the exact admin email address.
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

The first CMS iteration includes profile/contact editing and project creation/deletion. Dedicated forms for editing skills, education, CV uploads, image uploads and full project editing are planned as the next implementation increment.
