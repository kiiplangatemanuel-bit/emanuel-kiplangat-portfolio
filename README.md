# Emanuel Kiplangat Kirui — Portfolio 2.0

A responsive, recruiter-focused developer portfolio with a private content-management workspace at `/admin/login`.

## Stack

- Next.js App Router + TypeScript + React
- Tailwind CSS v4 and custom responsive design system
- Supabase Auth, PostgreSQL and Row Level Security
- Supabase Storage for profile images and downloadable CV files
- GitHub REST API for live public repository highlights
- Vercel Web Analytics (public routes only)
- Vercel deployment

## Public portfolio

- Profile, biography, availability status and contact links
- Flagship OneCore Digital Hub project case study, with problem, contribution, engineering decisions, outcomes and technology stack
- Individual case-study pages and optional screenshot galleries for every project
- Technology filters for the project list
- Skills grouped by category with optional honest self-assessed proficiency
- Experience and education timeline
- Certifications and learning credentials
- Services and collaboration areas
- Testimonials (unpublished by default; publish only with permission)
- GitHub profile and automatically refreshed public repositories
- Blog index and individual article pages
- CV PDF download and online preview
- Contact form with validation, honeypot spam check and a private CMS inbox
- Optional email notification delivery through Resend
- Dark/light theme toggle, responsive layouts and reduced-motion support
- SEO metadata, social previews, robots rules, dynamic sitemap and custom 404 page

## Private CMS

- Admin sign-in at `/admin/login`
- Profile, availability, social/contact links and profile photo management
- CV upload and replacement
- Project CRUD, publish status, featured ordering, case-study fields and screenshot gallery URLs
- Skills CRUD, categories and optional proficiency labels
- Education CRUD
- Extended content workspace at `/admin/content` for experience, certifications, articles, services and testimonials
- Contact enquiry inbox with status tracking
- Server-side administrator authorization and database/storage RLS

## Supabase setup

Use the dedicated portfolio Supabase project. Do not use OneCore production database credentials.

The existing portfolio database has the base schema. Apply these migrations in order to a fresh portfolio database:

1. `202611180001_portfolio_2_0.sql`
2. `202611180002_portfolio_2_0_rls_tuning.sql`

The migrations add the extended content tables, project case-study fields, skill proficiency, availability settings, public read policies, administrator-only content management, and a public insert-only contact form. The contact inbox is readable only by the portfolio administrator.

The portfolio administrator must have both:
- `app_metadata.role = portfolio_admin`
- Their exact email listed in `ADMIN_EMAILS`

## Local setup

1. Install Node.js 20.9 or later (Node.js 24 is used in CI).
2. Clone and install:
   ```bash
   git clone https://github.com/kiiplangatemanuel-bit/emanuel-kiplangat-portfolio.git
   cd emanuel-kiplangat-portfolio
   npm install
   ```
3. Copy `.env.example` to `.env.local` and set the Supabase URL and publishable key from the dedicated portfolio project.
4. Set `ADMIN_EMAILS` to the authorized admin email.
5. Run `npm run dev`.
6. Visit `http://localhost:3000` and `http://localhost:3000/admin/login`.

## Environment variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_EMAILS`

Optional:
- `NEXT_PUBLIC_SITE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (must be a verified sender on Resend)
- `CONTACT_NOTIFICATION_EMAIL`

Contact submissions are saved in Supabase even when email notification settings are not configured. Email notification delivery requires the optional Resend settings.

Never put a Supabase service-role or secret key in a `NEXT_PUBLIC_` variable.

## Security and privacy

- Use the dedicated portfolio Supabase project; never reuse OneCore production database credentials.
- Public visitors can read published portfolio content and submit contact enquiries.
- Only the portfolio administrator can read the contact inbox or create/update/delete portfolio content.
- Contact form submissions are validated server-side and bounded by database checks.
- Admin routes are excluded from Vercel Web Analytics.
- The admin route is disallowed in robots.txt and excluded from the public sitemap.
- Profile images and CVs are public assets; uploads and deletes remain administrator-only.
- No service-role key is used in browser code.

## Verification

GitHub Actions runs ESLint, TypeScript checks and a production build on pushes and pull requests to `main`. A green workflow is required before the update is considered build-verified.
