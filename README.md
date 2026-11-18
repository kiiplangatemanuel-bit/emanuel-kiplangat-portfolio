# Emanuel Kiplangat Kirui — Developer Portfolio

A responsive public developer portfolio with a private content-management area at `/admin/login`.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- Supabase Auth and PostgreSQL with Row Level Security
- Supabase Storage for public CV downloads (administrator-only uploads)
- Vercel deployment

## Public website

- Profile, biography and contact links
- Featured and published projects with live/repository links
- Skills grouped by category
- Education history
- Optional downloadable CV
- Responsive layouts and metadata for sharing/search

## Private CMS

- Admin sign-in at `/admin/login`
- Edit profile, biography, location and contact/social links
- Create, edit, publish/unpublish and delete projects
- Create, edit and delete skills and education records
- Upload a public PDF CV (maximum 5 MB)
- Upload a public profile photo (JPG, PNG or WebP; maximum 5 MB)
- Server-side administrator authorization and database/storage RLS

## Local setup

1. Install Node.js 20.9 or later (Node.js 24 LTS is recommended).
2. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/kiiplangatemanuel-bit/emanuel-kiplangat-portfolio.git
   cd emanuel-kiplangat-portfolio
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add the URL and publishable key from the dedicated portfolio Supabase project.
4. Run `supabase/schema.sql` in that project's SQL Editor if setting up a new database. The existing configured project already has the base schema and CV storage migration.
5. Create the administrator user in Supabase Authentication using the invite flow.
6. In the Supabase SQL Editor, grant the role to the exact Auth user email after the user has accepted the invite:
   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"portfolio_admin"}'::jsonb
   where email = 'your-admin-email@example.com';
   ```
7. Set `ADMIN_EMAILS` to the same exact email address.
8. Start the development server:
   ```bash
   npm run dev
   ```
9. Open `http://localhost:3000`. The CMS is at `http://localhost:3000/admin/login`.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_EMAILS` (server-side allowlist)
- `NEXT_PUBLIC_SITE_URL` (optional; use the actual production URL)

Never put a Supabase service-role or secret key in a `NEXT_PUBLIC_` variable.

## Security

- Use the dedicated portfolio Supabase project; never reuse OneCore production database credentials.
- Admin access requires both `app_metadata.role = portfolio_admin` and an email in `ADMIN_EMAILS`.
- Public visitors can read the public profile, published projects, skills, education and public CV.
- Only the portfolio administrator can upload, replace or delete files in the portfolio-assets bucket.
- The CV bucket accepts PDF and the configured public asset bucket is limited to 5 MB per file.
- No service-role key is used in browser code.

## Verification

GitHub Actions runs ESLint, TypeScript checks and a production build on pushes and pull requests to `main`. A green workflow is required before considering a change verified.
