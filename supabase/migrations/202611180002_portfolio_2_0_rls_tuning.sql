-- Tune Portfolio 2.0 RLS policies: one SELECT policy per public content table,
-- with administrator visibility included in the same predicate.
do $$
declare t text;
begin
  foreach t in array array['portfolio_experience','portfolio_certifications','portfolio_posts','portfolio_services','portfolio_testimonials'] loop
    execute format('drop policy if exists "Public can read published %1$s" on public.%1$s', t);
    execute format('drop policy if exists "Portfolio admins manage %1$s" on public.%1$s', t);
    execute format('drop policy if exists "Portfolio admins insert %1$s" on public.%1$s', t);
    execute format('drop policy if exists "Portfolio admins update %1$s" on public.%1$s', t);
    execute format('drop policy if exists "Portfolio admins delete %1$s" on public.%1$s', t);
    execute format(
      'create policy "Published content and admin select %1$s" on public.%1$s for select to anon, authenticated using (published = true or (select auth.jwt())->''app_metadata''->>''role'' = ''portfolio_admin'')',
      t
    );
    execute format(
      'create policy "Portfolio admins insert %1$s" on public.%1$s for insert to authenticated with check ((select auth.jwt())->''app_metadata''->>''role'' = ''portfolio_admin'')',
      t
    );
    execute format(
      'create policy "Portfolio admins update %1$s" on public.%1$s for update to authenticated using ((select auth.jwt())->''app_metadata''->>''role'' = ''portfolio_admin'') with check ((select auth.jwt())->''app_metadata''->>''role'' = ''portfolio_admin'')',
      t
    );
    execute format(
      'create policy "Portfolio admins delete %1$s" on public.%1$s for delete to authenticated using ((select auth.jwt())->''app_metadata''->>''role'' = ''portfolio_admin'')',
      t
    );
  end loop;
end $$;

drop policy if exists "Anyone can submit portfolio enquiries" on public.portfolio_enquiries;
drop policy if exists "Portfolio admins manage enquiries" on public.portfolio_enquiries;
drop policy if exists "Portfolio admins read enquiries" on public.portfolio_enquiries;
drop policy if exists "Portfolio admins update enquiries" on public.portfolio_enquiries;
drop policy if exists "Portfolio admins delete enquiries" on public.portfolio_enquiries;

create policy "Anyone can submit portfolio enquiries"
  on public.portfolio_enquiries for insert to anon, authenticated
  with check (
    length(trim(name)) between 2 and 120 and
    length(trim(email)) between 5 and 254 and
    length(trim(subject)) between 2 and 160 and
    length(trim(message)) between 10 and 5000
  );
create policy "Portfolio admins read enquiries"
  on public.portfolio_enquiries for select to authenticated
  using ((select auth.jwt())->'app_metadata'->>'role' = 'portfolio_admin');
create policy "Portfolio admins update enquiries"
  on public.portfolio_enquiries for update to authenticated
  using ((select auth.jwt())->'app_metadata'->>'role' = 'portfolio_admin')
  with check ((select auth.jwt())->'app_metadata'->>'role' = 'portfolio_admin');
create policy "Portfolio admins delete enquiries"
  on public.portfolio_enquiries for delete to authenticated
  using ((select auth.jwt())->'app_metadata'->>'role' = 'portfolio_admin');

drop index if exists public.portfolio_posts_published_idx;
drop index if exists public.portfolio_enquiries_status_idx;
